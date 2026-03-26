"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title="Reset Password"
        breadcrumbs={[
          { label: "Login", href: "/login" },
          { label: "Forgot Password" },
        ]}
      />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-10 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center transition-colors">
                  Forgot Password?
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 transition-colors">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-6">
                      <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium capitalize flex flex-col items-center gap-2">
                        {error}
                        {error.toLowerCase().includes("no account found") && (
                          <Link
                            href="/signup"
                            className="text-purple-600 dark:text-purple-400 font-extrabold hover:text-purple-500 underline decoration-2 underline-offset-4 transition-all"
                          >
                            Create an account instead?
                          </Link>
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg pl-11 pr-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all font-medium"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-teal-500" size={48} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Check your email
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  If an account exists for{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {email}
                  </span>
                  , you will receive a password reset link shortly.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs text-slate-500 dark:text-slate-400 text-left mb-8 flex gap-3">
                  <div className="shrink-0 pt-0.5">💡</div>
                  <p>
                    Don't forget to check your spam folder if you don't see the
                    email within a few minutes.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-500 transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-all group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
