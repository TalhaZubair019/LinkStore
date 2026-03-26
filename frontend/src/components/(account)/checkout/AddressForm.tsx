import React from "react";
import { ChevronDown } from "lucide-react";

interface AddressFormProps {
  data: any;
  update: (data: any) => void;
  countries: any[];
  states: any[];
  cities: any[];
  isReadOnly: boolean;
}

export default function AddressForm({
  data,
  update,
  countries,
  states,
  cities,
  isReadOnly,
}: AddressFormProps) {
  const InputClass = `w-full border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors ${
    isReadOnly
      ? "bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-80"
      : "bg-white dark:bg-slate-900"
  }`;
  const LabelClass =
    "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block transition-colors";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="relative">
        <label className={LabelClass}>
          Country / Region <span className="text-red-500">*</span>
        </label>
        <select
          required
          disabled={isReadOnly}
          className={`${InputClass} appearance-none bg-slate-50 ${
            isReadOnly ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          value={data.countryCode}
          onChange={(e) => {
            const country = countries.find(
              (c: any) => c.isoCode === e.target.value,
            );
            update({
              countryCode: e.target.value,
              country: country?.name || "",
              stateCode: "",
              province: "",
              city: "",
            });
          }}
        >
          <option value="">Select Country...</option>
          {countries.map((c: any) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-4 top-9 text-slate-400 pointer-events-none"
          size={16}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LabelClass}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            readOnly={isReadOnly}
            className={InputClass}
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label className={LabelClass}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            readOnly={isReadOnly}
            className={InputClass}
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className={LabelClass}>
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          readOnly={isReadOnly}
          placeholder="House number and street name"
          className={`${InputClass} mb-3`}
          value={data.address}
          onChange={(e) => update({ address: e.target.value })}
        />
        <input
          type="text"
          readOnly={isReadOnly}
          placeholder="Apartment, suite, unit, etc. (optional)"
          className={InputClass}
          value={data.apartment}
          onChange={(e) => update({ apartment: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className={LabelClass}>
            Province / State <span className="text-red-500">*</span>
          </label>
          <select
            required
            disabled={isReadOnly || !data.countryCode}
            className={`${InputClass} appearance-none bg-transparent ${
              isReadOnly ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            value={data.stateCode}
            onChange={(e) => {
              const state = states.find(
                (s: any) => s.isoCode === e.target.value,
              );
              update({
                stateCode: e.target.value,
                province: state?.name || "",
                city: "",
              });
            }}
          >
            <option value="">Select...</option>
            {states.map((s: any) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-9 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
        <div className="relative">
          <label className={LabelClass}>
            City <span className="text-red-500">*</span>
          </label>
          {cities.length > 0 ? (
            <>
              <select
                required
                disabled={isReadOnly || !data.stateCode}
                className={`${InputClass} appearance-none bg-transparent ${
                  isReadOnly ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                value={data.city}
                onChange={(e) => update({ city: e.target.value })}
              >
                <option value="">Select...</option>
                {cities.map((c: any) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-9 text-slate-400 pointer-events-none"
                size={16}
              />
            </>
          ) : (
            <input
              type="text"
              required
              readOnly={isReadOnly}
              placeholder="Enter city"
              className={InputClass}
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              disabled={isReadOnly || !data.stateCode}
            />
          )}
        </div>
        <div>
          <label className={LabelClass}>
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            readOnly={isReadOnly}
            className={InputClass}
            value={data.postcode}
            onChange={(e) => update({ postcode: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className={LabelClass}>
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          readOnly={isReadOnly}
          className={InputClass}
          value={data.phone}
          onChange={(e) => update({ phone: e.target.value })}
        />
      </div>
    </div>
  );
}
