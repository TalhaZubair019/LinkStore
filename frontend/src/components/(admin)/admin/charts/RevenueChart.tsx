import React, { useRef, useEffect } from "react";

interface RevenueChartProps {
  filteredRevenueData: any[];
  showRevenueDropdown: boolean;
  setShowRevenueDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  revenueFilter: "week" | "month" | "current-month" | "custom";
  setRevenueFilter: React.Dispatch<
    React.SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyRevenueFilter: (
    filter: "week" | "month" | "current-month" | "custom",
    start?: string,
    end?: string,
  ) => void;
  customStart: string;
  setCustomStart: React.Dispatch<React.SetStateAction<string>>;
  customEnd: string;
  setCustomEnd: React.Dispatch<React.SetStateAction<string>>;
  revenueLoading: boolean;
}

const RevenueChart = ({
  filteredRevenueData,
  showRevenueDropdown,
  setShowRevenueDropdown,
  revenueFilter,
  setRevenueFilter,
  applyRevenueFilter,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  revenueLoading,
}: RevenueChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  useEffect(() => {
    if (filteredRevenueData.length <= 10 && chartContainerRef.current) {
      chartContainerRef.current.scrollLeft = 0;
    }
    setActiveIndex(null);
  }, [filteredRevenueData]);

  // Click away to clear active tooltip
  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (chartContainerRef.current && !chartContainerRef.current.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  return (
    <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Revenue Overview
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-300" />
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowRevenueDropdown((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            <span>
              {revenueFilter === "week"
                ? "Last 7 Days"
                : revenueFilter === "month"
                  ? "Last 30 Days"
                  : revenueFilter === "current-month"
                    ? "Current Month"
                    : "Custom Range"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showRevenueDropdown ? "rotate-180" : ""}`}
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
          {showRevenueDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setRevenueFilter("week");
                  setShowRevenueDropdown(false);
                  applyRevenueFilter("week");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${revenueFilter === "week" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📅</span> Last 7 Days
                {revenueFilter === "week" && (
                  <span className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setRevenueFilter("month");
                  setShowRevenueDropdown(false);
                  applyRevenueFilter("month");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${revenueFilter === "month" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">🗓️</span> Last 30 Days
                {revenueFilter === "month" && (
                  <span className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setRevenueFilter("current-month");
                  setShowRevenueDropdown(false);
                  applyRevenueFilter("current-month");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${revenueFilter === "current-month" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📅</span> Current Month
                {revenueFilter === "current-month" && (
                  <span className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </button>
              <div className="border-t border-slate-100 dark:border-slate-700" />
              <button
                onClick={() => {
                  setRevenueFilter("custom");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${revenueFilter === "custom" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <span className="text-base">📆</span> Custom Range
                {revenueFilter === "custom" && (
                  <span className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {revenueFilter === "custom" && (
        <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={customStart}
              max={customEnd || undefined}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            />
          </div>
          <button
            onClick={() => {
              if (customStart && customEnd) {
                applyRevenueFilter("custom", customStart, customEnd);
                setShowRevenueDropdown(false);
              }
            }}
            disabled={!customStart || !customEnd}
            className="mt-4 px-5 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Apply
          </button>
        </div>
      )}

      {revenueLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          className={`w-full ${filteredRevenueData.length > 10 ? "overflow-x-auto pb-6" : "overflow-hidden"}`}
        >
          <div
            className="flex items-end gap-1.5 h-48 pt-15"
            style={{
              minWidth:
                filteredRevenueData.length > 10
                  ? `${filteredRevenueData.length * 28}px`
                  : "100%",
            }}
          >
            {filteredRevenueData.map((d: any, i: number) => {
              const total = filteredRevenueData.length;
              const maxRev =
                Math.max(...filteredRevenueData.map((d: any) => d.revenue)) ||
                1;
              const height = `${(d.revenue / maxRev) * 100}%`;
              const isLong = total > 10;
              const step =
                total <= 7 ? 1 : total <= 14 ? 2 : total <= 21 ? 3 : 5;
              const showLabel = i % step === 0 || i === total - 1;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                  style={{
                    minWidth: isLong ? "28px" : undefined,
                  }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                >
                  <div className="w-full bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg relative flex items-end h-[85%] border-b border-slate-100 dark:border-slate-800">
                    <div
                      className={`w-full bg-linear-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all duration-300 ease-out group-hover:scale-x-105 group-hover:brightness-110 shadow-lg group-hover:shadow-purple-200/50 ${activeIndex === i ? "brightness-125 scale-x-105 shadow-purple-200/50" : ""}`}
                      style={{
                        height: height === "0%" ? "5%" : height,
                      }}
                    ></div>
                    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-30 ${activeIndex === i ? "opacity-100 -translate-y-1" : "opacity-0 group-hover:opacity-100 group-hover:-translate-y-1"}`}>
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-[10px] sm:text-xs py-2 px-3 rounded-xl font-bold whitespace-nowrap shadow-2xl border border-white/10 flex flex-col items-center gap-0.5">
                        <span className="text-slate-400 text-[10px] font-medium leading-none mb-0.5">
                          {new Date(d.date).toLocaleDateString(
                            undefined,
                            isLong
                              ? { month: "short", day: "numeric" }
                              : {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                },
                          )}
                        </span>
                        <span className="text-emerald-400 font-extrabold text-sm">
                          $
                          {d.revenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-white/10 rotate-45 -mt-1.5 mx-auto rounded-xs" />
                    </div>
                  </div>
                  {isLong ? (
                    <span
                      className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap origin-top-right"
                      style={{
                        transform: "rotate(-45deg)",
                        display: "block",
                        transformOrigin: "top center",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(d.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
