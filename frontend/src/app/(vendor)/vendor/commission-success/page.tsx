"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CommissionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId || hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/vendor/verify-payment/verify-commission-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your commission has been successfully settled. Your store status is now secure.");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify payment session.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your payment. Please contact support.");
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-xl p-10 text-center border border-slate-100 dark:border-slate-800">
           <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Session</h1>
           <p className="text-slate-500 dark:text-slate-400 mb-8">No payment session was found. If you believe this is an error, please contact support.</p>
           <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-transform hover:scale-105">
             Back to Dashboard
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-2xl dark:shadow-black/50 p-10 text-center border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Settle in Progress</h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Settlement Confirmed</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">{message}</p>
            
            <div className="w-full space-y-4">
              <Link
                href="/vendor/dashboard"
                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
              >
                Return to Dashboard
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mb-8">
              <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Verification Failed</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">{message}</p>
            
            <Link
              href="/vendor/dashboard?tab=commission"
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
