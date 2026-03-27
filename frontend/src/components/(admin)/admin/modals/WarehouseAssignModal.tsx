import React, { useState, useEffect } from "react";
import { X, Search, Save, Loader2, Package } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-white dark:border-slate-800 transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                Assign Products to {warehouseName}
              </h2>
              {/* Usage Badge */}
              <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Capacity Check Enabled
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-1.5 mt-0.5 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 transition-colors" />{" "}
              {location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 min-h-[400px] transition-colors">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="max-h-[350px] overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm italic">
                      No products found.
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 transition-colors">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-12 transition-colors"></th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
                            Product
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right transition-colors">
                            Assign Qty
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                        {filteredProducts.map((p) => {
                          const isSelected =
                            selectedProducts[p.id] !== undefined;
                          return (
                            <tr
                              key={p.id}
                              className={`transition-colors ${isSelected ? "bg-purple-50/30 dark:bg-purple-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleProduct(p.id)}
                                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 dark:bg-slate-800 transition-colors"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden transition-colors">
                                    {p.image ? (
                                      <Image
                                        src={p.image}
                                        alt={p.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <Package
                                        size={16}
                                        className="text-slate-300 dark:text-slate-600"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors line-clamp-1">
                                      {p.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 font-mono mt-0.5 transition-colors">
                                      {p.sku || "No SKU"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {isSelected ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={selectedProducts[p.id]}
                                    onChange={(e) =>
                                      updateQuantity(
                                        p.id,
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-20 px-2 py-1.5 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/50 rounded-lg text-sm font-bold text-center text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors"
                                  />
                                ) : (
                                  <span className="text-xs text-slate-300 dark:text-slate-600 italic font-medium transition-colors">
                                    Select to assign
                                  </span>
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

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div className="text-sm font-bold text-slate-600 dark:text-slate-400 transition-colors">
            {selectedCount} {selectedCount === 1 ? "product" : "products"}{" "}
            selected
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedCount === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
