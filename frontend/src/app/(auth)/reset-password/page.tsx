"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getMissingRequirements = (pass: string) => {
    const requirements = [
      { id: "length", label: "8+ characters", met: pass.length >= 8 },
      { id: "upper", label: "Uppercase", met: /[A-Z]/.test(pass) },
      { id: "number", label: "Number", met: /[0-9]/.test(pass) },
      {
        id: "special",
        label: "Special char",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      },
    ];
    return requirements;
  };

  const [passwordRequirements, setPasswordRequirements] = useState(
    getMissingRequirements(""),
  );

  React.useEffect(() => {
    setPasswordRequirements(getMissingRequirements(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordRequirements.some((req) => !req.met)) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full flex items-center justify-center relative"
          >
            <CheckCircle2 className="text-emerald-500" size={56} />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
            />
          </motion.div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Access Restored!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          Your security phrase has been successfully updated. Dispatched to login in 3 seconds...
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-2xl transition-all"
          >
            <span>Proceed to Login</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="text-red-500 text-sm text-center bg-red-500/10 dark:bg-red-500/10 p-4 rounded-2xl border border-red-500/20 font-bold mb-4">
              {error}
            </div>
          </motion.div>
        )}

        {!token && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-600 text-[13px] text-center bg-amber-500/10 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 mb-4 font-black uppercase tracking-wider"
          >
            Transmission Error: Reset token is missing or invalid.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div className="group relative">
          <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
            New Security Phrase
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={!token}
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-14 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Min 8 premium characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {}
          <div className="mt-4 flex flex-wrap gap-2 ml-1">
            {passwordRequirements.map((req) => (
              <div
                key={req.id}
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                  req.met
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                }`}
              >
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <div className="group relative">
          <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
            Confirm Phrase
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={!token}
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Repeat new phrase"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <ShieldCheck
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors"
              size={20}
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01, translateY: -1 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading || !token}
        className="group w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all disabled:opacity-70 flex justify-center items-center gap-2 overflow-hidden relative mt-4"
      >
        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
        {loading ? (
          <Loader2 className="animate-spin h-6 w-6" />
        ) : (
          <>
            <span>Restore Account</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-200 overflow-hidden">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
           animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
        <motion.div
           animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -left-[5%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"
        />
      </div>

      <PageHeader
        title="Security Protocol"
        breadcrumb="Reset Password"
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
                New Identity
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Update your premium security credentials below.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="text-purple-500 w-10 h-10" />
                  </motion.div>
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-[15px] font-medium text-slate-500">
                Remembered your credentials?{" "}
                <Link
                  href="/login"
                  className="font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-80 transition-opacity ml-1"
                >
                  Return to Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
