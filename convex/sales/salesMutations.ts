import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Record a sale
export const create = mutation({
  args: {
    saleDate: v.string(),
    productId: v.id("products"),
    quantitySold: v.number(),
    unitPrice: v.number(),
    totalAmount: v.number(),
    productName: v.string(),
    salesStaffId: v.optional(v.id("staff")),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("transfer"),
      v.literal("pos"),
      v.literal("credit"),
    ),
    customerName: v.optional(v.string()),
    notes: v.optional(v.string()),
    recordedBy: v.optional(v.id("users")),
    saleType: v.optional(v.union(v.literal("shop"), v.literal("transport"))),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sales", args);
  },
});

// Update sale
export const update = mutation({
  args: {
    id: v.id("sales"),
    quantitySold: v.optional(v.number()),
    unitPrice: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    paymentMethod: v.optional(
      v.union(
        v.literal("cash"),
        v.literal("transfer"),
        v.literal("pos"),
        v.literal("credit"),
      ),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete sale
export const remove = mutation({
  args: { id: v.id("sales") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
