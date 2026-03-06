import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

// Get all staff
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("staff").order("desc").collect();
  },
});

// Get staff by ID
export const getById = query({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get staff by role
export const getByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .withIndex("by_role", (q) => q.eq("role", args.role as any))
      .collect();
  },
});

// Get active staff
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("staff")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Get staff with performance
export const getWithPerformance = query({
  args: { staffId: v.id("staff") },
  handler: async (ctx, args) => {
    const staff = await ctx.db.get(args.staffId);
    const performance = await ctx.db
      .query("staffPerformance")
      .withIndex("by_staff", (q) => q.eq("staffId", args.staffId))
      .order("desc")
      .take(5);

    return { staff, performance };
  },
});

// convex/users.ts

/// convex/staffs/staff.ts
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});
