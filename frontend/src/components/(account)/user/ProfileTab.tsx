"use client";

import React, { useState, useRef } from "react";
import { Camera, Lock, ShieldCheck, Loader2 } from "lucide-react";

interface ProfileTabProps {
  profileForm: {
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    countryCode: string;
    stateCode: string;
    province: string;
    postcode: string;
    avatar: string;
  };
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  countries: any[];
  states: any[];
  cities: any[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profileForm,
  setProfileForm,
  handleUpdateProfile,
  countries,
  states,
  cities,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const InputClass =
    "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none";
  const LabelClass =
    "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?folder=user", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfileForm({ ...profileForm, avatar: data.url });
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (err) {
      alert("Error changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Info Card */}
      <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-8 md:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-10 relative z-10 text-center sm:text-left">
          <div className="relative group/avatar shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center relative shadow-inner group-hover/avatar:border-purple-500/30 transition-all duration-500">
              {profileForm.avatar ? (
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-slate-300 dark:text-slate-600 uppercase">
                  {profileForm.name?.[0] || "U"}
                </span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
              <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-3 bg-purple-600 text-white rounded-2xl shadow-xl hover:bg-purple-500 dark:shadow-purple-500/20 transition-all scale-90 group-hover/avatar:scale-100 active:scale-90 border-4 border-white dark:border-[#0d0f14]"
              title="Change Picture"
            >
              <Camera size={18} strokeWidth={2.5} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Personal Information
              </h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest sm:pl-3.5 mt-2 sm:mt-0">
              Update your photo and personal details here.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6 sm:space-y-8 max-w-4xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={LabelClass}>Full Name</label>
              <input
                type="text"
                className={InputClass}
                placeholder="Ex. John Doe"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={LabelClass}>Phone Number</label>
              <input
                type="tel"
                className={InputClass}
                placeholder="+92 3XX XXXXXXX"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className={LabelClass}>Shipping Address</label>
            <input
              type="text"
              className={InputClass}
              placeholder="Street Address, Apartment, Suite, etc."
              value={profileForm.address}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className={LabelClass}>Country</label>
              <div className="relative">
                <select
                  className={`${InputClass} appearance-none cursor-pointer`}
                  value={profileForm.countryCode}
                  onChange={(e) => {
                    const country = countries.find(
                      (c: any) => c.isoCode === e.target.value,
                    );
                    setProfileForm({
                      ...profileForm,
                      countryCode: e.target.value,
                      country: country?.name || "",
                      stateCode: "",
                      city: "",
                    });
                  }}
                >
                  <option value="">Select Country...</option>
                  {countries.map((c: any) => (
                    <option
                      key={c.isoCode}
                      value={c.isoCode}
                      className="bg-white dark:bg-slate-900"
                    >
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="relative">
              <label className={LabelClass}>Province / State</label>
              <div className="relative">
                <select
                  className={`${InputClass} appearance-none cursor-pointer`}
                  value={profileForm.stateCode}
                  onChange={(e) => {
                    const state = states.find(
                      (s: any) => s.isoCode === e.target.value,
                    );
                    setProfileForm({
                      ...profileForm,
                      stateCode: e.target.value,
                      province: state?.name || "",
                      city: "",
                    });
                  }}
                  disabled={!profileForm.countryCode}
                >
                  <option value="">Select...</option>
                  {states.map((s: any) => (
                    <option
                      key={s.isoCode}
                      value={s.isoCode}
                      className="bg-white dark:bg-slate-900"
                    >
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className={LabelClass}>City</label>
              <div className="relative">
                {cities.length > 0 ? (
                  <select
                    className={`${InputClass} appearance-none cursor-pointer`}
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        city: e.target.value,
                      })
                    }
                    disabled={!profileForm.stateCode}
                  >
                    <option value="">Select...</option>
                    {cities.map((c: any) => (
                      <option
                        key={c.name}
                        value={c.name}
                        className="bg-white dark:bg-slate-900"
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={InputClass}
                    placeholder="City Name"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        city: e.target.value,
                      })
                    }
                    disabled={!profileForm.stateCode}
                  />
                )}
                {cities.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className={LabelClass}>Postcode</label>
              <input
                type="text"
                className={InputClass}
                placeholder="Ex. 12345"
                value={profileForm.postcode}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    postcode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 disabled:opacity-50"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-8 md:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 sm:mb-10 text-center sm:text-left relative z-10">
          <div className="p-3.5 bg-rose-500/10 rounded-[1.25rem] text-rose-500 border border-rose-500/20 shadow-sm shadow-rose-500/10 shrink-0">
            <Lock size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Security & Password
              </h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest sm:pl-3.5">
              Manage your password and account security settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6 sm:space-y-8 max-w-2xl relative z-10">
          <div className="space-y-4">
            <div>
              <label className={LabelClass}>Current Password</label>
              <input
                type="password"
                className={InputClass}
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className={LabelClass}>New Password</label>
              <input
                type="password"
                className={InputClass}
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className={LabelClass}>Confirm New Password</label>
              <input
                type="password"
                className={InputClass}
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} strokeWidth={2.5} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;

