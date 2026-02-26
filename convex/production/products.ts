import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all products
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// Get active products only
export const getActive = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((p) => p.status === "active");
  },
});

// Get product by ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get products by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((p) => p.category === args.category);
  },
});
