import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import { Calendar, ChevronDown, Activity } from "lucide-react";

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
  const [activePoint, setActivePoint] = React.useState<any | null>(null);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (
        chartContainerRef.current &&
        !chartContainerRef.current.contains(e.target as Node)
      ) {
        setActivePoint(null);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  const aovData = filteredAovData
    ? filteredAovData.map((d: any) => {
        if (d.aov !== undefined) return { value: d.aov, date: d.date };
        const orders =
          stats.recentOrders.filter(
            (o: any) =>
              new Date(o.date).toDateString() ===
              new Date(d.date).toDateString(),
          ).length || 1;
        return { value: d.revenue / orders, date: d.date };
      })
    : [];

  const maxVal = Math.max(0, ...aovData.map((d) => d.value)) || 100;
  const minVal =
    aovData.length > 0 ? Math.min(...aovData.map((d) => d.value)) : 0;
  const avgVal =
    aovData.length > 0
      ? aovData.reduce((acc, d) => acc + d.value, 0) / aovData.length
      : 0;

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative group transition-all duration-700 hover:shadow-amber-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow - Wrapped for clipping */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-600/5 dark:bg-amber-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-30 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] dark:shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            AOV Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
          </h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAovDropdown((v) => !v)}
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all shadow-inner backdrop-blur-md"
          >
            <Calendar
              size={14}
              className="text-amber-600 dark:text-amber-500"
            />
            <span>
              {aovFilter === "week"
                ? "Last 7 Days"
                : aovFilter === "month"
                  ? "Last 30 Days"
                  : aovFilter === "current-month"
                    ? "Current Month"
                    : "Custom Range"}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 ${showAovDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showAovDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#11141b]/95 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-2xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 space-y-1">
                {["week", "month", "current-month"].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setAovFilter(id as any);
                      setShowAovDropdown(false);
                      applyAovFilter(id as any);
                    }}
                    className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-3 ${aovFilter === id ? "bg-amber-500 text-white dark:text-[#0d0f14] shadow-lg shadow-amber-900/40" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"}`}
                  >
                    {aovFilter === id && <Activity size={12} />}
                    {id.replace("-", " ")}
                  </button>
                ))}
                <div className="h-px bg-slate-100 dark:bg-white/5 mx-2 my-2" />
                <button
                  onClick={() => {
                    setAovFilter("custom");
                    setShowAovDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-3 ${aovFilter === "custom" ? "bg-amber-500 text-white dark:text-[#0d0f14]" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"}`}
                >
                  Custom Range
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {aovFilter === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 relative z-10 animate-in zoom-in-95 duration-300">
          {[
            {
              label: "Start",
              value: aovCustomStart,
              setter: setAovCustomStart,
            },
            { label: "End", value: aovCustomEnd, setter: setAovCustomEnd },
          ].map((field, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                {field.label} Phase
              </label>
              <input
                type="date"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-widest text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
              />
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={() => {
                if (aovCustomStart && aovCustomEnd)
                  applyAovFilter("custom", aovCustomStart, aovCustomEnd);
              }}
              className="w-full px-6 py-2.5 bg-amber-600 text-white dark:text-[#0d0f14] text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/40 border border-white/20 active:scale-95"
            >
              Sync Matrix
            </button>
          </div>
        </div>
      )}

      {aovLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shadow-[0_0_15px_rgba(245,158,11,0.3)] dark:shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
            Calibrating Trend...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="relative h-48 w-full">
            <div
              ref={chartContainerRef}
              className="w-full h-full relative"
              onMouseLeave={() => setActivePoint(null)}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 300 150"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="aovNeon"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {aovData.length > 1 && (
                  <>
                    <polyline
                      points={`0,150 ${aovData.map((d, i) => `${(i / (aovData.length - 1)) * 300},${150 - (d.value / maxVal) * 120}`).join(" ")} 300,150`}
                      fill="url(#aovNeon)"
                      stroke="none"
                      className="transition-all duration-1000"
                    />
                    <polyline
                      points={aovData
                        .map(
                          (d, i) =>
                            `${(i / (aovData.length - 1)) * 300},${150 - (d.value / maxVal) * 120}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] dark:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-1000"
                    />
                    {aovData.map((d, i) => {
                      const x = (i / (aovData.length - 1)) * 300;
                      const y = 150 - (d.value / maxVal) * 120;
                      return (
                        <g
                          key={i}
                          onMouseEnter={() => setActivePoint({ ...d, x, y })}
                          className="cursor-pointer"
                        >
                          {activePoint?.date === d.date && (
                            <line
                              x1={x}
                              y1={0}
                              x2={x}
                              y2={150}
                              stroke="#f59e0b"
                              strokeWidth="0.5"
                              strokeDasharray="4 4"
                              opacity="0.3"
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="#f59e0b"
                            className={`transition-all duration-300 ${activePoint?.date === d.date ? "r-7 brightness-125" : "brightness-90 group-hover:brightness-110"}`}
                          />
                          <circle cx={x} cy={y} r="15" fill="transparent" />
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>

              {activePoint && (
                <div
                  className="absolute z-50 bg-white dark:bg-[#11141b]/95 backdrop-blur-xl text-slate-900 dark:text-white py-2 px-3 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center gap-0.5 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    left: `${(activePoint.x / 300) * 100}%`,
                    top: `${activePoint.y}px`,
                  }}
                >
                  <span className="text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-widest">
                    {new Date(activePoint.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-black text-xs tabular-nums">
                    $
                    {activePoint.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#11141b] border-r border-b border-slate-200 dark:border-white/10 rotate-45" />
                </div>
              )}
            </div>
          </div>

          {/* X-Axis Matrix Labels */}
          <div className="mt-4 flex justify-between relative z-10 px-[2px]">
            {aovData.map((d: any, i: number) => {
              const isLargeDataset = aovData.length > 10;
              const shouldShow =
                !isLargeDataset || i % 5 === 0 || i === aovData.length - 1;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-0"
                  style={{ width: `${100 / aovData.length}%` }}
                >
                  {shouldShow ? (
                    <>
                      <div className="w-px h-1 bg-slate-200 dark:bg-white/10 mb-3" />
                      {!isLargeDataset ? (
                        <>
                          <p className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                            {new Date(d.date).toLocaleDateString(undefined, {
                              weekday: "short",
                            })}
                          </p>
                          <p className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mt-1">
                            {new Date(d.date).getDate()}/
                            {new Date(d.date).getMonth() + 1}
                          </p>
                        </>
                      ) : (
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 tabular-nums">
                          {new Date(d.date).getDate()}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="h-6" /> // Placeholder to maintain spacing
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              {
                label: "Floor Matrix",
                value: minVal,
                color: "text-amber-500/60",
              },
              {
                label: "Optimal Logic",
                value: avgVal,
                color: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Peak Matrix",
                value: maxVal,
                color: "text-amber-700 dark:text-amber-300",
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 group/metric transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5"
              >
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 group-hover/metric:text-amber-500/50 transition-colors">
                  {m.label}
                </p>
                <p
                  className={`text-sm font-black tabular-nums transition-all ${m.color} group-hover/metric:scale-105 origin-left`}
                >
                  $
                  {m.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageOrderValueChart;
