"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { initializeCart } from "@/redux/slices/cartSlice";
import { initializeWishlist } from "@/redux/slices/wishlistSlice";
import {
  Loader2,
  Eye,
  EyeOff,
  Github,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useGoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const dispatch = useDispatch();
  const { cartItems: localCartItems } = useSelector((state: any) => state.cart);
  const isDeleted = searchParams.get("msg") === "deleted";

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword || prev.password,
      }));
      setRememberMe(true);
    }
  }, []);

  React.useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleGitHubCallback(code);
    }
  }, [searchParams]);

  const handleGitHubCallback = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "GitHub login failed");

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
      router.replace("/login", { scroll: false });
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
      router.replace("/login", { scroll: false });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email`,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberedPassword", formData.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

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
      if (err.message.includes("not verified")) {
        router.push(
          `/signup?email=${encodeURIComponent(formData.email)}&notVerified=true`,
        );
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleCustomSuccess(tokenResponse),
    onError: () => setError("Google Login failed"),
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
      if (!res.ok) throw new Error(data.message || "Google login failed");

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
      if (!res.ok) throw new Error(data.message || "Google login failed");

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
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [0, -30, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] rounded-full"
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

      <PageHeader title="Login" breadcrumb="Login" />

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
                className="w-16 h-16 bg-linear-to-tr from-purple-600 to-teal-400 p-0.5 rounded-2xl mx-auto mb-6 shadow-xl shadow-purple-500/20"
              >
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Sparkles size={32} className="text-purple-600" />
                </div>
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Access your premium LinkStore dashboard
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
                    <div className="text-red-500 text-sm text-center bg-red-500/10 dark:bg-red-500/10 p-3 rounded-2xl border border-red-500/20 font-bold mb-4">
                      {error}
                    </div>
                  </motion.div>
                )}
                {isDeleted && !error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="text-amber-600 text-sm text-center bg-amber-500/10 dark:bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 font-bold mb-4">
                      Your account has been deleted by an administrator.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                <div className="group relative">
                  <label className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-purple-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="group relative">
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors group-focus-within:text-purple-500">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[13px] font-bold text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600 pr-14"
                      placeholder="Enter your security phrase"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all checked:border-purple-500 checked:bg-purple-500 focus:ring-4 focus:ring-purple-500/10"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <svg
                      className="pointer-events-none absolute h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    Keep me signed in
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.01, translateY: -1 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="group w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                  {loading ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight
                        size={20}
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

            <div className="text-center mt-10">
              <p className="text-[15px] font-medium text-slate-500 dark:text-slate-500">
                New to the platform?{" "}
                <Link
                  href="/signup"
                  className="font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-teal-400 hover:opacity-80 transition-opacity"
                >
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
