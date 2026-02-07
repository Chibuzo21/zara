import { query } from "./_generated/server";

// Get all active suppliers
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("suppliers")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Get supplier by ID
export const getById = query({
  handler: async (ctx) => {
    return await ctx.db.query("suppliers").collect();
  },
});
