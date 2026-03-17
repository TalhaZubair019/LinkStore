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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300 transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Inventory Management
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and adjust stock levels across warehouses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100 dark:ring-purple-800/50">
            {products?.length || 0} Products
          </span>
        </div>
      </div>
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {paginatedProducts.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 italic">
            No products found.
          </div>
        ) : (
          paginatedProducts.map((p) => {
            const stock = p.stockQuantity || 0;
            const threshold = p.lowStockThreshold || 5;

            let statusBadge = null;
            if (stock <= 0) {
              statusBadge = (
                <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100 dark:border-red-900/50">
                  Out of Stock
                </span>
              );
            } else if (stock <= threshold) {
              statusBadge = (
                <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100 dark:border-amber-900/50">
                  Low Stock
                </span>
              );
            } else {
              statusBadge = (
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/50">
                  In Stock
                </span>
              );
            }

            return (
              <div
                key={p.id}
                className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative bg-white dark:bg-slate-800 shrink-0">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <Package className="w-full h-full p-4 text-slate-200 dark:text-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.category || "Uncategorized"}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      SKU:{" "}
                      {p.sku || `PROD-${String(p.id).slice(-6).toUpperCase()}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Stock Count
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {stock} units
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <button
                  onClick={() => onAdjustStock(p)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-800 transition-all shadow-sm"
                >
                  <Edit2 size={14} /> Adjust Inventory
                </button>
              </div>
            );
          })
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Product Info</th>
              <th className="px-8 py-4">SKU</th>
              <th className="px-8 py-4">Total Stock</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-10 text-center text-slate-500 dark:text-slate-400 italic"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const stock = p.stockQuantity || 0;
                const threshold = p.lowStockThreshold || 5;

                let badge = null;
                if (stock <= 0) {
                  badge = (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                      🔴 Out of Stock
                    </span>
                  );
                } else if (stock <= threshold) {
                  badge = (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                      🟡 Low Stock
                    </span>
                  );
                } else {
                  badge = (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                      🟢 In Stock
                    </span>
                  );
                }

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border dark:border-slate-800 overflow-hidden relative bg-white dark:bg-slate-800 shrink-0">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          ) : (
                            <Package className="w-full h-full p-3 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                            {p.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {p.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {p.sku || `PROD-${p.id}`}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {stock}
                        </span>
                        {badge}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => onAdjustStock(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 shadow-sm"
                      >
                        <Edit2 size={14} /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 transition-colors">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Previous
        </button>
        <span className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
