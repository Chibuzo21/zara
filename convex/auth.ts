import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { createAccount } from "@convex-dev/auth/server";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password()],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) return args.existingUserId;
      return await ctx.db.insert("users", {
        email: args.profile.email as string,
        emailVerificationTime: undefined,
        fullName: args.profile.fullName as string,
        role: args.profile.role as string,
        isActive: true,
        createdAt: Date.now(),
      });
    },
  },
});

export const createOwner = action({
  args: {
    email: v.string(),
    fullName: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Optional: prevent creating a second owner
    // const existing = await ctx.runQuery(internal.users.getOwner);
    // if (existing) throw new Error("Owner already exists");

    await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: args.password,
      },
      profile: {
        email: args.email,
        fullName: args.fullName,
        role: "owner",
      },
    });
  },
});
