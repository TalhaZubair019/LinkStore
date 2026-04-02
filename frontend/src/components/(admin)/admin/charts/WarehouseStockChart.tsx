import React, { useRef, useEffect } from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";
import { Box, Layers } from "lucide-react";

interface WarehouseStockChartProps {
  stats: DashboardStats;
}

const WarehouseStockChart = ({ stats }: WarehouseStockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const warehouses = stats.warehouses || [];
  const maxStock =
    Math.max(0, ...warehouses.map((w: any) => w.totalItemsInWarehouse || 0)) ||
    1;

  useEffect(() => {
    if (warehouses.length <= 6 && chartContainerRef.current) {
      chartContainerRef.current.scrollLeft = 0;
    }
  }, [warehouses]);

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
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-teal-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-teal-600/5 dark:bg-teal-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)] dark:shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Inventory Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-pulse" />
          </h3>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full">
          <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers size={10} className="text-teal-600 dark:text-teal-500" />
            Strategic Buffer Data
          </p>
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className={`w-full relative z-10 no-scrollbar ${warehouses.length > 6 ? "overflow-x-auto pb-6" : "overflow-hidden"}`}
      >
        <div
          className="flex items-end gap-3 h-52 pt-16"
          style={{
            minWidth:
              warehouses.length > 6 ? `${warehouses.length * 100}px` : "100%",
          }}
        >
          {warehouses.length > 0 ? (
            warehouses.map((wh: any, i: number) => {
              const height = `${((wh.totalItemsInWarehouse || 0) / maxStock) * 100}%`;
              const isActive = activeIndex === i;

              return (
                <div
                  key={wh.id || i}
                  className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end cursor-pointer relative"
                  style={{
                    minWidth: warehouses.length > 6 ? "80px" : undefined,
                  }}
                  onClick={() => setActiveIndex(isActive ? null : i)}
                >
                  <div className="w-full relative flex items-end h-[85%]">
                    {/* Background Track */}
                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity duration-500" />

                    {/* Neon Bar */}
                    <div
                      className={`w-full bg-linear-to-t from-teal-600 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(20,184,166,0.1)] dark:shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover/bar:shadow-[0_0_20px_rgba(20,184,166,0.4)] group-hover/bar:brightness-125 ${isActive ? "brightness-125 ring-2 ring-teal-500/20 dark:ring-white/20" : ""}`}
                      style={{ height: height === "0%" ? "4px" : height }}
                    />

                    {/* Tooltip */}
                    {(isActive || activeIndex === null) && (
                      <div
                        className={`absolute -top-14 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-30 ${isActive ? "opacity-100 -translate-y-2 scale-110" : "opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-1"}`}
                      >
                        <div className="bg-white dark:bg-[#11141b]/95 backdrop-blur-2xl text-slate-900 dark:text-white py-2 px-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center gap-0.5 whitespace-nowrap">
                          <span className="text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-widest leading-none mb-1">
                            {wh.warehouseName}
                          </span>
                          <span className="text-teal-600 dark:text-teal-400 font-black text-xs tabular-nums">
                            {wh.totalItemsInWarehouse?.toLocaleString() || 0}{" "}
                            UNITS
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-white dark:bg-[#11141b] border-r border-b border-slate-200 dark:border-white/10 rotate-45 -mt-1 mx-auto" />
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-black transition-colors duration-500 uppercase tracking-tighter truncate w-full text-center px-1 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400 dark:text-slate-600 group-hover/bar:text-slate-900 dark:group-hover/bar:text-slate-400 uppercase"}`}
                  >
                    {wh.warehouseName}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 gap-4">
              <div className="w-16 h-16 rounded-4xl bg-slate-50 dark:bg-white/2 flex items-center justify-center border border-slate-100 dark:border-white/5">
                <Box size={24} className="text-slate-300 dark:text-slate-700 opacity-50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                Zero Assets Detected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseStockChart;
