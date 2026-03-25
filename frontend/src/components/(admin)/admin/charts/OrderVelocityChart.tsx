import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface OrderVelocityChartProps {
  stats: DashboardStats;
}

const OrderVelocityChart = ({ stats }: OrderVelocityChartProps) => {
  const data = stats.orderVelocityData || [];
  const maxCount = Math.max(...data.map((d) => d.count)) || 1;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
        Order Velocity
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300" />
      </h3>

      <div className="overflow-x-auto pb-6 -mx-2">
        <div
          className="flex items-end gap-1.5 h-48 pt-15"
          style={{
            minWidth: data.length > 0 ? `${data.length * 28}px` : "100%",
          }}
        >
          {data.map((d, i) => {
            const height = `${(d.count / maxCount) * 100}%`;
            const showLabel = i % 4 === 0 || i === data.length - 1;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                style={{ minWidth: "28px" }}
              >
                <div className="w-full bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg relative flex items-end h-[85%] border-b border-slate-100 dark:border-slate-800">
                  <div
                    className="w-full bg-linear-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-300 ease-out group-hover:scale-x-105 group-hover:brightness-110 shadow-lg group-hover:shadow-blue-200/50"
                    style={{ height: d.count === 0 ? "5%" : height }}
                  />

                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 group-hover:-translate-y-1">
                    <div className="bg-slate-900/95 backdrop-blur-md text-white text-[10px] sm:text-xs py-2 px-3 rounded-xl font-bold whitespace-nowrap shadow-2xl border border-white/10 flex flex-col items-center gap-0.5">
                      <span className="text-slate-400 text-[10px] font-medium leading-none mb-0.5">
                        {d.hour}
                      </span>
                      <span className="text-blue-400 font-extrabold text-sm">
                        {d.count} {d.count === 1 ? "order" : "orders"}
                      </span>
                    </div>
                    <div className="w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-white/10 rotate-45 -mt-1.5 mx-auto rounded-xs" />
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {d.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors mt-4 text-center italic">
        Customer activity distribution throughout the day (24-hour format)
      </p>
    </div>
  );
};

export default OrderVelocityChart;
