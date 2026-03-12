import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Submit all stock entries for the day in one go.
// Called when the salesperson clicks "Submit Stock Report".
// Overwrites any existing entries for the same staff + date + product
// so re-submissions don't create duplicates.
export const submitDailyStock = mutation({
  args: {
    staffId: v.id("staff"),
    recordedBy: v.id("users"),
    entryDate: v.string(),
    entries: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.optional(v.string()),
        openingQty: v.number(),
        damagedQty: v.number(),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { staffId, recordedBy, entryDate, entries }) => {
    for (const entry of entries) {
      // Check if an entry already exists for this staff + date + product
      const existing = await ctx.db
        .query("dailyStock")
        .withIndex("by_product_and_date", (q) =>
          q.eq("productId", entry.productId).eq("entryDate", entryDate),
        )
        .filter((q) => q.eq(q.field("staffId"), staffId))
        .first();

      if (existing) {
        // Update in place — no duplicate records
        await ctx.db.patch(existing._id, {
          openingQty: entry.openingQty,
          damagedQty: entry.damagedQty,
          productName: entry.productName,
          notes: entry.notes,
        });
      } else {
        await ctx.db.insert("dailyStock", {
          staffId,
          recordedBy,
          entryDate,
          productId: entry.productId,
          productName: entry.productName,
          openingQty: entry.openingQty,
          damagedQty: entry.damagedQty,
          notes: entry.notes,
        });
      }
    }
  },
});
