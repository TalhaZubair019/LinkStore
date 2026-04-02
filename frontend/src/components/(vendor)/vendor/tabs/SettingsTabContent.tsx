"use client";

import { useEffect, useState, useRef } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Store,
  ExternalLink,
  Camera,
} from "lucide-react";

interface SettingsTabContentProps {
  user: any;
}

export default function SettingsTabContent({ user }: SettingsTabContentProps) {
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [isUploading, setIsUploading] = useState<"logo" | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    storeName: user?.vendorProfile?.storeName || "",
    storeDescription: user?.vendorProfile?.storeDescription || "",
    logo: user?.vendorProfile?.logo || "",
  });

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(type);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?folder=vendor", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfileForm((prev) => ({ ...prev, [type]: data.url }));
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorProfile: {
            ...user.vendorProfile,
            storeName: profileForm.storeName,
            storeDescription: profileForm.storeDescription,
            logo: profileForm.logo,
          },
        }),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Error saving profile");
    }
  };

  const handleOnboard = async () => {
    try {
      setOnboarding(true);
      const res = await fetch("/api/vendor/payouts/onboard", {
        method: "POST",
      });
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
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="grid gap-10">
        {/* Financials Section */}
        <section className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-5 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl relative overflow-hidden group">
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <CreditCard size={32} strokeWidth={2.5} />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  Financials & Payouts
                </h2>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest pl-3.5">
                Powered by Stripe Connect
              </p>
            </div>
          </div>

          <div className="bg-slate-50/50 dark:bg-white/3 rounded-4xl p-5 lg:p-8 border border-slate-100 dark:border-white/5 transition-colors relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 opacity-50">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                  Checking connection status...
                </p>
              </div>
            ) : stripeStatus?.stripeOnboardingComplete ? (
              <div className="space-y-8">
                <div className="flex items-start gap-5 p-6 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Account Connected & Active
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-700/70 dark:text-emerald-500/60 mt-1 uppercase tracking-tight">
                      Your Stripe Express account is fully verified. Payouts for
                      orders will be automatically processed.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleOnboard}
                    disabled={onboarding}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 disabled:opacity-50"
                  >
                    {onboarding ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ExternalLink size={18} strokeWidth={2.5} />
                    )}
                    Stripe Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-start gap-5 p-6 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <AlertCircle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Connection Required
                    </h3>
                    <p className="text-[11px] font-bold text-amber-700/70 dark:text-amber-500/60 mt-1 uppercase tracking-tight">
                      Your Stripe Express account is not yet connected. Please
                      connect your account to enable payouts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                      Automated Payouts
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest">
                      Earnings are sent automatically (10% platform fee applies)
                    </p>
                  </div>
                  <button
                    onClick={handleOnboard}
                    disabled={onboarding}
                    className="group relative inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                  >
                    {onboarding ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        Connect with Stripe
                        <ArrowRight
                          size={20}
                          strokeWidth={3}
                          className="group-hover:translate-x-1.5 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Store Profile Section */}
        <section className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-5 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl relative overflow-hidden group">
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="flex items-center gap-6 mb-12 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <Store size={32} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  Store Profile
                </h2>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest pl-3.5">
                Identity and branding
              </p>
            </div>
          </div>

          <div className="space-y-12 relative z-10">
            {/* Logo Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 ml-1">
                  Store Logo
                </label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-36 h-36 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 group/logo transition-all duration-500 shadow-inner"
                >
                  {profileForm.logo ? (
                    <img
                      src={profileForm.logo}
                      alt="Logo"
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover/logo:scale-110"
                    />
                  ) : (
                    <Camera
                      size={40}
                      strokeWidth={1.5}
                      className="text-slate-300 dark:text-slate-700 group-hover/logo:scale-110 transition-transform"
                    />
                  )}
                  {isUploading === "logo" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-white" />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                </div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 ml-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={profileForm.storeName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-black text-[14px] text-slate-800 dark:text-slate-100 uppercase tracking-tight"
                  placeholder="My Shop"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 ml-1">
                  Store Slug
                </label>
                <div className="relative group/slug">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest pointer-events-none">
                    /store/
                  </div>
                  <input
                    type="text"
                    defaultValue={user?.vendorProfile?.storeSlug}
                    readOnly
                    className="w-full pl-24 pr-6 py-5 bg-slate-100 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-700 cursor-not-allowed font-black text-[14px] uppercase tracking-tight"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 ml-1">
                Store Description
              </label>
              <textarea
                value={profileForm.storeDescription}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    storeDescription: e.target.value,
                  })
                }
                rows={5}
                className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-[14px] text-slate-700 dark:text-slate-200 resize-none leading-relaxed"
                placeholder="Log entity mission profile here..."
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="w-full sm:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/5"
              >
                Save Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
