"use client";

import React, { useState, useRef } from "react";
import { Camera, Lock, ShieldCheck, Loader2, Mail } from "lucide-react";

interface SettingsTabContentProps {
  user: any;
  fetchStats: () => Promise<void>;
  showToast: (message: string, type: "success" | "error") => void;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({
  user,
  fetchStats,
  showToast,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const MatrixInputClass =
    "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const MatrixLabelClass =
    "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?folder=admin", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfileForm((prev) => ({ ...prev, avatar: data.url }));
        showToast(
          "Press 'Save Changes' to update your avatar permanently.",
          "success",
        );
      } else {
        showToast(data.message || "Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Error uploading image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Profile updated successfully!", "success");
        fetchStats();
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      showToast("Error updating profile", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match", "error");
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
        showToast("Password changed successfully!", "success");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(data.message || "Failed to change password", "error");
      }
    } catch (err) {
      showToast("Error changing password", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 max-w-4xl">
      {/* Profile & Contact Section */}
      <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl relative overflow-hidden group">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-10 relative z-10">
          <div className="relative group/avatar">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center relative shadow-inner group-hover/avatar:border-purple-500/30 transition-all duration-500">
              {profileForm.avatar ? (
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                />
              ) : (
                <span className="text-4xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter">
                  {profileForm.name?.[0] || "A"}
                </span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {/* Overlay Glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
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
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Admin Profile
              </h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest sm:pl-3.5 mt-2 sm:mt-0">
              Manage your personal admin account details.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="space-y-6 sm:space-y-8 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className={MatrixLabelClass}>Display Name</label>
              <input
                type="text"
                className={MatrixInputClass}
                value={profileForm.name}
                placeholder="Enter name..."
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className={MatrixLabelClass}>Contact Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-700"
                  size={18}
                  strokeWidth={2.5}
                />
                <input
                  type="email"
                  className={`${MatrixInputClass} pl-12`}
                  value={profileForm.email}
                  placeholder="name@email.com"
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 disabled:opacity-50"
            >
              {isUpdatingProfile ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Saving
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl relative overflow-hidden group">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex items-center gap-4 mb-8 sm:mb-10 relative z-10">
          <div className="p-3.5 bg-rose-500/10 rounded-[1.25rem] text-rose-500 border border-rose-500/20 shadow-sm shadow-rose-500/10">
            <Lock size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
              Security & Password
            </h3>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest mt-1">
              Update your password
            </p>
          </div>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="space-y-6 sm:space-y-8 max-w-2xl relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="md:col-span-2">
              <label className={MatrixLabelClass}>Current Password</label>
              <input
                type="password"
                className={MatrixInputClass}
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
              <label className={MatrixLabelClass}>New Password</label>
              <input
                type="password"
                className={MatrixInputClass}
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
              <label className={MatrixLabelClass}>Confirm New Password</label>
              <input
                type="password"
                className={MatrixInputClass}
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

          <div className="flex justify-start">
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

export default SettingsTabContent;
