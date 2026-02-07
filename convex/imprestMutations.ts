import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create imprest request
export const create = mutation({
  args: {
    requestNumber: v.string(),
    requestedBy: v.id("staff"),
    amountRequested: v.number(),
    purpose: v.string(),
    requestDate: v.string(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("disbursed"),
      v.literal("retired"),
      v.literal("rejected"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("imprestRequests", args);
  },
});

// Approve imprest request
export const approve = mutation({
  args: {
    id: v.id("imprestRequests"),
    approvedBy: v.id("staff"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "approved",
      approvedBy: args.approvedBy,
      approvedDate: new Date().toISOString().split("T")[0],
    });
    return args.id;
  },
});

// Reject imprest request
export const reject = mutation({
  args: {
    id: v.id("imprestRequests"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, notes } = args;
    await ctx.db.patch(id, {
      status: "rejected",
      notes,
    });
    return id;
  },
});

// Disburse imprest (mark as disbursed)
export const disburse = mutation({
  args: { id: v.id("imprestRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "disbursed",
      disbursedDate: new Date().toISOString().split("T")[0],
    });
    return args.id;
  },
});

// Retire imprest (mark as retired)
export const retire = mutation({
  args: { id: v.id("imprestRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "retired",
      retirementDate: new Date().toISOString().split("T")[0],
    });
    return args.id;
  },
});

// Delete imprest request
export const remove = mutation({
  args: { id: v.id("imprestRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
