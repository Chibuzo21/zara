import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create commission record
export const create = mutation({
  args: {
    staffId: v.id("staff"),
    periodStart: v.string(),
    periodEnd: v.string(),
    grossCommission: v.number(),
    deductions: v.number(),
    penalties: v.number(),
    netCommission: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("paid"),
    ),
    // approvedBy: v.optional(v.id("staff")),
    approvedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("commissionRecords", args);
  },
});

// Approve commission
export const approve = mutation({
  args: {
    id: v.id("commissionRecords"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "approved",

      approvedAt: new Date().toISOString(),
    });
    return args.id;
  },
});

// Mark as paid
export const markAsPaid = mutation({
  args: { id: v.id("commissionRecords") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "paid",
    });
    return args.id;
  },
});

// Delete commission record
export const remove = mutation({
  args: { id: v.id("commissionRecords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
