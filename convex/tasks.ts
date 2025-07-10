import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  }
});

export const update = mutation({
  args: { id: v.id('tasks'), isCompleted: v.boolean(), text: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, isCompleted, text } = args;
    await ctx.db.patch(id, { isCompleted, ...(text ? { text } : {}) });

    return true;
  }
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    const task = await ctx.db.insert('tasks', {
      text,
      isCompleted: false
    });

    return task;
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
