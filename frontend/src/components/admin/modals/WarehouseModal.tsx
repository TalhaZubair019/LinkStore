import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Building2, ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWarehouse: any | null;
  onSaved: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  isAdminView?: boolean;
}

export default function WarehouseModal({
  isOpen,
  onClose,
  editingWarehouse,
  onSaved,
  showToast,
  isAdminView = true,
}: WarehouseModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [countryName, setCountryName] = useState("Pakistan");
  const [stateCode, setStateCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingWarehouse) {
        setName(editingWarehouse.warehouseName || "");

        const loc = editingWarehouse.location || "";
        const parts = loc.split(", ").map((p: string) => p.trim());

        if (parts.length >= 3) {
          const countryStr = parts.pop() || "";
          const stateStr = parts.pop() || "";
          const cityStr = parts.pop() || "";
          const addressPart = parts.join(", ");

          setCountryName(countryStr);
          setStateName(stateStr);
          setCity(cityStr);
          setAddress(addressPart);

          const foundCountry = countries.find((c) => c.name === countryStr);
          if (foundCountry) {
            setCountryCode(foundCountry.isoCode);
            const countryStates = State.getStatesOfCountry(
              foundCountry.isoCode,
            );
            const foundState = countryStates.find((s) => s.name === stateStr);
            if (foundState) setStateCode(foundState.isoCode);
          }
        } else {
          setAddress(loc);
          setCountryCode("PK");
          setCountryName("Pakistan");
        }
      } else {
        setName("");
        setAddress("");
        setCountryCode("PK");
        setCountryName("Pakistan");
        setStateCode("");
        setStateName("");
        setCity("");
      }
    }
  }, [isOpen, editingWarehouse, countries]);

  useEffect(() => {
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
    } else {
      setStates([]);
    }
  }, [countryCode]);

  useEffect(() => {
    if (countryCode && stateCode) {
      setCities(City.getCitiesOfState(countryCode, stateCode));
    } else {
      setCities([]);
    }
  }, [countryCode, stateCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullLocation = `${address}${city ? `, ${city}` : ""}${stateName ? `, ${stateName}` : ""}, ${countryName}`;

    try {
      const isEditing = !!editingWarehouse;
      const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
      const url = isEditing
        ? `${apiPrefix}/warehouses/${editingWarehouse.id}`
        : `${apiPrefix}/warehouses`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location: fullLocation }),
      });

      if (res.ok) {
        showToast(
          isEditing
            ? "Warehouse updated successfully."
            : "Warehouse created successfully.",
          "success",
        );
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to save warehouse.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputClass =
    "w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm appearance-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all";
  const LabelClass =
    "block text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-colors"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-white dark:border-slate-800 w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 rounded-t-2xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                {editingWarehouse ? "Edit Warehouse" : "Create Warehouse"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingWarehouse
                  ? "Update warehouse details"
                  : "Add a new storage location"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={LabelClass}>Warehouse Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., East Coast Hub"
                className={InputClass}
              />
            </div>

            <div className="relative">
              <label className={LabelClass}>Country</label>
              <div className="relative">
                <select
                  required
                  value={countryCode}
                  onChange={(e) => {
                    const country = countries.find(
                      (c: any) => c.isoCode === e.target.value,
                    );
                    setCountryCode(e.target.value);
                    setCountryName(country?.name || "");
                    setStateCode("");
                    setStateName("");
                    setCity("");
                  }}
                  className={InputClass}
                >
                  <option value="">Select Country...</option>
                  {countries.map((c: any) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className={LabelClass}>Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building, street name"
                className={InputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className={LabelClass}>Province / State</label>
                <div className="relative">
                  <select
                    required
                    disabled={!countryCode}
                    value={stateCode}
                    onChange={(e) => {
                      const state = states.find(
                        (s: any) => s.isoCode === e.target.value,
                      );
                      setStateCode(e.target.value);
                      setStateName(state?.name || "");
                      setCity("");
                    }}
                    className={`${InputClass} ${!countryCode ? "bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-50" : ""}`}
                  >
                    <option value="">Select State...</option>
                    {states.map((s: any) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div className="relative">
                <label className={LabelClass}>City</label>
                <div className="relative">
                  {cities.length > 0 ? (
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={InputClass}
                    >
                      <option value="">Select City...</option>
                      {cities.map((c: any) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className={InputClass}
                    />
                  )}
                  {cities.length > 0 && (
                    <ChevronDown
                      className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                      size={16}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] rounded-lg border border-blue-100 dark:border-blue-900/50 transition-colors">
              <span className="font-bold shrink-0 mt-0.5">Note:</span>
              <span>
                Changes to the warehouse location will be concatenated into a
                single searchable string for maps and internal tracking.
              </span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-2 transition-colors">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 dark:hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editingWarehouse ? "Save Changes" : "Create Warehouse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
