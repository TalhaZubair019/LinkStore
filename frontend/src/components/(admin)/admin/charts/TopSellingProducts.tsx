import React from "react";
import Image from "next/image";
import { Package, TrendingUp, ShoppingCart } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface TopSellingProductsProps {
  stats: DashboardStats;
}

const TopSellingProducts = ({ stats }: TopSellingProductsProps) => {
  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-purple-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 dark:bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
          Highest Grossing
        </h3>
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        {!stats.topProductsByRevenue ||
        stats.topProductsByRevenue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10">
              <Package
                size={24}
                className="text-slate-300 dark:text-slate-700"
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              No Matrix Data
              <br />
              Detected
            </p>
          </div>
        ) : (
          stats.topProductsByRevenue.map((p, i) => (
            <div
              key={i}
              className="group/item flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-white/2 hover:bg-white dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-purple-200 dark:hover:border-white/10 rounded-2xl transition-all duration-500 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-white/10 overflow-hidden relative shrink-0 group-hover/item:border-purple-400 dark:group-hover/item:border-purple-500/50 transition-all duration-500 shadow-inner">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
                      unoptimized
                    />
                  ) : (
                    <Package className="m-auto text-slate-300 dark:text-slate-700 w-full h-full p-2.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 dark:text-slate-200 line-clamp-1 tracking-tight group-hover/item:text-purple-700 dark:group-hover/item:text-white transition-colors capitalize">
                    {p.name}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                    <ShoppingCart
                      size={8}
                      className="text-purple-600 dark:text-purple-500"
                    />
                    {p.quantity} {p.quantity === 1 ? "unit" : "units"} sold
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="bg-purple-100/80 dark:bg-purple-600/10 border border-purple-200/50 dark:border-purple-500/20 px-3 py-1 rounded-lg shadow-inner group-hover/item:bg-purple-600 group-hover/item:border-purple-400 transition-all duration-500">
                  <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 group-hover/item:text-white transition-colors tabular-nums">
                    $
                    {p.revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1 mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 translate-y-1 group-hover/item:translate-y-0">
                  <TrendingUp
                    size={8}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="text-[7px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-tighter">
                    Gross Growth
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
