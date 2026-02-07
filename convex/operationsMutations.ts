import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create new daily operation
export const create = mutation({
  args: {
    operationDate: v.string(),
    openingCash: v.number(),
    closingCash: v.number(),
    totalSales: v.number(),
    totalExpenses: v.number(),
    cashVariance: v.number(),
    notes: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("closed")),
    loggedBy: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    // Check if operation already exists for this date
    const existing = await ctx.db
      .query("dailyOperations")
      .withIndex("by_date", (q) => q.eq("operationDate", args.operationDate))
      .first();

    if (existing) {
      throw new Error("Daily operation already exists for this date");
    }

    return await ctx.db.insert("dailyOperations", args);
  },
});

// Update daily operation
export const update = mutation({
  args: {
    id: v.id("dailyOperations"),
    openingCash: v.optional(v.number()),
    closingCash: v.optional(v.number()),
    totalSales: v.optional(v.number()),
    totalExpenses: v.optional(v.number()),
    cashVariance: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Close a day (change status to closed)
export const closeDay = mutation({
  args: { id: v.id("dailyOperations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "closed" });
    return args.id;
  },
});

// Delete operation
export const remove = mutation({
  args: { id: v.id("dailyOperations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
