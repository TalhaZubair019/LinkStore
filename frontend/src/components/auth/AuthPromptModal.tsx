"use client";
import React from "react";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";

interface AuthPromptModalProps {
  onClose: () => void;
  redirectUrl?: string;
}

const AuthPromptModal = ({ onClose, redirectUrl }: AuthPromptModalProps) => {
  const loginUrl = redirectUrl
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : "/login";
  const signupUrl = redirectUrl
    ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signup";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative animate-in zoom-in-95 duration-300 border border-slate-200/50 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all hover:rotate-90 duration-300"
        >
          <X size={20} />
        </button>

        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-300 shadow-inner">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
              <LogIn size={28} className="animate-pulse" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Account Required
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-[280px] mx-auto">
            Please login or create an account to complete your purchase and
            track your order.
          </p>

          <div className="space-y-4">
            <Link
              href={loginUrl}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_25px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <LogIn size={20} />
              Login to Account
            </Link>

            <Link
              href={signupUrl}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              <UserPlus size={20} />
              Create New Account
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="text-sm text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold tracking-wide uppercase transition-colors"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
