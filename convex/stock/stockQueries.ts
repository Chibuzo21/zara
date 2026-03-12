import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all stock entries for a specific staff member on a specific date
export const getByStaffAndDate = query({
  args: {
    staffId: v.id("staff"),
    date: v.string(),
  },
  handler: async (ctx, { staffId, date }) => {
    const entries = await ctx.db
      .query("dailyStock")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", staffId).eq("entryDate", date),
      )
      .collect();

    // Attach product details to each entry
    return await Promise.all(
      entries.map(async (entry) => {
        const product = await ctx.db.get(entry.productId);
        return { ...entry, product };
      }),
    );
  },
});

// Get all stock entries for a date (admin view)
export const getByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, { date }) => {
    const entries = await ctx.db
      .query("dailyStock")
      .withIndex("by_date", (q) => q.eq("entryDate", date))
      .collect();

    return await Promise.all(
      entries.map(async (entry) => {
        const product = await ctx.db.get(entry.productId);
        const staff = await ctx.db.get(entry.staffId);
        return { ...entry, product, staff };
      }),
    );
  },
});
