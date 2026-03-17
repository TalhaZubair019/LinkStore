"use client";

import React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
  loginForm: { email: string; password: string };
  setLoginForm: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin,
  loginForm,
  setLoginForm,
  showPassword,
  setShowPassword,
  error,
  loading,
}) => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Login to your account
      </h2>
      <form
        onSubmit={handleLogin}
        className="border border-slate-200 rounded-xl p-8 bg-white shadow-xl shadow-slate-200/50"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all pr-12"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
          <div className="text-center text-sm text-slate-500 mt-4">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-600 font-bold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
