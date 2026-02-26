import { mutation } from "../_generated/server";
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

// Record bulk purchase (multiple items at once)
export const recordBulkPurchase = mutation({
  args: {
    supplierId: v.optional(v.id("suppliers")),
    purchaseDate: v.string(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        itemId: v.id("inventoryItems"),
        quantity: v.number(),
        unitCost: v.number(),
        totalCost: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Process each item
    for (const item of args.items) {
      // Get current stock
      const inventoryItem = await ctx.db.get(item.itemId);
      if (!inventoryItem) continue;

      // Update stock
      const newStock = inventoryItem.currentStock + item.quantity;
      await ctx.db.patch(item.itemId, {
        currentStock: newStock,
        unitCost: item.unitCost, // Update unit cost to latest purchase price
      });

      // Log transaction
      await ctx.db.insert("inventoryTransactions", {
        itemId: item.itemId,
        transactionType: "purchase",
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.totalCost,
        supplierId: args.supplierId,
        notes: args.notes,
        transactionDate: args.purchaseDate,
      });
    }

    return { success: true, itemsProcessed: args.items.length };
  },
});

// Record stock usage (materials used in production)
export const recordUsage = mutation({
  args: {
    items: v.array(
      v.object({
        itemId: v.id("inventoryItems"),
        quantity: v.number(),
        reason: v.string(), // NEW: production, damaged, missing, waste, expired, spillage
      }),
    ),
    usageDate: v.string(),
    notes: v.optional(v.string()),
    loggedBy: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const inventoryItem = await ctx.db.get(item.itemId);
      if (!inventoryItem) continue;

      // Reduce stock
      const newStock = Math.max(0, inventoryItem.currentStock - item.quantity);
      await ctx.db.patch(item.itemId, { currentStock: newStock });

      // Determine transaction type based on reason
      let transactionType: "usage" | "waste" = "usage";
      if (
        ["damaged", "missing", "waste", "expired", "spillage"].includes(
          item.reason,
        )
      ) {
        transactionType = "waste";
      }

      // Build notes with reason
      const noteWithReason = `${item.reason.toUpperCase()}: ${args.notes || "Stock reduced"}`;

      // Log transaction
      await ctx.db.insert("inventoryTransactions", {
        itemId: item.itemId,
        transactionType,
        quantity: item.quantity,
        notes: noteWithReason,
        // loggedBy: args.loggedBy,
        transactionDate: args.usageDate,
      });
    }

    return { success: true, itemsProcessed: args.items.length };
  },
});

// Update stock level (manual adjustment)
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
      // loggedBy: args.loggedBy,
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
