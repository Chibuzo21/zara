import { action, internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { api, internal } from "../_generated/api";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server"; // ✅

export const createStaff = action({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    password: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("transport_sales"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ staffId: string & { __tableName: "staff" } }> => {
    // 1. Check caller is owner
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentUser = await ctx.runQuery(api.users.getById, { id: userId });
    if (!currentUser || currentUser.role !== "owner") {
      throw new Error("Only owner can create staff");
    }
    if (!currentUser || currentUser.role !== "owner") {
      throw new Error("Only owner can create staff");
    }

    // 2. Create staff record first
    const staffId = await ctx.runMutation(
      internal.staffs.staffMutation.createInternal,
      {
        fullName: args.fullName,
        email: args.email,
        phone: args.phone,
        role: args.role,
        status: args.status,
        dateHired: args.dateHired,
        baseSalary: args.baseSalary,
        commissionRate: args.commissionRate,
      },
    );

    // 3. Create auth account via Convex Auth (no manual bcrypt!)
    await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: args.password,
      },
      profile: {
        email: args.email,
        fullName: args.fullName,
        role: args.role,
        isActive: true,
      },
    });

    // 4. Link the user back to staff
    const user = await ctx.runQuery(api.staffs.staff.getUserByEmail, {
      email: args.email,
    });
    if (user) {
      await ctx.runMutation(internal.staffs.staffMutation.linkUserToStaff, {
        staffId,
        userId: user._id,
      });
    }

    return { staffId };
  },
});

export const linkUserToStaff = internalMutation({
  args: { staffId: v.id("staff"), userId: v.id("users") },
  handler: async (ctx, { staffId, userId }) => {
    // await ctx.db.patch(staffId, { userId });
    await ctx.db.patch(userId, { staffId });
  },
});
export const createInternal = internalMutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    password: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("transport_sales"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"staff">> => {
    return await ctx.db.insert("staff", {
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      role: args.role,
      status: args.status,
      dateHired: args.dateHired,
      baseSalary: args.baseSalary,
      commissionRate: args.commissionRate,
    });
  },
});
export const remove = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const editStaff = internalMutation({
  args: {
    id: v.id("staff"),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("sales"),
      v.literal("transport_sales"),
      v.literal("production"),
      v.literal("packaging"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
    password: v.optional(v.string()), // hashed if provided
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

// 2️⃣ Action: handles password hashing and updates both staff + user
// convex/staffs/staffMutation.ts

export const editAction = action({
  args: {
    id: v.id("staff"),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("transport_sales"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Update staff record
    await ctx.runMutation(internal.staffs.staffMutation.editStaff, {
      ...args,
      password: undefined, // staff table never stores password
    });

    // 2. If password provided, update via Convex Auth
    if (args.password && args.password.trim() !== "") {
      // TODO: admin password reset requires a custom Password provider
      // Convex Auth doesn't support changing another user's password out of the box
      throw new Error("Password reset not yet supported");
    }
  },
});
