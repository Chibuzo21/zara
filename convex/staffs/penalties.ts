// convex/staffs/penalties.ts

import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "../_generated/api";

// ─── Add a penalty ────────────────────────────────────────────────────────────

export const add = mutation({
  args: {
    staffId: v.id("staff"),
    amount: v.number(),
    reason: v.string(),
    category: v.union(
      v.literal("lateness"),
      v.literal("misconduct"),
      v.literal("damage"),
      v.literal("absence"),
      v.literal("other"),
    ),
    penaltyDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentUser = await ctx.runQuery(api.users.getById, { id: userId });
    if (!currentUser || currentUser.role !== "owner") {
      throw new Error("Only owners can add penalties");
    }

    return await ctx.db.insert("staffPenalties", {
      ...args,
      recordedBy: userId,
    });
  },
});

// ─── Remove a penalty ─────────────────────────────────────────────────────────

export const remove = mutation({
  args: { id: v.id("staffPenalties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentUser = await ctx.runQuery(api.users.getById, { id: userId });
    if (!currentUser || currentUser.role !== "owner") {
      throw new Error("Only owners can remove penalties");
    }

    await ctx.db.delete(args.id);
  },
});

// ─── All penalties for one staff member (admin detail view) ───────────────────

export const getByStaff = query({
  args: { staffId: v.id("staff") },
  handler: async (ctx, { staffId }) => {
    return await ctx.db
      .query("staffPenalties")
      .withIndex("by_staff", (q) => q.eq("staffId", staffId))
      .order("desc")
      .collect();
  },
});

// ─── Penalties within a month range (for pay calculation) ─────────────────────

export const getByStaffAndMonth = query({
  args: {
    staffId: v.id("staff"),
    monthStart: v.string(), // "YYYY-MM-01"
    monthEnd: v.string(), // "YYYY-MM-31"
  },
  handler: async (ctx, { staffId, monthStart, monthEnd }) => {
    const all = await ctx.db
      .query("staffPenalties")
      .withIndex("by_staff", (q) => q.eq("staffId", staffId))
      .collect();

    return all.filter(
      (p) => p.penaltyDate >= monthStart && p.penaltyDate <= monthEnd,
    );
  },
});

// ─── All penalties across all staff (owner dashboard) ─────────────────────────

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const penalties = await ctx.db
      .query("staffPenalties")
      .order("desc")
      .collect();

    return await Promise.all(
      penalties.map(async (p) => {
        const staff = await ctx.db.get(p.staffId);
        return { ...p, staffName: staff?.fullName ?? "Unknown" };
      }),
    );
  },
});

// ─── Staff self-view: my own penalties ────────────────────────────────────────

export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Find the staff record linked to this user via users.staffId
    const user = await ctx.db.get(userId);
    if (!user?.staffId) return [];

    return await ctx.db
      .query("staffPenalties")
      .withIndex("by_staff", (q) => q.eq("staffId", user.staffId!))
      .order("desc")
      .collect();
  },
});
