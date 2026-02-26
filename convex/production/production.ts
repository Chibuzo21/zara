import { query } from "../_generated/server";
import { v } from "convex/values";

// Get production records by date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("productionLog")
      .withIndex("by_date")
      .collect();

    const filtered = records.filter(
      (r) =>
        r.productionDate >= args.startDate && r.productionDate <= args.endDate,
    );

    // Join with product details
    const withProducts = await Promise.all(
      filtered.map(async (record) => {
        const product = await ctx.db.get(record.productId);
        const staff = record.staffId ? await ctx.db.get(record.staffId) : null;
        return { ...record, product, staff };
      }),
    );

    return withProducts;
  },
});

// Get today's production
export const getToday = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const records = await ctx.db
      .query("productionLog")
      .withIndex("by_date", (q) => q.eq("productionDate", today))
      .collect();

    const withProducts = await Promise.all(
      records.map(async (record) => {
        const product = await ctx.db.get(record.productId);
        return { ...record, product };
      }),
    );

    return withProducts;
  },
});

// Get all production records
export const getAll = query({
  handler: async (ctx) => {
    const records = await ctx.db.query("productionLog").order("desc").take(100);

    const withProducts = await Promise.all(
      records.map(async (record) => {
        const product = await ctx.db.get(record.productId);
        const staff = record.staffId ? await ctx.db.get(record.staffId) : null;
        return { ...record, product, staff };
      }),
    );

    return withProducts;
  },
});
