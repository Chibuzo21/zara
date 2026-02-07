import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all inventory items
export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const itemsWithSuppliers = await Promise.all(
      items.map(async (item) => {
        const supplier = item.supplierId
          ? await ctx.db.get(item.supplierId)
          : null;
        return { ...item, supplier };
      }),
    );

    return itemsWithSuppliers;
  },
});

// Get low stock items
export const getLowStock = query({
  handler: async (ctx) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return items.filter((item) => item.currentStock <= item.reorderLevel);
  },
});

// Get item by ID with transactions
export const getWithTransactions = query({
  args: { id: v.id("inventoryItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    const transactions = await ctx.db
      .query("inventoryTransactions")
      .withIndex("by_item", (q) => q.eq("itemId", args.id))
      .order("desc")
      .take(20);

    return { item, transactions };
  },
});
