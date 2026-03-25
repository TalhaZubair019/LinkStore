import React, { useRef, useEffect } from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface AverageOrderValueChartProps {
  stats: DashboardStats;
  filteredAovData: any[];
  showAovDropdown: boolean;
  setShowAovDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  aovFilter: "week" | "month" | "current-month" | "custom";
  setAovFilter: React.Dispatch<
    React.SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyAovFilter: (
    filter: "week" | "month" | "current-month" | "custom",
    start?: string,
    end?: string,
  ) => void;
  aovCustomStart: string;
  setAovCustomStart: React.Dispatch<React.SetStateAction<string>>;
  aovCustomEnd: string;
  setAovCustomEnd: React.Dispatch<React.SetStateAction<string>>;
  aovLoading: boolean;
}

const AverageOrderValueChart = ({
  stats,
  filteredAovData,
  showAovDropdown,
  setShowAovDropdown,
  aovFilter,
  setAovFilter,
  applyAovFilter,
  aovCustomStart,
  setAovCustomStart,
  aovCustomEnd,
  setAovCustomEnd,
  aovLoading,
}: AverageOrderValueChartProps) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<any | null>(null);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <div className="flex items-start justify-between mb-6 gap-3">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Average Order Value Trend
          <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-300" />
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowAovDropdown((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            <span>
              {aovFilter === "week"
                ? "Last 7 Days"
                : aovFilter === "month"
                  ? "Last 30 Days"
                  : aovFilter === "current-month"
                    ? "Current Month"
                    : "Custom Range"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showAovDropdown ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showAovDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setAovFilter("week");
                  setShowAovDropdown(false);
                  applyAovFilter("week");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${aovFilter === "week" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📅</span> Last 7 Days
                {aovFilter === "week" && (
                  <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setAovFilter("month");
                  setShowAovDropdown(false);
                  applyAovFilter("month");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${aovFilter === "month" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">🗓️</span> Last 30 Days
                {aovFilter === "month" && (
                  <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setAovFilter("current-month");
                  setShowAovDropdown(false);
                  applyAovFilter("current-month");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${aovFilter === "current-month" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📅</span> Current Month
                {aovFilter === "current-month" && (
                  <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
              <div className="border-t border-slate-100 dark:border-slate-700" />
              <button
                onClick={() => {
                  setAovFilter("custom");
                  setShowAovDropdown(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${aovFilter === "custom" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📆</span> Custom Range
                {aovFilter === "custom" && (
                  <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {aovFilter === "custom" && (
        <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={aovCustomStart}
              max={aovCustomEnd || undefined}
              onChange={(e) => setAovCustomStart(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={aovCustomEnd}
              min={aovCustomStart || undefined}
              onChange={(e) => setAovCustomEnd(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            />
          </div>
          <button
            onClick={() => {
              if (aovCustomStart && aovCustomEnd) {
                applyAovFilter("custom", aovCustomStart, aovCustomEnd);
                setShowAovDropdown(false);
              }
            }}
            disabled={!aovCustomStart || !aovCustomEnd}
            className="mt-4 px-5 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Apply
          </button>
        </div>
      )}

      {aovLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col justify-between">
          <div className="relative h-48 w-full">
            <div
              className="w-full h-full relative"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 300 150"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="aovGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#f59e0b"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>
                {(() => {
                  if (!filteredAovData) return null;
                  const aovData = filteredAovData.map((d: any) => {
                    const ordersOnDay =
                      stats.recentOrders.filter(
                        (o: any) =>
                          new Date(o.date).toDateString() ===
                          new Date(d.date).toDateString(),
                      ).length || 1;
                    return {
                      value: d.revenue / ordersOnDay,
                      date: d.date,
                    };
                  });
                  const maxAOV =
                    Math.max(0, ...aovData.map((d) => d.value)) || 100;
                  if (aovData.length === 0) return null;
                  const points = aovData
                    .map((d, i) => {
                      const x = (i / (aovData.length - 1)) * 300;
                      const y = 150 - (d.value / maxAOV) * 140;
                      return `${x},${y}`;
                    })
                    .join(" ");
                  const areaPoints = `0,150 ${points} 300,150`;
                  return (
                    <>
                      <polyline
                        points={areaPoints}
                        fill="url(#aovGradient)"
                        stroke="none"
                      />
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-lg"
                      />
                      {aovData.map((d, i) => {
                        const x = (i / (aovData.length - 1)) * 300;
                        const y = 150 - (d.value / maxAOV) * 140;
                        return (
                          <g
                            key={i}
                            onMouseEnter={() => setHoveredPoint({ ...d, x, y })}
                            className="cursor-pointer"
                          >
                            {hoveredPoint && hoveredPoint.date === d.date && (
                              <line
                                x1={x}
                                y1={0}
                                x2={x}
                                y2={150}
                                stroke="#f59e0b"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                opacity="0.5"
                              />
                            )}
                            <circle
                              cx={x}
                              cy={y}
                              r={
                                hoveredPoint && hoveredPoint.date === d.date
                                  ? "6"
                                  : "4"
                              }
                              fill="#f59e0b"
                              className="transition-all duration-300"
                            />
                            <circle cx={x} cy={y} r="12" fill="transparent" />
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
              {hoveredPoint && (
                <div
                  className="absolute z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs py-2 px-3 rounded-xl font-bold whitespace-nowrap shadow-2xl border border-white/10 flex flex-col items-center gap-0.5 pointer-events-none transform -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    left: `${(hoveredPoint.x / 300) * 100}%`,
                    top: `calc(${hoveredPoint.y}px - 10px)`,
                  }}
                >
                  <span className="text-slate-400 text-[10px] font-medium leading-none mb-0.5">
                    {new Date(hoveredPoint.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-amber-400 font-extrabold text-sm">
                    $
                    {hoveredPoint.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-r border-b border-white/10 rotate-45" />
                </div>
              )}
            </div>
          </div>
          <div
            className="grid gap-1 mt-4"
            style={{
              gridTemplateColumns: `repeat(${filteredAovData?.length || 1}, minmax(0, 1fr))`,
            }}
          >
            {filteredAovData?.map((d: any, i: number) => {
              const total = filteredAovData.length;
              const step =
                total <= 7 ? 1 : total <= 14 ? 2 : total <= 21 ? 3 : 5;
              const showLabel = i % step === 0 || i === total - 1;
              return (
                <div key={i} className="text-center">
                  {showLabel && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      {total > 10
                        ? new Date(d.date).toLocaleDateString(undefined, {
                            day: "numeric",
                          })
                        : new Date(d.date).toLocaleDateString(undefined, {
                            weekday: "short",
                          })[0]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Min AOV</p>
              <p className="text-sm font-bold text-amber-600">
                $
                {!filteredAovData || filteredAovData.length === 0
                  ? "0.00"
                  : Math.min(
                      ...filteredAovData.map((d: any) => {
                        const orders =
                          stats.recentOrders.filter(
                            (o: any) =>
                              new Date(o.date).toDateString() ===
                              new Date(d.date).toDateString(),
                          ).length || 1;
                        return d.revenue / orders;
                      }),
                    ).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg AOV</p>
              <p className="text-sm font-bold text-amber-600">
                $
                {!filteredAovData || filteredAovData.length === 0
                  ? "0.00"
                  : (
                      filteredAovData.reduce((acc, d) => acc + d.revenue, 0) /
                      (filteredAovData.reduce((acc, d) => {
                        const ordersForDay = stats.recentOrders.filter(
                          (o: any) =>
                            new Date(o.date).toDateString() ===
                            new Date(d.date).toDateString(),
                        ).length;
                        return acc + (ordersForDay > 0 ? ordersForDay : 1);
                      }, 0) || 1)
                    ).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Max AOV</p>
              <p className="text-sm font-bold text-amber-600">
                $
                {!filteredAovData || filteredAovData.length === 0
                  ? "0.00"
                  : Math.max(
                      ...filteredAovData.map((d: any) => {
                        const orders =
                          stats.recentOrders.filter(
                            (o: any) =>
                              new Date(o.date).toDateString() ===
                              new Date(d.date).toDateString(),
                          ).length || 1;
                        return d.revenue / orders;
                      }),
                    ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageOrderValueChart;
