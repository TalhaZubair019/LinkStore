import React, { useRef, useEffect } from "react";
import { TrendingUp, Calendar, ChevronDown } from "lucide-react";

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

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (
        chartContainerRef.current &&
        !chartContainerRef.current.contains(e.target as Node)
      ) {
        setActiveIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative group transition-all duration-700 hover:shadow-purple-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl">
      {/* Ambient Depth Glows - Wrapped for clipping */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-600/5 dark:bg-cyan-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <div
        className={`flex items-center justify-between mb-8 flex-wrap gap-4 relative ${showRevenueDropdown ? "z-60" : "z-20"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Revenue Overview
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          </h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowRevenueDropdown((v) => !v)}
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all shadow-inner backdrop-blur-md"
          >
            <Calendar
              size={14}
              className="text-purple-600 dark:text-purple-500"
            />
            <span>
              {revenueFilter === "week"
                ? "Last 7 Days"
                : revenueFilter === "month"
                  ? "Last 30 Days"
                  : revenueFilter === "current-month"
                    ? "Current Month"
                    : "Custom Range"}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 ${showRevenueDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showRevenueDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#11141b]/95 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-2xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 space-y-1">
                {[
                  { id: "week", label: "Last 7 Days", icon: "📅" },
                  { id: "month", label: "Last 30 Days", icon: "🗓️" },
                  { id: "current-month", label: "Current Month", icon: "📊" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setRevenueFilter(item.id as any);
                      setShowRevenueDropdown(false);
                      applyRevenueFilter(item.id as any);
                    }}
                    className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-3 ${revenueFilter === item.id ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"}`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                    {revenueFilter === item.id && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </button>
                ))}
                <div className="h-px bg-slate-100 dark:bg-white/5 mx-2 my-2" />
                <button
                  onClick={() => setRevenueFilter("custom")}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-3 ${revenueFilter === "custom" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"}`}
                >
                  <span>📆</span> Custom Range
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {revenueFilter === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-md relative z-10 animate-in zoom-in-95 duration-300">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
              Start Matrix
            </label>
            <input
              type="date"
              value={customStart}
              max={customEnd || undefined}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-widest text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
              End Matrix
            </label>
            <input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-widest text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                if (customStart && customEnd) {
                  applyRevenueFilter("custom", customStart, customEnd);
                  setShowRevenueDropdown(false);
                }
              }}
              disabled={!customStart || !customEnd}
              className="w-full px-6 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-purple-900/40 border border-white/20 active:scale-95"
            >
              Sync Matrix
            </button>
          </div>
        </div>
      )}

      {revenueLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin shadow-[0_0_15px_rgba(168,85,247,0.3)] dark:shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
            Querying Data...
          </p>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          className="w-full relative z-30 overflow-x-auto overflow-y-hidden pb-6 pt-24 no-scrollbar scrollbar-none"
        >
          <div className="absolute top-0 inset-x-0 h-72 bg-linear-to-b from-purple-600/5 to-transparent pointer-events-none" />
          <div
            className="flex items-end gap-2 h-48 pt-10 px-4"
            style={{
              minWidth:
                filteredRevenueData.length > 7
                  ? `${filteredRevenueData.length * 45}px`
                  : "500px", // Force scroll on small mobile for even 7 days
            }}
          >
            {filteredRevenueData.map((d: any, i: number) => {
              const maxRev =
                Math.max(...filteredRevenueData.map((d: any) => d.revenue)) ||
                1;
              const height = `${(d.revenue / maxRev) * 100}%`;
              const isLong = filteredRevenueData.length > 10;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end cursor-pointer relative"
                  style={{ minWidth: isLong ? "30px" : "40px" }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                >
                  <div className="w-full max-w-[14px] relative flex items-end h-[85%]">
                    {/* Background Track */}
                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity duration-500" />

                    <div
                      className={`w-full bg-linear-to-t from-purple-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 ease-out group-hover/bar:brightness-125 shadow-[0_0_20px_rgba(168,85,247,0.1)] dark:shadow-[0_0_20px_rgba(168,85,247,0.2)] overflow-hidden ${activeIndex === i ? "brightness-150 scale-x-105 shadow-purple-500/40" : ""}`}
                      style={{ height: d.revenue === 0 ? "6px" : height }}
                    >
                      {/* Premium Specular Highlight */}
                      <div className="absolute top-1.5 inset-x-1 h-1 bg-white/30 blur-[1px] rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                    </div>
                    <div
                      className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none z-30 ${activeIndex === i ? "opacity-100 -translate-y-2" : "opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-2"}`}
                    >
                      <div className="bg-white dark:bg-[#11141b]/95 backdrop-blur-xl text-slate-900 dark:text-white py-2.5 px-4 rounded-[1.2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 flex flex-col items-center gap-1 group/tooltip">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-100 group-hover/tooltip:text-purple-600 dark:group-hover/tooltip:text-purple-400 transition-colors">
                          {new Date(d.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp
                            size={10}
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm tabular-nums">
                            $
                            {d.revenue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-white dark:bg-[#11141b]/95 border-r border-b border-slate-200 dark:border-white/10 rotate-45 -mt-1.5 mx-auto rounded-sm" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-3 group/label">
                    {!isLong ||
                    i % 5 === 0 ||
                    i === filteredRevenueData.length - 1 ? (
                      <span
                        className={`font-black uppercase transition-all duration-300 ${isLong ? "text-[10px] tabular-nums" : "text-[9px] tracking-widest"} ${activeIndex === i ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500 group-hover/bar:text-slate-900 dark:group-hover/bar:text-slate-200"}`}
                      >
                        {!isLong
                          ? new Date(d.date).toLocaleDateString(undefined, {
                              weekday: "short",
                            })
                          : `${new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(d.date).getDate()}`}
                      </span>
                    ) : (
                      <div className="h-4" /> // Placeholder
                    )}
                  </div>
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
