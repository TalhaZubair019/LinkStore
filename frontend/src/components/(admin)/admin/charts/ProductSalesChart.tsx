import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import { ShoppingCart, LayoutGrid } from "lucide-react";

interface ProductSalesChartProps {
  stats: DashboardStats;
}

const ProductSalesChart = ({ stats }: ProductSalesChartProps) => {
  const topProducts = stats.topProductsByQuantity || [];
  const maxSales = Math.max(0, ...topProducts.map((p: any) => p.quantity || 0)) || 1;

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-cyan-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-600/5 dark:bg-cyan-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)] dark:shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Units Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse" />
          </h3>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full">
           <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <ShoppingCart size={10} className="text-cyan-600 dark:text-cyan-500" />
             Dispensation Data
           </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 relative z-10">
        {topProducts.length > 0 ? (
          topProducts.slice(0, 5).map((product: any, i: number) => {
            const percentage = (product.quantity / maxSales) * 100;
            return (
              <div key={i} className="space-y-2.5 group/item">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 flex items-center justify-center shrink-0 group-hover/item:border-cyan-400 dark:group-hover/item:border-cyan-500/30 transition-all duration-500">
                      <LayoutGrid size={12} className="text-slate-400 dark:text-slate-600 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-200 transition-colors uppercase tracking-tight truncate">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 tabular-nums">
                      {product.quantity}
                    </span>
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Units</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/2 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 relative group-hover/item:border-slate-300 dark:group-hover/item:border-white/10 transition-colors">
                  <div
                    className="h-full bg-linear-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.3)] dark:shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 gap-4">
             <div className="w-16 h-16 rounded-4xl bg-slate-50 dark:bg-white/2 flex items-center justify-center border border-slate-100 dark:border-white/5">
                <ShoppingCart size={24} className="text-slate-300 dark:text-slate-700 opacity-50" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Point Data Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSalesChart;
