import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create inventory item
export const create = mutation({
  args: {
    itemName: v.string(),
    category: v.union(
      v.literal("flour"),
      v.literal("sugar"),
      v.literal("dairy"),
      v.literal("eggs"),
      v.literal("flavoring"),
      v.literal("packaging"),
      v.literal("other"),
    ),
    unit: v.string(),
    reorderLevel: v.number(),
    currentStock: v.number(),
    unitCost: v.number(),
    supplierId: v.optional(v.id("suppliers")),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventoryItems", args);
  },
});

// Update stock level
export const updateStock = mutation({
  args: {
    itemId: v.id("inventoryItems"),
    quantity: v.number(),
    transactionType: v.union(
      v.literal("purchase"),
      v.literal("usage"),
      v.literal("waste"),
      v.literal("adjustment"),
    ),
    unitCost: v.optional(v.number()),
    notes: v.optional(v.string()),
    loggedBy: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    // Calculate new stock
    let newStock = item.currentStock;
    if (
      args.transactionType === "purchase" ||
      args.transactionType === "adjustment"
    ) {
      newStock += args.quantity;
    } else {
      newStock -= args.quantity;
    }

    // Update item stock
    await ctx.db.patch(args.itemId, { currentStock: newStock });

    // Log transaction
    await ctx.db.insert("inventoryTransactions", {
      itemId: args.itemId,
      transactionType: args.transactionType,
      quantity: args.quantity,
      unitCost: args.unitCost,
      totalCost: args.unitCost ? args.unitCost * args.quantity : undefined,
      notes: args.notes,
      loggedBy: args.loggedBy,
      transactionDate: new Date().toISOString().split("T")[0],
    });

    return newStock;
  },
});

// Delete item
export const remove = mutation({
  args: { id: v.id("inventoryItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
