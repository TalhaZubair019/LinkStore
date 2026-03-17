import React from "react";
import { Order, DashboardStats } from "@/app/admin/types";

interface OrderStatusChartProps {
  stats: DashboardStats;
}

const OrderStatusChart = ({ stats }: OrderStatusChartProps) => {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        Order Status Distribution
        <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-300" />
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          {(() => {
            const getCount = (status: string) =>
              stats.recentOrders.filter((o) => o.status === status).length;

            const data = [
              {
                label: "Pending",
                count: getCount("Pending"),
                color: "#fbbf24",
              },
              {
                label: "Accepted",
                count: getCount("Accepted"),
                color: "#3b82f6",
              },
              {
                label: "Shipped",
                count: getCount("Shipped"),
                color: "#6366f1",
              },
              {
                label: "Arrived in Country",
                count: getCount("Arrived in Country"),
                color: "#8b5cf6",
              },
              {
                label: "Arrived in City",
                count: getCount("Arrived in City"),
                color: "#ec4899",
              },
              {
                label: "Out for Delivery",
                count: getCount("Out for Delivery"),
                color: "#f97316",
              },
              {
                label: "Delivered",
                count: getCount("Delivered") || getCount("Completed"),
                color: "#10b981",
              },
              {
                label: "Cancelled",
                count: getCount("Cancelled"),
                color: "#ef4444",
              },
            ].filter((d) => d.count > 0);

            const total = data.reduce((acc, d) => acc + d.count, 0) || 1;
            const CIRC = 502.4;

            let currentOffset = 0;

            return (
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e2e8f0"
                  className="dark:stroke-slate-800"
                  strokeWidth="40"
                />
                {data.map((item, i) => {
                  const pRatio = (item.count / total) * CIRC;
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
                      strokeWidth="40"
                      strokeDasharray={`${pRatio} ${CIRC}`}
                      strokeDashoffset={`-${offset}`}
                    />
                  );
                })}
              </svg>
            );
          })()}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Total</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full text-[10px]">
          {[
            { label: "Pending", status: "Pending", color: "bg-amber-400" },
            { label: "Accepted", status: "Accepted", color: "bg-blue-500" },
            { label: "Shipped", status: "Shipped", color: "bg-indigo-500" },
            {
              label: "In Country",
              status: "Arrived in Country",
              color: "bg-violet-500",
            },
            {
              label: "In City",
              status: "Arrived in City",
              color: "bg-pink-500",
            },
            {
              label: "Out for Delivery",
              status: "Out for Delivery",
              color: "bg-orange-500",
            },
            {
              label: "Delivered",
              status: "Delivered",
              color: "bg-emerald-500",
            },
            { label: "Cancelled", status: "Cancelled", color: "bg-rose-500" },
          ].map((item, idx) => {
            const count =
              stats.recentOrders.filter((o) => o.status === item.status)
                .length +
              (item.status === "Delivered"
                ? stats.recentOrders.filter((o) => o.status === "Completed")
                    .length
                : 0);

            return (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {item.label} ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
