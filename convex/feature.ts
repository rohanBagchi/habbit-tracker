import { v } from 'convex/values';
import { query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getFeatureByName = query({
  args: { featureName: v.string() },
  handler: async (ctx, args) => {
    const { featureName } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const feature = await ctx.db
      .query('features')
      .filter((q) => q.eq(q.field('featureName'), featureName))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    return feature || null;
  }
});
