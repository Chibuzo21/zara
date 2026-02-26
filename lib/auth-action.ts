// app/actions/auth.ts
"use server";

import { cookies } from "next/headers";

export async function handleLogin(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function handleLogout() {
  (await cookies()).delete("auth_token");
}
