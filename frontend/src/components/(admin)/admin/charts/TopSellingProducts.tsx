import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface TopSellingProductsProps {
  stats: DashboardStats;
}

const TopSellingProducts = ({ stats }: TopSellingProductsProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="font-bold text-slate-800 dark:text-white transition-colors mb-6">
        Highest Grossing Products
      </h3>
      <div className="space-y-4">
        {!stats.topProductsByRevenue || stats.topProductsByRevenue.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors italic">No sales data yet.</p>
        ) : (
          stats.topProductsByRevenue.map((p, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden relative shrink-0 group-hover:border-purple-200 dark:group-hover:border-purple-800 transition-colors">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <Package className="m-auto text-slate-300 w-full h-full p-3" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {p.quantity} {p.quantity === 1 ? "item" : "items"} sold
                  </p>
                </div>
              </div>
              <p className="text-sm font-black text-purple-600 shrink-0">
                ${p.revenue.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
