import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createReminder = mutation({
  args: {
    taskId: v.id('tasks'),
    text: v.string(),
    dueDate: v.optional(v.string()) // ISO date string
  },
  handler: async (ctx, args) => {
    const { taskId, text, dueDate } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const reminder = await ctx.db.insert('reminders', {
      userId,
      taskId,
      text,
      isCompleted: false,
      dueDate: dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return reminder;
  }
});

export const updateReminder = mutation({
  args: {
    id: v.id('reminders'),
    isCompleted: v.boolean(),
    text: v.optional(v.string()),
    dueDate: v.optional(v.string()) // ISO date string
  },
  handler: async (ctx, args) => {
    const { id, isCompleted, text, dueDate } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    await ctx.db.patch(id, {
      isCompleted,
      ...(text ? { text } : {}),
      ...(dueDate ? { dueDate } : {}),
      updatedAt: new Date().toISOString()
    });

    return true;
  }
});

export const deleteReminder = mutation({
  args: { id: v.id('reminders') },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
    return true;
  }
});

export const getReminders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    return await ctx.db
      .query('reminders')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();
  }
});
