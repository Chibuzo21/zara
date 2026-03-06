"use client";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { loginSchema, FormData } from "../components/validation";
import { useState, useEffect } from "react";
import Field from "./Form-components/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  owner: "/dashboard/owner",
  admin: "/dashboard/owner",
  sales: "/dashboard/sales",
  transport_sales: "/dashboard/sales",
  production: "/dashboard/production",
  packaging: "/dashboard/packaging",
};

export default function LoginForm() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [visible, setVisible] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  // Only fetch user once authenticated — skips until session is ready
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && signingIn ? {} : "skip",
  );

  // React to user becoming available after sign-in
  useEffect(() => {
    if (!signingIn || !user) return;

    const destination = ROUTES[user.role ?? ""];
    if (!destination) {
      setError(
        `Unknown role "${user.role}". Please contact your administrator.`,
      );
      setSigningIn(false);
      return;
    }

    toast.success("Login successful!");
    router.replace(destination);
  }, [user, signingIn, router]);

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signIn",
      });
      // Flag that we're waiting for the user query to resolve
      setSigningIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const isLoading = isSubmitting || signingIn;

  return (
    <>
      {error && (
        <div className='mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg'>
          <p className='text-red-800 text-sm'>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Field
          type='text'
          label='Email Address'
          placeholder='your.email@example.com'
          name='email'
          register={register}
          Icon={Mail}
          error={errors.email as FieldError}
        />
        <Field
          type={visible ? "text" : "password"}
          label='Password'
          placeholder='••••••••'
          name='password'
          register={register}
          visible={visible}
          className='pr-10'
          Icon={Lock}
          handlePassword={() => setVisible((v) => !v)}
          error={errors.password as FieldError}
        />
        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-linear-to-r from-bakery-pink to-bakery-gold text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}
