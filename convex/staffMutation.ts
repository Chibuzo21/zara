import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create new staff
export const create = mutation({
  args: {
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("admin"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staff", args);
  },
});

// Update staff
export const update = mutation({
  args: {
    id: v.id("staff"),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("owner"),
        v.literal("production"),
        v.literal("packaging"),
        v.literal("sales"),
        v.literal("admin"),
      ),
    ),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("suspended"),
      ),
    ),
    dateHired: v.optional(v.string()),
    baseSalary: v.optional(v.number()),
    commissionRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete staff
export const remove = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Add performance review
export const addPerformance = mutation({
  args: {
    staffId: v.id("staff"),
    reviewDate: v.string(),
    performanceScore: v.number(),
    attendanceScore: v.number(),
    qualityScore: v.number(),
    notes: v.optional(v.string()),
    reviewedBy: v.id("staff"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staffPerformance", args);
  },
});
