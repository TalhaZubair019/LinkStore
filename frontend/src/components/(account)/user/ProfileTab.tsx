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
    "w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 focus:border-purple-500 outline-none transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed";
  const LabelClass =
    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors";

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
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center relative">
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
              className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all scale-90 group-hover:scale-100"
              title="Change Picture"
            >
              <Camera size={16} />
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              Personal Information
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update your photo and personal details here.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-4xl">
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
          <button
            type="submit"
            className="px-10 py-3.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95 disabled:opacity-50"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-rose-50 dark:bg-rose-900/10 rounded-lg text-rose-600 dark:text-rose-400">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              Security & Password
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your password and account security settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
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

          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isChangingPassword ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;

