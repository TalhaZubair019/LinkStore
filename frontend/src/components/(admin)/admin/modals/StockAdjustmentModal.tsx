import React, { useState } from "react";
import { X, Plus, Save, Loader2, Package } from "lucide-react";

interface WarehouseInventory {
  warehouseName: string;
  location: string;
  quantity: number;
}

interface StockAdjustmentModalProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
  isAdminView?: boolean;
}

export default function StockAdjustmentModal({
  product,
  onClose,
  onSuccess,
  isAdminView = true,
}: StockAdjustmentModalProps) {
  const [sku, setSku] = useState(product.sku || "");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product.lowStockThreshold || 5,
  );
  const [warehouses, setWarehouses] = useState<WarehouseInventory[]>(
    product.warehouseInventory || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchWH = async () => {
      try {
        const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
        const res = await fetch(`${apiPrefix}/warehouses`);
        if (res.ok) {
          const data = await res.json();
          setAvailableWarehouses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch warehouses", err);
      }
    };
    fetchWH();
  }, [isAdminView]);

  const totalStock = warehouses.reduce(
    (acc, curr) => acc + (curr.quantity || 0),
    0,
  );

  const addWarehouse = () => {
    setWarehouses([
      ...warehouses,
      { warehouseName: "", location: "", quantity: 0 },
    ]);
  };

  const removeWarehouse = (index: number) => {
    setWarehouses(warehouses.filter((_, i) => i !== index));
  };

  const updateWarehouse = (
    index: number,
    field: keyof WarehouseInventory,
    value: string | number,
  ) => {
    const newW = [...warehouses];
    const updated = { ...(newW[index] as any), [field]: value };

    if (field === "warehouseName") {
      const found = availableWarehouses.find(
        (w) => w.name === value || w.warehouseName === value,
      );
      if (found) {
        updated.location = found.location;
      }
    }

    newW[index] = updated;
    setWarehouses(newW);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
      const res = await fetch(`${apiPrefix}/products/${product.id}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          lowStockThreshold: Number(lowStockThreshold),
          warehouseInventory: warehouses,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err: any) {
      alert(`Error updating inventory: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-white dark:border-slate-800 transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                Adjust Inventory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[300px] transition-colors">
                {product.title}
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

        <div className="p-6 overflow-y-auto flex-1">
          <form
            id="inventory-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors">
                  SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g., TS-001"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 font-mono text-sm text-slate-700 dark:text-slate-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 font-mono text-sm text-slate-700 dark:text-slate-200 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white transition-colors">
                    Warehouse Locations
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    Manage stock across different locations
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1 transition-colors">
                    Total Stock
                  </span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400 leading-none transition-colors">
                    {totalStock}
                  </span>
                </div>
              </div>

              {warehouses.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3 transition-colors">
                    No inventory locations set up.
                  </p>
                  <button
                    type="button"
                    onClick={addWarehouse}
                    className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    + Add First Location
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {warehouses.map((wh, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 relative group animate-in fade-in transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => removeWarehouse(idx)}
                        className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-rose-500 border border-red-200 dark:border-red-900/50 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/50 shadow-sm z-10"
                      >
                        ×
                      </button>
                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5 transition-colors">
                            Warehouse Name
                          </label>
                          <select
                            required
                            value={wh.warehouseName}
                            onChange={(e) =>
                              updateWarehouse(
                                idx,
                                "warehouseName",
                                e.target.value,
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors"
                          >
                            <option value="">Select Warehouse</option>
                            {availableWarehouses.map((aw: any) => (
                              <option
                                key={aw.id || aw._id}
                                value={aw.name || aw.warehouseName}
                              >
                                {aw.name || aw.warehouseName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5 transition-colors">
                            Location
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. NY"
                            value={wh.location}
                            readOnly
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-500 dark:text-slate-400 outline-none transition-colors cursor-not-allowed"
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5 transition-colors">
                            Qty
                          </label>
                          <input
                            required
                            type="number"
                            min="0"
                            value={wh.quantity}
                            onChange={(e) =>
                              updateWarehouse(
                                idx,
                                "quantity",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-sm text-center text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 font-bold transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addWarehouse}
                    className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200 transition-colors flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Plus size={14} /> Add Location
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 rounded-b-2xl transition-colors">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            form="inventory-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Save size={16} className="mr-1.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
