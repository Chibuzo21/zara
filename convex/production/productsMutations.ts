import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create product
export const create = mutation({
  args: {
    productName: v.string(),
    category: v.string(),
    basePrice: v.number(),
    productionCost: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

// Update product
export const update = mutation({
  args: {
    id: v.id("products"),
    productName: v.optional(v.string()),
    category: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    productionCost: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete product
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
