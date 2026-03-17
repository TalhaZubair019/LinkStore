"use client";

import React from "react";

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
  const InputClass =
    "w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 focus:border-purple-500 outline-none transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed";
  const LabelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors";

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Edit Profile</h3>
      <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={LabelClass}>Full Name</label>
            <input
              type="text"
              className={InputClass}
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
          <label className={LabelClass}>Address</label>
          <input
            type="text"
            className={InputClass}
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
                  <option key={c.isoCode} value={c.isoCode} className="bg-white dark:bg-slate-900">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                  <option key={s.isoCode} value={s.isoCode} className="bg-white dark:bg-slate-900">
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                    <option key={c.name} value={c.name} className="bg-white dark:bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={InputClass}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
          className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95 disabled:opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
