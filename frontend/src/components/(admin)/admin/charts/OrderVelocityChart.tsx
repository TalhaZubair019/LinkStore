import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import { Activity, Clock } from "lucide-react";

interface OrderVelocityChartProps {
  stats: DashboardStats;
}

const OrderVelocityChart = ({ stats }: OrderVelocityChartProps) => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const data = stats.orderVelocityData || [];
  const maxCount = Math.max(0, ...data.map((d) => d.count)) || 1;

  React.useEffect(() => {
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
    <div className="bg-white dark:bg-[#0d0f14] pt-16 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-blue-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/5 dark:bg-blue-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Velocity Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
          </h3>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full">
          <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={10} className="text-blue-600 dark:text-blue-500" />
            24H Synchronization
          </p>
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className="overflow-x-auto pb-6 relative z-10 no-scrollbar"
      >
        <div
          className="flex items-end gap-2 h-48 pt-20"
          style={{
            minWidth: data.length > 0 ? `${data.length * 36}px` : "100%",
          }}
        >
          {data.map((d, i) => {
            const height = `${(d.count / maxCount) * 100}%`;
            const isActive = activeIndex === i;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end cursor-pointer relative"
                style={{ minWidth: "36px" }}
                onClick={() => setActiveIndex(isActive ? null : i)}
              >
                <div className="w-full relative flex items-end h-[85%]">
                  {/* Background Track */}
                  <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity duration-500" />

                  {/* Neon Bar */}
                  <div
                    className={`w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover/bar:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover/bar:brightness-125 ${isActive ? "brightness-125 ring-2 ring-blue-500/20 dark:ring-white/20" : ""}`}
                    style={{ height: d.count === 0 ? "4px" : height }}
                  />

                  {/* High-Fidelity Tooltip */}
                  {(isActive || activeIndex === null) && (
                    <div
                      className={`absolute -top-14 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-30 ${isActive ? "opacity-100 -translate-y-2 scale-110" : "opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-1"}`}
                    >
                      <div className="bg-white dark:bg-[#11141b]/95 backdrop-blur-2xl text-slate-900 dark:text-white py-2 px-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center gap-0.5 whitespace-nowrap">
                        <span className="text-slate-500 dark:text-slate-100 text-[10px] font-bold uppercase tracking-wider leading-none mb-1">
                          {d.hour} Matrix
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-black text-xs tabular-nums">
                          {d.count} UNITS
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white dark:bg-[#11141b] border-r border-b border-slate-200 dark:border-white/10 rotate-45 -mt-1 mx-auto" />
                    </div>
                  )}
                </div>

                <span
                  className={`text-[9px] font-bold transition-colors duration-500 uppercase tracking-tighter ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600 group-hover/bar:text-slate-900 dark:group-hover/bar:text-slate-400"}`}
                >
                  {d.hour.split(":")[0]}h
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderVelocityChart;
