"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/Store";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      if (!user.isVendor) {
        router.push("/vendor/apply");
        return;
      }

      if (user.vendorProfile?.status !== "approved") {
        router.push("/vendor/apply?status=" + (user.vendorProfile?.status || "none"));
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verifying Vendor Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
