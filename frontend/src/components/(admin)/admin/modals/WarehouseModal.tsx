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
  const [capacity, setCapacity] = useState("");
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingWarehouse) {
        setName(editingWarehouse.warehouseName || "");
        setCapacity(editingWarehouse.capacity?.toString() || "0");

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
        setCapacity("0");
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
        body: JSON.stringify({ name, location: fullLocation, capacity }),
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
    "w-full bg-[#1e222a] border border-white/5 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-sm appearance-none text-slate-200 placeholder:text-slate-500 transition-all shadow-inner";
  const LabelClass =
    "block text-[10px] sm:text-xs font-black mb-2 text-slate-500 uppercase tracking-[0.2em] transition-colors";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-colors"
        onClick={onClose}
      />

      <div className="relative bg-[#11141b] rounded-[2.5rem] shadow-2xl border border-white/5 w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/1 rounded-t-[2.5rem]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-md opacity-20" />
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white relative z-10 border border-white/20 shadow-lg">
                <Building2 size={24} className="drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {editingWarehouse ? "Edit Warehouse" : "Create Warehouse"}
              </h2>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                {editingWarehouse
                  ? "Update warehouse details"
                  : "Add a new storage location"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className={LabelClass}>Warehouse Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., East Coast Hub"
                    className={InputClass}
                  />
                  <div className="absolute inset-0 rounded-2xl border border-purple-500 opacity-0 group-focus-within:opacity-20 pointer-events-none transition-opacity" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={LabelClass}>Warehouse Capacity (Max Units)</label>
                <div className="relative group">
                  <input
                    type="number"
                    required
                    min="0"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g., 500"
                    className={InputClass}
                  />
                  <div className="absolute inset-0 rounded-2xl border border-purple-500 opacity-0 group-focus-within:opacity-20 pointer-events-none transition-opacity" />
                </div>
              </div>

              <div>
                <label className={LabelClass}>Country</label>
                <div className="relative group">
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
                      <option key={c.isoCode} value={c.isoCode} className="bg-[#1e222a]">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-slate-500 pointer-events-none group-focus-within:text-purple-500 transition-colors"
                    size={16}
                  />
                </div>
              </div>

              <div>
                <label className={LabelClass}>Street Address</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building, street name"
                    className={InputClass}
                  />
                  <div className="absolute inset-0 rounded-2xl border border-purple-500 opacity-0 group-focus-within:opacity-20 pointer-events-none transition-opacity" />
                </div>
              </div>

              <div>
                <label className={LabelClass}>Province / State</label>
                <div className="relative group">
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
                    className={`${InputClass} ${!countryCode ? "bg-[#11141b] cursor-not-allowed opacity-50" : ""}`}
                  >
                    <option value="">Select State...</option>
                    {states.map((s: any) => (
                      <option key={s.isoCode} value={s.isoCode} className="bg-[#1e222a]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-slate-500 pointer-events-none group-focus-within:text-purple-500 transition-colors"
                    size={16}
                  />
                </div>
              </div>

              <div>
                <label className={LabelClass}>City</label>
                <div className="relative group">
                  {cities.length > 0 ? (
                    <>
                      <select
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={InputClass}
                      >
                        <option value="">Select City...</option>
                        {cities.map((c: any) => (
                          <option key={c.name} value={c.name} className="bg-[#1e222a]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-3.5 text-slate-500 pointer-events-none group-focus-within:text-purple-500 transition-colors"
                        size={16}
                      />
                    </>
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
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-blue-500/5 text-blue-400 text-[11px] rounded-2xl border border-blue-500/10 backdrop-blur-sm shadow-inner mt-2">
              <div className="shrink-0 w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mt-0.5">
                <span className="font-black text-[10px]">i</span>
              </div>
              <span className="font-bold leading-relaxed tracking-wide">
                <strong className="text-blue-300 uppercase tracking-widest text-[9px] mr-1">Note:</strong>
                Changes to the location will be concatenated into a single searchable string for internal tracking and maps.
              </span>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-white/5 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:shadow-purple-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 group"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} className="group-hover:scale-110 transition-transform" />
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
