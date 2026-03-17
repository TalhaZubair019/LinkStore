"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  XCircle,
} from "lucide-react";
import axios from "axios";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const getRequirements = (pass: string) => [
    { label: "At least 8 characters", met: pass.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(pass) },
    { label: "One number", met: /[0-9]/.test(pass) },
    {
      label: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    },
  ];

  const requirements = getRequirements(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.some((r) => !r.met)) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.post(`${apiUrl}/auth/reset-password`, { token, password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Reset failed. The link may be expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
          <XCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Invalid Reset Link</h3>
        <p className="text-sm text-gray-500">
          The password reset link is missing or invalid.
        </p>
        <Link
          href="/forgot-password"
          title="Go to Forgot Password"
          className="inline-block px-6 py-2 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
      {!success ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="mt-4 space-y-1.5 ml-1">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className={`text-[10px] font-bold flex items-center gap-2 ${req.met ? "text-green-500" : "text-gray-300 transition-colors"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-green-500 shadow-sm" : "bg-gray-200"}`}
                  />
                  {req.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center py-3.5 px-4 bg-indigo-500 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                UPDATE PASSWORD <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Success!</h3>
            <p className="text-sm text-gray-500">
              Your password has been reset successfully. <br />
              Redirecting you to login...
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block font-bold text-indigo-600 hover:text-indigo-500"
          >
            Click here if not redirected
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200">
            L
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            LinkStore
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-gray-600 mb-8">
          Please enter your new password below.
        </p>

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
