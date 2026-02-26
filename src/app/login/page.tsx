"use client";

import { useEffect, useState } from "react";

import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react"; // Add this import
import { fetchQuery } from "convex/nextjs";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn("password", { email, password, flow: "signIn" });
      const user = await fetchQuery(api.users.viewer);
      const routes: Record<string, string> = {
        owner: "/dashboard/owner",
        sales: "/dashboard/sales",
        production: "/dashboard/production",
        packaging: "/dashboard/packaging",
        transport_sales: "/dashboard/sales",
      };

      router.push(routes[user?.role ?? ""] || "/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-bakery-pink-pale via-white to-bakery-gold-soft flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Header */}
        <div className='text-center mb-8'>
          <div className='inline-block p-4 bg-linear-to-br from-bakery-pink to-bakery-gold rounded-full mb-4'>
            <svg
              className='w-16 h-16 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z' />
            </svg>
          </div>
          <h1 className='text-4xl font-bold bg-linear-to-r from-bakery-pink to-bakery-gold bg-clip-text text-transparent'>
            Zara's Delight
          </h1>
          <p className='text-gray-600 mt-2'>Bakery Management System</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Welcome Back
          </h2>

          {error && (
            <div className='mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email */}
            <div>
              <label className='label'>Email Address</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-field pl-10'
                  placeholder='your.email@example.com'
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='label'>Password</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='input-field pl-10 pr-10'
                  placeholder='••••••••'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-linear-to-r from-bakery-pink to-bakery-gold text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='text-sm font-semibold text-blue-900 mb-2'>
              Demo Accounts:
            </p>
            <div className='text-xs text-blue-700 space-y-1'>
              <p>
                <strong>Owner:</strong> owner@bakery.com / password
              </p>
              <p>
                <strong>Shop Sales:</strong> shop@bakery.com / password
              </p>
              <p>
                <strong>Transport:</strong> transport@bakery.com / password
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-gray-600 text-sm mt-6'>
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  );
}
