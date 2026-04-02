import React, { useState, useEffect } from "react";
import { X, Search, Save, Loader2, Package, ChevronRight, Boxes } from "lucide-react";
import Image from "next/image";

interface WarehouseAssignModalProps {
  warehouseName: string;
  location: string;
  onClose: () => void;
  onSuccess: () => void;
  isAdminView?: boolean;
}

export default function WarehouseAssignModal({
  warehouseName,
  location,
  onClose,
  onSuccess,
  isAdminView = true,
}: WarehouseAssignModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
        const res = await fetch(`${apiPrefix}/stats`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isAdminView]);

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleProduct = (productId: number) => {
    const next = { ...selectedProducts };
    if (next[productId] !== undefined) {
      delete next[productId];
    } else {
      next[productId] = 1;
    }
    setSelectedProducts(next);
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 0) return;
    setSelectedProducts((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleSubmit = async () => {
    const payloadProducts = Object.entries(selectedProducts).map(
      ([id, qty]) => ({
        productId: Number(id),
        quantity: qty,
      }),
    );

    if (payloadProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
      const res = await fetch(`${apiPrefix}/warehouses/bulk-assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseName,
          location,
          products: payloadProducts,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err: any) {
      alert(`Error assigning products: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = Object.keys(selectedProducts).length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#11141b] rounded-[2.5rem] w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/5 shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between text-white bg-white/1">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-500 shrink-0">
                <Boxes size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight truncate">
                    Assign Products to {warehouseName}
                  </h2>
                  <div className="hidden sm:inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Capacity Check Enabled
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bold tracking-tight truncate flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    {location}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all ml-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-20 animate-pulse" />
                <Loader2 className="animate-spin text-purple-500 relative z-10" size={40} />
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Syncing Products...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-[#1e222a] border border-white/5 text-slate-200 rounded-3xl outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-sm shadow-inner transition-all placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-4xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Package size={24} className="text-slate-600" />
                      </div>
                      <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No products found</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/2 border-b border-white/5">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Product</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Assign Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProducts.map((p) => {
                          const isSelected = selectedProducts[p.id] !== undefined;
                          return (
                            <tr
                              key={p.id}
                              onClick={() => toggleProduct(p.id)}
                              className={`group cursor-pointer transition-all duration-300 ${isSelected ? "bg-purple-600/10" : "hover:bg-white/2"}`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#1e222a] flex items-center justify-center shrink-0 relative overflow-hidden transition-all group-hover:scale-105">
                                    {p.image ? (
                                      <Image
                                        src={p.image}
                                        alt={p.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        unoptimized
                                      />
                                    ) : (
                                      <Package
                                        size={20}
                                        className="text-slate-700"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-black text-slate-200 line-clamp-1 tracking-tight">
                                      {p.title}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                      {p.sku || "No SKU"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right" onClick={(e) => isSelected && e.stopPropagation()}>
                                {isSelected ? (
                                  <div className="inline-flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      autoFocus
                                      value={selectedProducts[p.id]}
                                      onChange={(e) =>
                                        updateQuantity(
                                          p.id,
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      className="w-24 px-4 py-2 bg-[#1e222a] border border-purple-500/30 rounded-xl text-sm font-black text-center text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner"
                                    />
                                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Units</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-2 text-slate-600 font-black text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                                    Select to assign <ChevronRight size={14} />
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 bg-[#11141b] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 text-xs font-black">
              {selectedCount}
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Items Selected
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedCount === 0}
              className="flex-1 sm:flex-none px-10 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:shadow-purple-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 group"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} className="group-hover:scale-110 transition-transform" />
              )}
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
