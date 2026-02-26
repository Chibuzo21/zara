import {
  mutation,
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
const now = Date.now();
// Register new user (Owner only)
// export const register = mutation({
//   args: {
//     email: v.string(),
//     password: v.string(),
//     fullName: v.string(),
//     role: v.union(
//       v.literal("owner"),
//       v.literal("sales"),
//       v.literal("transport_sales"),
//       v.literal("production"),
//       v.literal("packaging"),
//       v.literal("admin"),
//     ),
//     staffId: v.optional(v.id("staff")),
//   },
//   handler: async (ctx, args) => {
//     // Check if email already exists
//     const existing = await ctx.db
//       .query("users")
//       .withIndex("by_email", (q) => q.eq("email", args.email))
//       .first();

//     if (existing) {
//       throw new Error("Email already registered");
//     }
//     const hashedPassword = await bcrypt.hash(args.password, 10);
//     const userId = await ctx.db.insert("users", {
//       email: args.email,
//       password: hashedPassword,
//       fullName: args.fullName,
//       role: args.role,
//       //   staffId: args.staffId,
//       //   status: "active",
//       isActive: true,
//       createdAt: now,
//     });

//     return userId;
//   },
// });

// Login

// Type for the login response
// type LoginResponse = {
//   token: string;
//   user: {
//     id: Id<"users">;
//     email: string;
//     fullName: string;
//     role:
//       | "owner"
//       | "sales"
//       | "transport_sales"
//       | "production"
//       | "packaging"
//       | "admin";
//   };
// };

// // Helper query to find user by email
// export const findUserByEmail = query({
//   args: {
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("users")
//       .withIndex("by_email", (q) => q.eq("email", args.email))
//       .unique();
//   },
// });

// // Helper mutation to create session
// export const createSession = internalMutation({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args): Promise<LoginResponse> => {
//     // Get user to return in response
//     const user = await ctx.db.get(args.userId);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Create session
//     const token = generateToken();
//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

//     await ctx.db.insert("sessions", {
//       userId: args.userId,
//       token,
//       expiresAt: expiresAt.toISOString(),
//       createdAt: new Date().toISOString(),
//     });

//     // Update last login
//     await ctx.db.patch(args.userId, {
//       lastLogin: Date.now(),
//     });

//     return {
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//         role: user.role,
//       },
//     };
//   },
// });

// // Logout
// export const logout = mutation({
//   args: {
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const session = await ctx.db
//       .query("sessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (session) {
//       await ctx.db.delete(session._id);
//     }
//   },
// });

// // Get current user from token
// export const getCurrentUser = query({
//   args: {
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const session = await ctx.db
//       .query("sessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (!session) {
//       return null;
//     }

//     // Check if expired
//     // if (new Date(session.expiresAt) < new Date()) {
//     //   await ctx.db.delete(session._id);
//     //   return null;
//     // }

//     const user = await ctx.db.get(session.userId);
//     if (!user || !user.isActive) {
//       return null;
//     }

//     // Get staff details if linked
//     let staff = null;
//     // if (user.staffId) {
//     //   staff = await ctx.db.get(user.staffId);
//     // }

//     return {
//       id: user._id,
//       email: user.email,
//       fullName: user.fullName,
//       role: user.role,
//       //   staffId: user.staffId,
//       staff,
//     };
//   },
// });

// // Check if user has permission
// export const hasPermission = query({
//   args: {
//     token: v.string(),
//     requiredRole: v.union(
//       v.literal("owner"),
//       v.literal("sales"),
//       v.literal("transport_sales"),
//       v.literal("production"),
//       v.literal("packaging"),
//       v.literal("admin"),
//     ),
//   },
//   handler: async (ctx, args) => {
//     // Get session
//     const session = await ctx.db
//       .query("sessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (!session) return false;

//     // Check if expired
//     // if (new Date(session.expiresAt) < new Date()) {
//     //   await ctx.db.delete(session._id);
//     //   return false;
//     // }

//     const user = await ctx.db.get(session.userId);
//     if (!user || !user.isActive) {
//       return false;
//     }

//     // Owner can do everything
//     if (user.role === "owner" || user.role === "admin") return true;

//     // Check specific role
//     return user.role === args.requiredRole;
//   },
// });

// Get all users (Owner only)
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Update user status
// export const updateUserStatus = mutation({
//   args: {
//     userId: v.id("users"),
//     status: v.boolean(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.userId, { isActive: args.status });
//   },
// });

// // Change password
// export const changePassword = mutation({
//   args: {
//     token: v.string(),
//     currentPassword: v.string(),
//     newPassword: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Get session
//     const session = await ctx.db
//       .query("sessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (!session) {
//       throw new Error("Not authenticated");
//     }

//     const user = await ctx.db.get(session.userId);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Verify current password
//     // Verify password
//     const valid = await bcrypt.compare(args.currentPassword, user.password);
//     if (!valid) throw new Error("Invalid password");

//     // Update password
//     const hashedPassword = await bcrypt.hash(args.newPassword, 10);
//     await ctx.db.patch(user._id, {
//       password: hashedPassword,
//     });

//     return { success: true };
//   },
// });

export const createOwner = action({
  args: {
    email: v.string(),
    fullName: v.string(),
    // password: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("sales"),
      v.literal("transport_sales"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("admin"),
    ),
    staffId: v.optional(v.id("staff")),
  },

  handler: async (ctx, args): Promise<Id<"users">> => {
    // Hash the password in the action
    // const hashedPassword = await bcrypt.hash(args.password, 10);

    // Call the internal mutation
    return await ctx.runMutation(internal.Myauth.insertOwnerInternal, {
      email: args.email,
      fullName: args.fullName,
      // password: hashedPassword,
      role: args.role,
      staffId: args.staffId as Id<"staff">,
    });
  },
});

// Internal mutation - can only be called from other Convex functions
export const insertOwnerInternal = internalMutation({
  args: {
    email: v.string(),
    fullName: v.string(),
    // password: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("sales"),
      v.literal("transport_sales"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("admin"),
    ),
    staffId: v.optional(v.id("staff")),
  },

  handler: async (ctx, args): Promise<Id<"users">> => {
    // Check if owner already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Email already registered");
    }

    // Insert with the hashed password
    return await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      role: args.role,
      createdAt: Date.now(),
      // password:args.password,
      isActive: true,
    });
  },
});
// convex/auth/auth.ts

export const editUser = internalMutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    fullName: v.string(),
    password: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("sales"),
      v.literal("transport_sales"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("admin"),
    ),
  },
  handler: async (ctx, { userId, ...fields }) => {
    await ctx.db.patch(userId, fields);
  },
});
export const editUserAction = action({
  args: {
    email: v.string(),
    fullName: v.string(),
    password: v.optional(v.string()), // This is the plain text from the UI
    role: v.union(
      v.literal("owner"),
      v.literal("sales"),
      v.literal("transport_sales"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("admin"),
    ),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Hash the password before sending to the mutation
    // const hashedPassword = await bcrypt.hash(args.password, 10);

    // 2. Run the internal mutation with the hashed password
    // This will now return the Id<"users"> instead of null
    await ctx.runMutation(internal.Myauth.editUser, {
      ...args,
      // password: hashedPassword,
    });
  },
});
