"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
          Forgot password?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-3.5 px-4 bg-indigo-500 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      RESET PASSWORD <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Check your email
                </h3>
                <p className="text-sm text-gray-500">
                  We've sent a password reset link to <br />
                  <span className="font-bold text-gray-800">{email}</span>
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-600"
              >
                Didn't receive the email? Click to try again
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
