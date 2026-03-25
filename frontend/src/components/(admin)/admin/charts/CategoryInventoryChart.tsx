import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface CategoryInventoryChartProps {
  stats: DashboardStats;
}

const CategoryInventoryChart = ({ stats }: CategoryInventoryChartProps) => {
  const data = stats.categoryInventoryData || [];
  const maxStock = Math.max(...data.map((d) => d.value)) || 1;
  const totalStock = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
      <h3 className="font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2 text-lg">
        Inventory by Category
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-300" />
      </h3>

      <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {data.length > 0 ? (
          data.slice(0, 8).map((item, i) => {
            const percentage = (item.value / maxStock) * 100;
            return (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-1.5 px-1">
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors truncate max-w-[70%]">
                    {item.category || "General"}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                </div>
                <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
                  <div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent shimmer-effect" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-3">
             <div className="text-4xl animate-bounce">📦</div>
             <p className="text-sm font-medium">No inventory data available</p>
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-1 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Storewide Stock
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
              {totalStock.toLocaleString()}
              <span className="text-xs ml-1 text-slate-400">units</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Top Category
            </span>
            <span className="text-lg font-black text-emerald-600 tabular-nums truncate max-w-[120px] text-right">
              {data[0]?.category}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryInventoryChart;
