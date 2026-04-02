import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import { Package, ChevronRight } from "lucide-react";

interface OrderStatusChartProps {
  stats: DashboardStats;
}

const OrderStatusChart = ({ stats }: OrderStatusChartProps) => {
  const getCount = (status: string) => {
    if (stats.statusCounts && stats.statusCounts[status] !== undefined) {
      return stats.statusCounts[status];
    }
    return stats.recentOrders.filter((o) => o.status === status).length;
  };

  const statusData = [
    {
      label: "Pending",
      status: "Pending",
      color: "#fbbf24",
      ring: "stroke-amber-400",
    },
    {
      label: "Accepted",
      status: "Accepted",
      color: "#3b82f6",
      ring: "stroke-blue-500",
    },
    {
      label: "Shipped",
      status: "Shipped",
      color: "#6366f1",
      ring: "stroke-indigo-500",
    },
    {
      label: "Arrived in Country",
      status: "Arrived in Country",
      color: "#8b5cf6",
      ring: "stroke-purple-500",
    },
    {
      label: "Arrived in City",
      status: "Arrived in City",
      color: "#ec4899",
      ring: "stroke-pink-500",
    },
    {
      label: "Out for Delivery",
      status: "Out for Delivery",
      color: "#f97316",
      ring: "stroke-orange-500",
    },
    {
      label: "Delivered",
      status: "Delivered",
      color: "#10b981",
      ring: "stroke-emerald-500",
    },
    {
      label: "Cancelled",
      status: "Cancelled",
      color: "#ef4444",
      ring: "stroke-rose-500",
    },
  ];

  const activeData = statusData.filter((d) => getCount(d.status) > 0);
  const total = activeData.reduce((acc, d) => acc + getCount(d.status), 0) || 1;
  const CIRC = 502.4;
  let currentOffset = 0;

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-purple-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/5 dark:bg-purple-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
          Order Status Distribution
          <span className="ml-3 inline-block w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse" />
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative w-48 h-48 mb-10 translate-y-2">
          {/* Background Track */}
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-white/2"
              strokeWidth="28"
            />
            {activeData.map((item, i) => {
              const count = getCount(item.status);
              const pRatio = (count / total) * CIRC;
              const offset = currentOffset;
              currentOffset += pRatio;
              return (
                <circle
                  key={i}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="28"
                  strokeDasharray={`${pRatio} ${CIRC}`}
                  strokeDashoffset={`-${offset}`}
                  className="transition-all duration-1000 ease-out hover:brightness-125"
                  style={{ strokeLinecap: "butt" }}
                />
              );
            })}
          </svg>

          {/* Central System Signal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center group-hover:scale-110 transition-transform duration-700">
              <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-2xl animate-pulse" />
              <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter tabular-nums relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {stats.totalOrders}
              </p>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 relative z-10">
                Total Units
              </p>
            </div>
          </div>
        </div>

        {/* High-Fidelity Status Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {statusData.map((item, idx) => {
            const count =
              getCount(item.status) +
              (item.status === "Delivered" ? getCount("Completed") : 0);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-500 ${count > 0 ? "bg-slate-50 dark:bg-white/2 border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5" : "opacity-20 bg-transparent border-transparent grayscale"}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px]`}
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 tabular-nums">
                    {count}
                  </span>
                  {count > 0 && (
                    <ChevronRight
                      size={10}
                      className="text-slate-300 dark:text-slate-600"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
