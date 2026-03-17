"use client";
import React from "react";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";

interface AuthPromptModalProps {
  onClose: () => void;
  redirectUrl?: string;
  title?: string;
  message?: string;
}

const AuthPromptModal = ({ 
  onClose, 
  redirectUrl, 
  title = "Account Required", 
  message = "Please login or create an account to access this feature and track your items." 
}: AuthPromptModalProps) => {
  const loginUrl = redirectUrl
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : "/login";
  const signupUrl = redirectUrl
    ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signup";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-indigo-100 shadow-sm">
            <LogIn size={32} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            {message}
          </p>

          <div className="space-y-3">
            <Link
              href={loginUrl}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo-500 text-white font-black shadow-lg shadow-indigo-200 hover:bg-indigo-600 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-wider text-sm"
            >
              <LogIn size={18} />
              Login Now
            </Link>

            <Link
              href={signupUrl}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white border-2 border-gray-100 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all uppercase tracking-wider text-sm"
            >
              <UserPlus size={18} />
              Create Account
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-50">
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
