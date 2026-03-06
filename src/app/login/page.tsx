"use client";

import { useState } from "react";

import LoginForm from "./components/login-Form";
import LoginHeader from "./components/login-header";

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-linear-to-br from-bakery-pink-pale via-white to-bakery-gold-soft flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <LoginHeader />
        {/* Login Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Welcome Back
          </h2>
          <LoginForm />
          {/* Demo Credentials */}
          <div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='text-sm font-semibold text-blue-900 mb-2'>
              Demo Accounts:
            </p>
            <div className='text-xs text-blue-700 space-y-1'>
              {demoAccts.map((demo, idx) => (
                <p key={demo}>
                  <strong>{demo}:</strong>
                  {demo.toLowerCase()}@bakery.com / password
                </p>
              ))}
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
const demoAccts = ["Owner", "Sales", "Transport", "Packaging"];
