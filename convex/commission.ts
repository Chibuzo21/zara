import { query } from "./_generated/server";

// Get all commission records
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("commissionRecords").order("desc").take(50);
  },
});

// Get records by staff
export const getByStaff = query({
  handler: async (ctx) => {
    return await ctx.db.query("commissionRecords").collect();
  },
});
