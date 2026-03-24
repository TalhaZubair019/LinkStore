"use client";

import React from "react";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: any[];
  customer?: {
    city?: string;
    country?: string;
  };
  trackingHistory?: { status: string; message: string; timestamp: string }[];
}

interface OrderTrackingTimelineProps {
  status: string;
  trackingHistory: { status: string; message: string; timestamp: string }[];
  order: Order;
}

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: "📦" },
  { key: "Accepted", label: "Order Accepted", icon: "✅" },
  { key: "Shipped", label: "Shipped", icon: "🚚" },
  { key: "Arrived in Country", label: "Arrived in Country", icon: "🌍" },
  { key: "Arrived in City", label: "Arrived in City", icon: "📍" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: "🏠" },
  { key: "Delivered", label: "Delivered", icon: "🎉" },
];

const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  status,
  trackingHistory,
  order,
}) => {
  const isCancelled = status === "Cancelled";

  const getStepLabel = (step: any) => {
    if (step.key === "Arrived in Country") {
      return `Arrived in ${order.customer?.country || "Country"}`;
    }
    if (step.key === "Arrived in City") {
      return `Arrived in ${order.customer?.city || "City"}`;
    }
    return step.label;
  };

  const steps = isCancelled
    ? [{ key: "Cancelled", label: "Order Cancelled", icon: "❌" }]
    : STATUS_STEPS;

  const completedKeys = new Set(trackingHistory.map((h) => h.status));
  const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  const formatDate = (ts: string) => {
    try {
      return new Date(ts).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 h-full transition-colors">
      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2 transition-colors">
        <span className="text-xl">📍</span> Tracking Status
      </h3>
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isCompleted =
            completedKeys.has(step.key) ||
            (currentStatusIdx !== -1 && idx < currentStatusIdx);
          const isCurrent = step.key === status;
          const isLast = idx === steps.length - 1;
          const historyEntry = trackingHistory.find(
            (h) => h.status === step.key,
          );
          const label = getStepLabel(step);

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border-2 transition-all ${
                    isCurrent
                      ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/40 ring-4 ring-purple-100 dark:ring-purple-900/20"
                      : isCompleted
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-white text-xs font-black">✓</span>
                  ) : (
                    <span
                      className={isCurrent ? "text-white" : "text-slate-300 dark:text-slate-600"}
                    >
                      {step.icon}
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 my-1 min-h-[32px] rounded-full transition-colors ${
                      isCompleted ? "bg-emerald-400 dark:bg-emerald-600" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />
                )}
              </div>
              <div className={`pb-6 ${isLast ? "pb-0" : ""} flex-1 pt-0.5`}>
                <p
                  className={`text-sm font-bold leading-tight transition-colors ${
                    isCurrent
                      ? "text-purple-700 dark:text-purple-400"
                      : isCompleted
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {label}
                  {isCurrent && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold transition-colors">
                      Current
                    </span>
                  )}
                </p>
                {historyEntry && (
                  <div className="mt-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                      {historyEntry.message}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">
                      {formatDate(historyEntry.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 font-medium transition-colors">
          Your order was cancelled. Contact support for help.
        </div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;
