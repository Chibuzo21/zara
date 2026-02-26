import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all daily operations
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("dailyOperations")
      .withIndex("by_date")
      .order("desc")
      .take(30);
  },
});

// Get operation by date
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyOperations")
      .withIndex("by_date", (q) => q.eq("operationDate", args.date))
      .first();
  },
});

// Get operations by date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const ops = await ctx.db
      .query("dailyOperations")
      .withIndex("by_date")
      .collect();

    return ops.filter(
      (op) =>
        op.operationDate >= args.startDate && op.operationDate <= args.endDate,
    );
  },
});
