"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  Store,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

interface SettingsTabContentProps {
  user: any;
}

export default function SettingsTabContent({ user }: SettingsTabContentProps) {
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [onboarding, setOnboarding] = useState(false);

  const fetchStripeStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vendor/payouts/status");
      const data = await res.json();
      setStripeStatus(data);
    } catch (error) {
      console.error("Failed to fetch Stripe status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStripeStatus();
  }, []);

  const handleOnboard = async () => {
    try {
      setOnboarding(true);
      const res = await fetch("/api/vendor/payouts/onboard", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start onboarding");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("An unexpected error occurred");
    } finally {
      setOnboarding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-8">
        {/* Stripe Connect Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <CreditCard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Financials & Payouts</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Powered by Stripe Connect</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 transition-colors">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 font-bold py-4">
                <Loader2 size={24} className="animate-spin text-indigo-500" />
                Checking connection status...
              </div>
            ) : stripeStatus?.stripeOnboardingComplete ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={24} />
                  <div>
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-400">Account Connected & Active</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-500/80 mt-1">
                      Your Stripe Express account is fully verified. Payouts for orders will be automatically processed.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-wrap gap-4">
                  <button 
                    onClick={handleOnboard}
                    disabled={onboarding}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
                  >
                    {onboarding ? <Loader2 size={18} className="animate-spin" /> : <ExternalLink size={18} />}
                    Stripe Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl">
                  <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                  <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-400">Onboarding Required</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500/80 mt-1">
                      To receive payouts from your sales, you must connect your bank account via Stripe. This is a secure one-time setup.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Automated Payouts</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Earnings are sent automatically (10% platform fee applies)</p>
                  </div>
                  <button 
                    onClick={handleOnboard}
                    disabled={onboarding}
                    className="group relative inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {onboarding ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        Connect with Stripe
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Store Profile Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Store size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Store Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Identity and branding</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Store Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.vendorProfile?.storeName}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-slate-700 dark:text-slate-200"
                  placeholder="e.g. My Awesome Shop"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Store Slug</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">/store/</span>
                  <input 
                    type="text" 
                    defaultValue={user?.vendorProfile?.storeSlug}
                    readOnly
                    className="w-full pl-22 pr-6 py-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Store Description</label>
              <textarea 
                defaultValue={user?.vendorProfile?.storeDescription}
                rows={4}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-slate-700 dark:text-slate-200 resize-none"
                placeholder="Tell customers about your shop..."
              />
            </div>

            <div className="pt-4">
              <button className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5">
                Save Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
