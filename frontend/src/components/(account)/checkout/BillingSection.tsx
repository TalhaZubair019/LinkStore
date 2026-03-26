import React from "react";
import AddressForm from "./AddressForm";

interface BillingSectionProps {
  data: any;
  update: (data: any) => void;
  user: any;
  isAuthenticated: boolean;
  isUsingSavedAddress: boolean;
  isViewingSavedAddress: boolean;
  setIsViewingSavedAddress: (val: boolean) => void;
  onAddressModeChange: (useSaved: boolean) => void;
  copyProfileAddress: boolean;
  setCopyProfileAddress: (val: boolean) => void;
  countries: any[];
  states: any[];
  cities: any[];
  hasMounted: boolean;
}

export default function BillingSection({
  data,
  update,
  user,
  isAuthenticated,
  isUsingSavedAddress,
  isViewingSavedAddress,
  setIsViewingSavedAddress,
  onAddressModeChange,
  copyProfileAddress,
  setCopyProfileAddress,
  countries,
  states,
  cities,
  hasMounted,
}: BillingSectionProps) {
  const hasProfileAddress = !!(user && user.address && user.city);

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 transition-colors">
        Billing address
      </h2>

      {hasMounted && isAuthenticated && (
        <div className="mb-6 space-y-3">
          <label
            className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors bg-white dark:bg-slate-900 ${
              !hasProfileAddress
                ? "opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800"
                : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            <input
              type="radio"
              name="addressMode"
              disabled={!hasProfileAddress}
              checked={isUsingSavedAddress}
              onChange={() => onAddressModeChange(true)}
              className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-800"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Use saved address
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hasProfileAddress
                      ? `${user.address}, ${user.city}`
                      : "No address saved in your profile yet"}
                  </span>
                </div>
                {isUsingSavedAddress && !isViewingSavedAddress && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsViewingSavedAddress(true);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md transition-colors"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 transition-colors bg-white dark:bg-slate-900">
            <input
              type="radio"
              name="addressMode"
              checked={!isUsingSavedAddress}
              onChange={() => {
                onAddressModeChange(false);
              }}
              className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-800"
            />
            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Use a different address
            </span>
          </label>

          {!isUsingSavedAddress && hasProfileAddress && (
            <label className="flex items-center gap-2 mt-3 p-2 cursor-pointer bg-blue-50/50 dark:bg-blue-900/10 rounded-md transition-colors">
              <input
                type="checkbox"
                checked={copyProfileAddress}
                onChange={(e) => {
                  setCopyProfileAddress(e.target.checked);
                  if (e.target.checked) {
                    update({
                      firstName: user.name?.split(" ")[0] || data.firstName,
                      lastName: user.name?.split(" ")[1] || data.lastName,
                      phone: user.phone || data.phone,
                      address: user.address || "",
                      city: user.city || "",
                      province: user.province || "",
                      country: user.country || "Pakistan",
                      countryCode: user.countryCode || "PK",
                      stateCode: user.stateCode || "",
                      postcode: user.postcode || "",
                    });
                  } else {
                    update({
                      address: "",
                      apartment: "",
                      city: "",
                      province: "",
                      country: "Pakistan",
                      countryCode: "PK",
                      stateCode: "",
                      postcode: "",
                      phone: "",
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-800"
              />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Copy my saved address data here
              </span>
            </label>
          )}
        </div>
      )}

      {hasMounted &&
        (!hasProfileAddress ||
          !isUsingSavedAddress ||
          isViewingSavedAddress) && (
          <AddressForm
            data={data}
            update={update}
            countries={countries}
            states={states}
            cities={cities}
            isReadOnly={isUsingSavedAddress && isViewingSavedAddress}
          />
        )}
    </section>
  );
}
