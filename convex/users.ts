// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

export type AuthUser = Required<
  Pick<Doc<"users">, "email" | "fullName" | "role">
> &
  Doc<"users">;

export const viewer = query({
  handler: async (ctx): Promise<AuthUser | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user?.role || !user?.fullName || !user?.email) return null;
    return user as AuthUser;
  },
});
// convex/users.ts
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
export const updateUser = internalMutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    email: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("sales"),
        v.literal("owner"),
        v.literal("production"),
        v.literal("packaging"),
        v.literal("sales"),
        v.literal("transport_sales"),
      ),
    ),
  },
  handler: async (ctx, { userId, ...fields }) => {
    await ctx.db.patch(userId, fields);
  },
});
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
  },
});
export const getUserByStaffId = query({
  args: { staffId: v.id("staff") },
  handler: async (ctx, { staffId }) => {
    return await ctx.db
      .query("users")
      .withIndex("staffId", (q) => q.eq("staffId", staffId))
      .unique();
  },
});
