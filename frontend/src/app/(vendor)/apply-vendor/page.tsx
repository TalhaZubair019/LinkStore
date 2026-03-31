"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/Store";
import { updateUser } from "@/redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function ApplyVendorPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
  });
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !authLoading && !isAuthenticated) {
      router.push("/login?redirect=/apply-vendor");
    }
  }, [isAuthenticated, authLoading, router, hasMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      setSuccess(true);
      dispatch(
        updateUser({
          vendorProfile: {
            ...user?.vendorProfile,
            status: "pending",
            storeName: formData.storeName,
            storeSlug: formData.storeName.toLowerCase().replace(/\s+/g, "-"),
          },
        }),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const status = user?.vendorProfile?.status;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Become a Seller
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Launch your store and reach millions of customers.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === "approved" ? (
              <motion.div
                key="approved"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  You're a Seller!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 px-4">
                  Your application for{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    "{user?.vendorProfile?.storeName}"
                  </span>{" "}
                  has been approved.
                </p>
                <button
                  onClick={() => router.push("/vendor/dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
                >
                  Go to Dashboard
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </motion.div>
            ) : status === "pending" || success ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-6">
                  <Clock size={40} className="animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Application Pending
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 px-4">
                  We've received your application and it's currently being
                  reviewed by our team. You'll be notified once approved.
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Reviewing details for:
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {user?.vendorProfile?.storeName || formData.storeName}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {status === "rejected" && !error && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex flex-col gap-2 border border-rose-100 dark:border-rose-900/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={20} />
                      <p className="text-sm font-bold">Application Rejected</p>
                    </div>
                    <p className="text-xs ml-8 leading-relaxed opacity-80">
                      Your previous application was rejected. Please check your
                      email for details before submitting a new one. You can
                      update your store details below and try again.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 border border-rose-100 dark:border-rose-900/30">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream Designs"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 outline-none transition-all dark:text-white"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Store Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you'll be selling..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 outline-none transition-all dark:text-white resize-none"
                    value={formData.storeDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storeDescription: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send
                          size={20}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-blue-600 transition-colors">
          <button onClick={() => router.push("/")}>Back to home</button>
        </p>
      </div>
    </div>
  );
}
