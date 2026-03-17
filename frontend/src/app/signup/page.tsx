"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/AuthSlice";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const otpInputRef = React.useRef<HTMLInputElement>(null);
  const [verifyingLoading, setVerifyingLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const urlEmail = searchParams.get("email");
  const isNotVerified = searchParams.get("notVerified") === "true";

  const getMissingRequirements = (pass: string) => {
    const requirements = [
      { id: "length", label: "At least 8 characters", met: pass.length >= 8 },
      { id: "upper", label: "One uppercase letter", met: /[A-Z]/.test(pass) },
      { id: "number", label: "One number", met: /[0-9]/.test(pass) },
      {
        id: "special",
        label: "One special character",
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

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsExpired(true);
      setError("Verification code has expired. Please request a new one.");
    }
    return () => clearInterval(timer);
  }, [isVerifying, timeLeft]);

  React.useEffect(() => {
    if (urlEmail) {
      setFormData((prev) => ({ ...prev, email: urlEmail }));
      if (isNotVerified) {
        setIsVerifying(true);
        setSuccessMessage("Please verify your email to continue.");
      }
    }
  }, [urlEmail, isNotVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordRequirements.some((req) => !req.met)) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccessMessage(data.message);
      setIsVerifying(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (otp.length === 6 && isVerifying) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isExpired) {
      setError("Verification code has expired. Please request a new one.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setVerifyingLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      router.push(redirect || "/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifyingLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Resend failed");

      setSuccessMessage("A new verification code has been sent to your email.");
      setOtp("");
      setTimeLeft(300);
      setIsExpired(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">
      <PageHeader
        title={isVerifying ? "Verify Email" : "Create Account"}
        breadcrumb={isVerifying ? "Verify" : "Signup"}
      />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-10 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-all">
            {isVerifying ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full" />

                <div className="text-center mb-10 relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-linear-to-tr from-purple-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-200 dark:shadow-purple-900/40 relative group cursor-pointer"
                    onClick={() => {
                      setIsVerifying(false);
                      setOtp("");
                      setTimeLeft(300);
                      setIsExpired(false);
                      setError("");
                    }}
                  >
                    <div className="absolute inset-0 bg-white rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <KeyRound size={36} className="relative z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-purple-400 rounded-3xl"
                    />
                  </motion.div>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">
                    Secure Access
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed font-medium transition-colors">
                    Please enter the 6-digit code sent to
                    <span className="block font-extrabold text-slate-800 dark:text-slate-200 mt-1 bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-full border border-slate-200/50 dark:border-slate-700/50 transition-colors">
                      {formData.email}
                    </span>
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-sm border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-2xl flex items-center gap-3 font-medium transition-colors"
                  >
                    <div className="shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-red-200">
                      !
                    </div>
                    {error}
                  </motion.div>
                )}

                {successMessage && !error && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-sm border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-400 text-sm rounded-r-2xl flex items-center gap-3 font-medium transition-colors"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-emerald-600"
                    />
                    {successMessage}
                  </motion.div>
                )}

                <form className="space-y-8" onSubmit={handleVerifyOTP}>
                  <div className="relative">
                    <input
                      ref={otpInputRef}
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) setOtp(val);
                      }}
                      className="absolute inset-0 opacity-0 cursor-default"
                      autoFocus
                    />
                    <div
                      className="flex justify-between gap-3 max-w-[340px] mx-auto cursor-text"
                      onClick={() => otpInputRef.current?.focus()}
                    >
                      {[...Array(6)].map((_, index) => {
                        const digit = otp[index] || "";
                        const isFocused =
                          otp.length === index ||
                          (otp.length === 6 && index === 5);

                        return (
                          <motion.div
                            key={index}
                            whileFocus={{ scale: 1.05, y: -2 }}
                            animate={
                              isFocused ? { scale: 1.05, y: -2 } : { scale: 1 }
                            }
                            className={`w-11 h-16 sm:w-14 sm:h-20 border-2 rounded-2xl text-3xl font-black text-center flex items-center justify-center transition-all duration-300 ${
                              digit
                                ? "border-purple-600 bg-white dark:bg-slate-900 ring-8 ring-purple-600/5 shadow-[0_10px_40px_-10px_rgba(147,51,234,0.3)] text-slate-900 dark:text-white"
                                : isFocused
                                  ? "border-purple-400 bg-white dark:bg-slate-900 ring-8 ring-purple-600/10"
                                  : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600"
                            }`}
                          >
                            {digit}
                            {isFocused && !digit && (
                              <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-0.5 h-8 bg-purple-500 rounded-full"
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 py-2">
                    <div
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        timeLeft < 60
                          ? "bg-red-50 dark:bg-red-900/20 text-red-500 animate-pulse"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <RefreshCw
                        size={12}
                        className={timeLeft < 60 ? "animate-spin" : ""}
                        style={{ animationDuration: "3s" }}
                      />
                      {timeLeft > 0 ? (
                        <span>
                          Expires in {Math.floor(timeLeft / 60)}:
                          {(timeLeft % 60).toString().padStart(2, "0")}
                        </span>
                      ) : (
                        <span className="text-red-600">Expired</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={verifyingLoading}
                      className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {verifyingLoading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                      ) : (
                        <>
                          <ShieldCheck size={22} className="text-purple-200" />
                          Verify & Proceed
                        </>
                      )}
                    </motion.button>

                    <div className="flex flex-col items-center gap-4">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendLoading}
                        className="group flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors disabled:opacity-50"
                      >
                        {resendLoading ? (
                          <RefreshCw className="animate-spin h-4 w-4" />
                        ) : (
                          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500 text-slate-400 group-hover:text-purple-500" />
                        )}
                        <span>
                          {resendLoading
                            ? "Sending Code..."
                            : "Resend Verification Code"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifying(false);
                          setOtp("");
                          setTimeLeft(300);
                          setIsExpired(false);
                          setError("");
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full"
                      >
                        <ArrowLeft size={14} />
                        Wrong email? Go back
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="animate-in fade-in duration-700">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">
                    Join PrintNest
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    Start your journey today
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-lg flex items-center gap-3 transition-colors">
                    <div className="shrink-0 w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-[10px] font-bold">
                      !
                    </div>
                    {error}
                  </div>
                )}
                {successMessage && !error && (
                  <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-400 text-sm rounded-r-lg flex items-center gap-3 animate-in fade-in duration-300 transition-colors">
                    <ShieldCheck
                      size={18}
                      className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    {successMessage}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-white dark:bg-slate-800"
                      placeholder="e.g. Alexander Pierce"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-white dark:bg-slate-800"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all pr-12 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-white dark:bg-slate-800"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <div className="mt-4 space-y-2 ml-1">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.id}
                          className={`text-[11px] font-bold flex items-center gap-2 transition-colors ${
                            req.met
                              ? "text-emerald-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        >
                          <motion.div
                            animate={{ scale: req.met ? [1, 1.2, 1] : 1 }}
                            className={`w-1.5 h-1.5 rounded-full ${
                              req.met
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                          {req.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                      ) : (
                        <>
                          Create Account
                          <ChevronRight size={22} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                <div className="text-center text-sm mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors">
                  <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline ml-1"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
