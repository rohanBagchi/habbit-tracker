import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id('users'),
    text: v.string(),
    isCompleted: v.boolean()
  }).index('userId', ['userId']),
  reminders: defineTable({
    userId: v.id('users'),
    taskId: v.id('tasks'),
    text: v.string(),
    isCompleted: v.boolean(),
    dueDate: v.optional(v.string()), // ISO date string
    createdAt: v.optional(v.string()), // ISO date string
    updatedAt: v.optional(v.string()) // ISO date string
  })
    .index('userId', ['userId'])
    .index('taskId', ['taskId'])
});
