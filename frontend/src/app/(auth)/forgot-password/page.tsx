"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, CheckCircle2, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-200 overflow-hidden">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
           animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
        <motion.div
           animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, 180, 0],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"
        />
      </div>

      <PageHeader
        title="Reset Password"
        breadcrumbs={[
          { label: "Login", href: "/login" },
          { label: "Forgot Password" },
        ]}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mt-10 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto"
        >
          {}
          <div className="backdrop-blur-3xl bg-white/60 dark:bg-slate-900/40 p-8 sm:p-10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/5 transition-all">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="forgot-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-10 text-center relative">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-linear-to-tr from-purple-600 to-indigo-600 p-0.5 rounded-2xl mx-auto mb-6 shadow-xl shadow-purple-500/20"
                    >
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                        <Sparkles size={32} className="text-purple-600" />
                      </div>
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                      Forgot Password?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Enter your email and we'll send a premium recovery link.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="text-red-500 text-sm text-center bg-red-500/10 dark:bg-red-500/10 p-4 rounded-2xl border border-red-500/20 font-bold mb-4">
                            {error}
                            {error.toLowerCase().includes("no account found") && (
                              <Link
                                href="/signup"
                                className="block mt-2 text-purple-600 dark:text-purple-400 font-black hover:opacity-80 transition-opacity"
                              >
                                Create an account instead?
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="group relative">
                      <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors"
                          size={20}
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01, translateY: -1 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="group w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all disabled:opacity-70 flex justify-center items-center gap-2 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                      {loading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                      ) : (
                        <>
                          <span>Send Recovery Link</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-center py-4"
                >
                  <div className="flex justify-center mb-8">
                    <motion.div 
                      initial={{ rotate: -20, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full flex items-center justify-center relative shadow-inner"
                    >
                      <CheckCircle2 className="text-emerald-500" size={56} />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"
                      />
                    </motion.div>
                  </div>

                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    Check Your Inbox
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                    A premium recovery link has been dispatched to:
                    <span className="block mt-2 font-black text-slate-800 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 py-2 px-4 rounded-full border border-slate-200/50 dark:border-white/5 break-all">
                      {email}
                    </span>
                  </p>

                  <div className="bg-slate-100/50 dark:bg-slate-800/20 p-5 rounded-3xl text-[13px] text-slate-500 dark:text-slate-400 text-left mb-8 flex gap-4 border border-slate-200/30 dark:border-white/5">
                    <Lightbulb className="shrink-0 text-amber-500" size={20} />
                    <p className="leading-relaxed">
                      Don't forget to check your <span className="font-bold text-slate-700 dark:text-slate-300">spam folder</span> if the transmission doesn't appear within 60 seconds.
                    </p>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[15px] font-black text-purple-600 hover:text-purple-500 transition-colors bg-purple-500/5 hover:bg-purple-500/10 px-6 py-2 rounded-full border border-purple-500/10"
                  >
                    Resend link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-3 text-[15px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
