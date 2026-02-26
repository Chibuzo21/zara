import { query } from "../_generated/server";

// Get all imprest requests
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("imprestRequests").order("desc").take(50);
  },
});
