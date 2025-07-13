import { v } from 'convex/values';
import { mutation, query, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    return await ctx.db
      .query('tasks')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();
  }
});

export const update = mutation({
  args: { id: v.id('tasks'), isCompleted: v.boolean(), text: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { id, isCompleted, text } = args;
    await ctx.db.patch(id, { isCompleted, ...(text ? { text } : {}) });

    // regenerate the reminder if the text was updated
    if (text) {
      await ctx.scheduler.runAfter(0, internal.tasks.generateReminder, {
        todoText: text,
        taskId: id,
        userId: userId
      });
    }

    return true;
  }
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const taskId = await ctx.db.insert('tasks', {
      userId,
      text,
      isCompleted: false
    });

    await ctx.scheduler.runAfter(0, internal.tasks.generateReminder, {
      todoText: text,
      taskId: taskId,
      userId: userId
    });

    return taskId;
  }
});

export const deleteTask = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);

    return true;
  }
});

export const generateReminder = internalAction({
  args: {
    taskId: v.id('tasks'),
    userId: v.id('users'),
    todoText: v.string()
  },
  handler: async (ctx, { taskId, userId, todoText }) => {
    const feature = await ctx.runQuery(internal.feature.getFeatureByNameInternal, {
      featureName: 'AI_PARSING',
      userId: userId
    });

    if (!feature?.isEnabled) {
      console.warn('AI_PARSING feature is not enabled for user:', userId);
      return;
    }

    const finalPrompt = `
      You are a reminder parser.

      Convert natural language reminders into structured JSON with the following format:
      {
        "text": string,               // What the reminder is about
        "dueDate": ISO 8601 string    // UTC date and time for the reminder
      }

      The "dueDate" must be in ISO 8601 format (e.g. "2025-07-10T17:00:00Z").

      If the input does not include a time or date, return "dueDate": null.

      DO not give an explanation, just correct JSON that is parseable. Remove the \`json\` tag from the output.Respond only with JSON

      Now parse this:

      "${todoText}"
    `;

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY || ''
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }]
        })
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to parse reminder: ${res.statusText}`);
    }
    const data = await res.json();

    const content = data.candidates?.[0]?.content.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content returned from AI');
    }
    try {
      const parsed = extractJsonFromGemini(content);

      if (
        typeof parsed.text !== 'string' ||
        (parsed.dueDate && typeof parsed.dueDate !== 'string')
      ) {
        throw new Error('Parsed content is not in the expected format');
      }

      await ctx.runMutation(internal.reminders.createReminderInternal, {
        taskId: taskId,
        userId: userId,
        text: parsed.text,
        dueDate: parsed.dueDate
      });
    } catch (error) {
      throw new Error(
        `Failed to parse AI response: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
});

function extractJsonFromGemini(raw: string): {
  text: string;
  dueDate?: string;
} {
  // Remove code block markers if present
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse Gemini response:', e);
    throw new Error('Invalid JSON from Gemini');
  }
}
