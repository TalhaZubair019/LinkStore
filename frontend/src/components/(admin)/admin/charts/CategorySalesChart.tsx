import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import {
  PieChart,
  TrendingUp,
  Users,
  Activity,
  ShieldCheck,
} from "lucide-react";

interface CategorySalesChartProps {
  stats: DashboardStats;
}

const CategorySalesChart = ({ stats }: CategorySalesChartProps) => {
  const data = stats.categorySalesData || [];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const colors = [
    "#a85df6", // Purple
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#fbbf24", // Amber
    "#f97316", // Orange
    "#6366f1", // Indigo
  ];

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-purple-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/5 dark:bg-indigo-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
          Category Distribution
          <span className="ml-3 inline-block w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-12 mb-6 sm:mb-12 relative z-10">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 shrink-0 lg:translate-x-4">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
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
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out hover:brightness-125 cursor-pointer"
                  style={{ strokeLinecap: "butt" }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="text-[7px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-0.5 sm:mb-1 relative z-10">
              Total
            </span>
            <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tabular-nums">
              $
              {totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4 max-h-[160px] sm:max-h-none overflow-y-auto pr-2 no-scrollbar">
          {data.slice(0, 7).map((item, i) => {
            const percentage = (item.value / totalValue) * 100;
            const color = colors[i % colors.length];
            return (
              <div key={i} className="space-y-2 group/bar cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px]"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}`,
                      }}
                    />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover/bar:text-slate-900 dark:group-hover/bar:text-slate-200 transition-colors truncate">
                      {item.category || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 tabular-nums">
                      ${item.value.toLocaleString()}
                    </span>
                    <div
                      className="px-2 py-0.5 rounded-lg text-[8px] font-black border tabular-nums"
                      style={{
                        backgroundColor: `${color}10`,
                        borderColor: `${color}30`,
                        color: color,
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/2 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px]"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}40`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto relative z-10">
        {[
          {
            label: "Top Seller",
            value: stats.categoryPerformance?.topSeller.value,
            sub: stats.categoryPerformance?.topSeller.label,
            icon: <PieChart size={14} />,
            color: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Most Popular",
            value: stats.categoryPerformance?.mostPopular.value,
            sub: stats.categoryPerformance?.mostPopular.label,
            icon: <Users size={14} />,
            color: "text-blue-600 dark:text-blue-400",
            suffix: " units",
          },
          {
            label: "Highest AOV",
            value: stats.categoryPerformance?.highestValue.value,
            sub: stats.categoryPerformance?.highestValue.label,
            icon: <TrendingUp size={14} />,
            color: "text-amber-600 dark:text-amber-400",
            isCurrency: true,
          },
          {
            label: "Fulfillment",
            value: stats.categoryPerformance?.bestFulfillment.value,
            sub: stats.categoryPerformance?.bestFulfillment.label,
            icon: <ShieldCheck size={14} />,
            color: "text-emerald-600 dark:text-emerald-400",
            suffix: "%",
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-white/2 p-4 rounded-2xl border border-slate-100 dark:border-white/5 group/card hover:bg-white dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all duration-500 active:scale-[0.98] hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`${m.color} opacity-40 group-hover/card:opacity-100 transition-opacity`}
              >
                {m.icon}
              </div>
              <p
                className={`text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover/card:${m.color} transition-colors uppercase`}
              >
                {m.label}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black text-slate-900 dark:text-slate-200 tabular-nums">
                {m.isCurrency ? "$" : ""}
                {Math.round(m.value || 0).toLocaleString()}
                {m.suffix}
              </p>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter truncate opacity-60">
                {m.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySalesChart;
