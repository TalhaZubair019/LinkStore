import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface CategorySalesChartProps {
  stats: DashboardStats;
}

const CategorySalesChart = ({ stats }: CategorySalesChartProps) => {
  const data = stats.categorySalesData || [];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const colors = [
    "#a85df6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-[32px] shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <h3 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
          Sales by Category
        </h3>
        <div className="h-2 w-2 bg-purple-500 rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-8">
        <div className="relative w-56 h-56 shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90 transform group"
          >
            {data.map((item, i) => {
              const slicePercent = item.value / totalValue;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += slicePercent * circumference;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="15"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-700 ease-in-out hover:opacity-85 cursor-pointer origin-center"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 transition-colors">
              Total
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
        <div className="flex-1 w-full space-y-4">
          {data.slice(0, 6).map((item, i) => {
            const percentage = (item.value / totalValue) * 100;
            const categoryColor = colors[i % colors.length];
            return (
              <div key={i} className="flex flex-col gap-2 group">
                <div className="flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="text-[14px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.category || "General"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-black text-slate-900 dark:text-white tabular-nums">
                      ${item.value.toLocaleString()}
                    </span>
                    <div
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold min-w-[45px] text-center border"
                      style={{
                        backgroundColor: `${categoryColor}${i % 2 === 0 ? "10" : "20"}`,
                        borderColor: `${categoryColor}30`,
                        color: categoryColor,
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-700 mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: categoryColor,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 group hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-500 transition-colors">
            Top Seller
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 tabular-nums leading-none transition-colors">
              ${stats.categoryPerformance?.topSeller.value.toLocaleString()}
            </p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate transition-colors">
              {stats.categoryPerformance?.topSeller.label}
            </p>
          </div>
        </div>
        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">
            Most Popular
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 tabular-nums leading-none transition-colors">
              {stats.categoryPerformance?.mostPopular.value.toLocaleString()}
              <span className="text-[10px] ml-1 font-bold text-slate-400 dark:text-slate-500">
                units
              </span>
            </p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate transition-colors">
              {stats.categoryPerformance?.mostPopular.label}
            </p>
          </div>
        </div>
        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 group hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">
            Highest Value
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 tabular-nums leading-none transition-colors">
              $
              {Math.round(
                stats.categoryPerformance?.highestValue.value || 0,
              ).toLocaleString()}
            </p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate transition-colors">
              {stats.categoryPerformance?.highestValue.label} (AOV)
            </p>
          </div>
        </div>
        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">
            Best Fulfillment
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800 transition-colors">
              {stats.categoryPerformance?.bestFulfillment.value}%
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate transition-colors">
              {stats.categoryPerformance?.bestFulfillment.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySalesChart;
