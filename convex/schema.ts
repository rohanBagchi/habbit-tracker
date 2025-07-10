import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id('users'),
    text: v.string(),
    isCompleted: v.boolean()
  }).index('userId', ['userId'])
});
