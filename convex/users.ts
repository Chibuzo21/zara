// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
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
