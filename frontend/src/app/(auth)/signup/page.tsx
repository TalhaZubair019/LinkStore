"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  Github,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { initializeCart } from "@/redux/slices/cartSlice";
import { initializeWishlist } from "@/redux/slices/wishlistSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";

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
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { cartItems: localCartItems } = useSelector((state: any) => state.cart);
  const redirect = searchParams.get("redirect");
  const urlEmail = searchParams.get("email");
  const isNotVerified = searchParams.get("notVerified") === "true";

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

  const handleGitHubLogin = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email`,
    );
  };

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
      setTimeLeft(60);
      setIsExpired(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleCustomSuccess(tokenResponse),
    onError: () => setError("Google Signup failed"),
  });

  const handleGoogleCustomSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenResponse.access_token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google signup failed");

      if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
        dispatch(initializeWishlist(data.user.wishlist));
      } else {
        dispatch(initializeWishlist([]));
      }

      let mergedCart = [...(data.user.cart || [])];
      localCartItems.forEach((localItem: any) => {
        const existingItemIndex = mergedCart.findIndex(
          (item: any) => item.id === localItem.id,
        );
        if (existingItemIndex > -1) {
          mergedCart[existingItemIndex] = {
            ...mergedCart[existingItemIndex],
            quantity:
              mergedCart[existingItemIndex].quantity + localItem.quantity,
          };
        } else {
          mergedCart.push(localItem);
        }
      });

      const totalQty = mergedCart.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0,
      );
      const totalAmt = mergedCart.reduce(
        (acc: number, item: any) => acc + item.price * (item.quantity || 1),
        0,
      );

      dispatch(
        initializeCart({
          cartItems: mergedCart,
          totalQuantity: totalQty,
          totalAmount: totalAmt,
        }),
      );

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      if (redirect) {
        router.push(redirect);
      } else if (data.user.isAdmin) {
        router.push("/admin/dashboard");
      } else if (
        data.user.isVendor &&
        data.user.vendorProfile?.status === "suspended"
      ) {
        router.push("/vendor/suspended");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google signup failed");

      if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
        dispatch(initializeWishlist(data.user.wishlist));
      } else {
        dispatch(initializeWishlist([]));
      }

      let mergedCart = [...(data.user.cart || [])];
      localCartItems.forEach((localItem: any) => {
        const existingItemIndex = mergedCart.findIndex(
          (item: any) => item.id === localItem.id,
        );
        if (existingItemIndex > -1) {
          mergedCart[existingItemIndex] = {
            ...mergedCart[existingItemIndex],
            quantity:
              mergedCart[existingItemIndex].quantity + localItem.quantity,
          };
        } else {
          mergedCart.push(localItem);
        }
      });

      const totalQty = mergedCart.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0,
      );
      const totalAmt = mergedCart.reduce(
        (acc: number, item: any) => acc + item.price * (item.quantity || 1),
        0,
      );

      dispatch(
        initializeCart({
          cartItems: mergedCart,
          totalQuantity: totalQty,
          totalAmount: totalAmt,
        }),
      );

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      if (redirect) {
        router.push(redirect);
      } else if (data.user.isAdmin) {
        router.push("/admin/dashboard");
      } else if (
        data.user.isVendor &&
        data.user.vendorProfile?.status === "suspended"
      ) {
        router.push("/vendor/suspended");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 overflow-hidden">
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
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
            x: [0, 30, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -left-[5%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
      </div>

      <PageHeader
        title={isVerifying ? "Verify Identity" : "Create Account"}
        breadcrumb={isVerifying ? "Verify" : "Signup"}
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
              {isVerifying ? (
                <motion.div
                  key="verify-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="text-center mb-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-20 h-20 bg-linear-to-tr from-purple-600 to-teal-400 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative group cursor-pointer overflow-hidden"
                      onClick={() => {
                        setIsVerifying(false);
                        setOtp("");
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <KeyRound size={36} className="relative z-10" />
                    </motion.div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                      Verify Identity
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      Enter the security code traveling to:
                      <span className="block font-black text-purple-600 dark:text-purple-400 mt-1 uppercase tracking-wider text-[11px]">
                        {formData.email}
                      </span>
                    </p>
                  </div>

                  <AnimatePresence>
                    {(error || successMessage) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                      >
                        <div
                          className={`p-4 rounded-2xl border-l-[6px] font-bold text-sm backdrop-blur-md flex items-center gap-3 ${
                            error
                              ? "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
                              : "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${error ? "bg-red-500" : "bg-emerald-500"}`}
                          >
                            {error ? "!" : "✓"}
                          </div>
                          {error || successMessage}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                        className="flex justify-between gap-2 sm:gap-3 cursor-text"
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
                              animate={
                                isFocused
                                  ? { scale: 1.05, y: -2 }
                                  : { scale: 1 }
                              }
                              className={`w-12 h-16 sm:w-14 sm:h-20 border-2 rounded-2xl text-3xl font-black text-center flex items-center justify-center transition-all duration-300 ${
                                digit
                                  ? "border-purple-600 bg-white dark:bg-slate-900 shadow-xl shadow-purple-500/20 text-slate-900 dark:text-white"
                                  : isFocused
                                    ? "border-purple-400 bg-white dark:bg-slate-900 ring-8 ring-purple-600/5"
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
                              }`}
                            >
                              {digit}
                              {isFocused && !digit && (
                                <motion.div
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                  }}
                                  className="w-0.5 h-8 bg-purple-500 rounded-full"
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
                          timeLeft < 10 && timeLeft > 0
                            ? "bg-red-500/10 text-red-500 animate-pulse"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        <RefreshCw
                          size={14}
                          className={
                            timeLeft < 60 && timeLeft > 0 ? "animate-spin" : ""
                          }
                          style={{ animationDuration: "3s" }}
                        />
                        {timeLeft > 0 ? (
                          <span>RETRY IN {timeLeft}S</span>
                        ) : (
                          <span className="text-red-600">EXPIRED</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={verifyingLoading}
                        className="w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black shadow-xl shadow-purple-500/25 flex justify-center items-center gap-2 disabled:opacity-70"
                      >
                        {verifyingLoading ? (
                          <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                          <>
                            <ShieldCheck
                              size={22}
                              className="text-purple-200"
                            />
                            <span>Verify & Complete</span>
                          </>
                        )}
                      </motion.button>

                      <div className="flex flex-col items-center gap-5">
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={resendLoading || timeLeft > 0}
                          className="group flex items-center gap-2 text-[13px] font-black text-slate-500 hover:text-purple-600 transition-colors disabled:opacity-50"
                        >
                          {resendLoading ? (
                            <RefreshCw className="animate-spin h-4 w-4" />
                          ) : (
                            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
                          )}
                          <span>Request New Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsVerifying(false)}
                          className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-600 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full transition-all"
                        >
                          <ArrowLeft size={14} />
                          <span>Change Email Address</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="animate-in fade-in duration-700"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                      Join LinkStore
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      The exclusive marketplace experience
                    </p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 overflow-hidden"
                      >
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3">
                          <div className="shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                            !
                          </div>
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      <div className="group relative">
                        <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400"
                          placeholder="e.g. John Wick"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="group relative">
                        <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400"
                          placeholder="name@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="group relative">
                        <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-500 transition-colors">
                          Security Phrase
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 pr-14"
                            placeholder="Min 8 premium characters"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
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
                    </div>

                    <div className="pt-6 flex flex-col gap-4">
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
                            <span>Create Account</span>
                            <ArrowRight
                              size={22}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </motion.button>

                      <div className="relative w-full flex items-center gap-4 my-2 px-2">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Or proceed with
                        </span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => googleLoginTrigger()}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[13px] font-bold text-slate-700 dark:text-slate-300"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 12-4.52z"
                            />
                          </svg>
                          <span>Google</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleGitHubLogin}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[13px] font-bold text-slate-700 dark:text-slate-300"
                        >
                          <Github size={18} />
                          <span>GitHub</span>
                        </motion.button>
                      </div>
                    </div>
                  </form>

                  <div className="text-center mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-[15px] font-medium text-slate-500">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-80 transition-opacity ml-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
