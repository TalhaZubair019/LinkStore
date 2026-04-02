import React, { useState } from "react";
import Image from "next/image";
import { Package, Edit2 } from "lucide-react";

interface InventoryTableProps {
  products: any[];
  onAdjustStock: (product: any) => void;
}

export default function InventoryTable({
  products,
  onAdjustStock,
}: InventoryTableProps) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = (products || []).slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl animate-in fade-in duration-700 group/table">
      <div className="p-5 lg:p-8 border-b border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden transition-colors">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Inventory Management
              </h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">
                Track and manage your inventory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-purple-500/20">
              {products?.length || 0} Products
            </span>
          </div>
        </div>
      </div>

      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5 overflow-hidden transition-colors">
        {paginatedProducts.length === 0 ? (
          <div className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Package size={24} className="opacity-50" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No Products Found
            </p>
          </div>
        ) : (
          paginatedProducts.map((p) => {
            const stock = p.stockQuantity || 0;
            const threshold = p.lowStockThreshold || 5;

            let statusBadge = null;
            if (stock <= 0) {
              statusBadge = (
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  OUT OF STOCK
                </div>
              );
            } else if (stock <= threshold) {
              statusBadge = (
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                  LOW STOCK
                </div>
              );
            } else {
              statusBadge = (
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  IN STOCK
                </div>
              );
            }

            return (
              <div
                key={p.id}
                className="p-5 lg:p-8 space-y-5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all group/card relative"
              >
                <div className="flex gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border border-slate-100 dark:border-white/10 overflow-hidden relative bg-white dark:bg-white/5 shrink-0 flex items-center justify-center shadow-inner group-hover/card:scale-105 transition-transform duration-500">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-contain p-3"
                        unoptimized
                      />
                    ) : (
                      <Package className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                      <h4 className="font-black text-[15px] text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate">
                        {p.title}
                      </h4>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-3.5">
                      {p.category || "Uncategorized"}
                    </p>
                    <div className="mt-2.5 text-[9px] font-mono font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tighter pl-3.5 opacity-60">
                      SKU:{" "}
                      <span className="whitespace-nowrap px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/5">
                        {p.sku || `PRD-${String(p.id).slice(-8).toUpperCase()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-white/3 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                      Stock Count
                    </span>
                    <span className="text-[14px] font-black text-slate-900 dark:text-slate-100 tabular-nums">
                      {stock}{" "}
                      <span className="text-[10px] text-slate-400 ml-1">
                        UNITS
                      </span>
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <button
                  onClick={() => onAdjustStock(p)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                >
                  <Edit2 size={16} strokeWidth={2.5} /> Adjust Inventory
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto no-scrollbar transition-colors">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                Product Info
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                SKU
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Total Count
              </th>
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-30 grayscale">
                    <Package size={48} strokeWidth={1} />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">
                      No Products Found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const stock = p.stockQuantity || 0;
                const threshold = p.lowStockThreshold || 5;

                let badge = null;
                if (stock <= 0) {
                  badge = (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                      OUT OF STOCK
                    </div>
                  );
                } else if (stock <= threshold) {
                  badge = (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                      LOW STOCK
                    </div>
                  );
                } else {
                  badge = (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      IN STOCK
                    </div>
                  );
                }

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all group/row"
                  >
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden relative bg-white dark:bg-white/5 shrink-0 flex items-center justify-center group-hover/row:scale-105 transition-transform duration-500">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          ) : (
                            <Package
                              size={24}
                              className="text-slate-400 dark:text-slate-700"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                            <span className="font-black text-[14px] text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">
                              {p.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest pl-3.5">
                            {p.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-mono font-black bg-slate-50/50 dark:bg-white/3 text-slate-500 dark:text-slate-400 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 uppercase tracking-tighter shadow-sm whitespace-nowrap">
                        {p.sku ||
                          `SK-PROD-${String(p.id).slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="font-black text-[15px] text-slate-900 dark:text-slate-100 tabular-nums tracking-tighter">
                          {stock}{" "}
                          <span className="text-[10px] text-slate-400 ml-1">
                            Stock
                          </span>
                        </span>
                        {badge}
                      </div>
                    </td>
                    <td className="px-10 py-5 text-right">
                      <button
                        onClick={() => onAdjustStock(p)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-purple-500 dark:hover:bg-white text-slate-600 dark:text-white hover:text-white dark:hover:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-white shadow-sm active:scale-95 group/btn"
                      >
                        <Edit2
                          size={14}
                          strokeWidth={2.5}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />{" "}
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 gap-6 transition-colors">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5 mx-2">
            <div className="h-2 w-24 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(page / totalPages) * 100}%` }}
              />
            </div>
          </div>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1 order-1 sm:order-2">
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
            Pages
          </span>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">
            {page}{" "}
            <span className="text-slate-300 dark:text-slate-700 mx-2">/</span>{" "}
            {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}
