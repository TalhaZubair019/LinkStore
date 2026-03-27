"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Mail, LogOut, Info, ShieldQuestion } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function VendorSuspendedPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(logout());
      router.push("/login");
    } catch (error) {
           console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Showcase */}
          <div className="relative mb-10">
            <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-inner rotate-3">
              <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white border-4 border-white dark:border-slate-900 animate-pulse">
               <Info size={14} strokeWidth={3} />
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 dark:text-amber-500 mb-4">Security Notice</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
            Account <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">Suspended</span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
            Your vendor access has been temporarily restricted. This action was taken to ensure the safety and integrity of our marketplace community.
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-start gap-3 transition-colors hover:bg-white dark:hover:bg-slate-800 text-left group">
              <ShieldQuestion size={20} className="text-purple-600 transition-transform group-hover:scale-110" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Why was I suspended?</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Reasoning may involve policy violations, unusual activity, or pending documentation reviews.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-start gap-3 transition-colors hover:bg-white dark:hover:bg-slate-800 text-left group">
              <Mail size={20} className="text-blue-600 transition-transform group-hover:scale-110" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">What should I do?</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Check your email for a detailed notice or contact our compliance team for an appeal.</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="w-full">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-xl"
            >
              <LogOut size={16} />
              Sign Out and Return to Login
            </button>
          </div>
          
          <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-50">
             Case Reference: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
