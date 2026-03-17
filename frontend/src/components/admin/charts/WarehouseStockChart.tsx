import React, { useRef, useEffect } from "react";
import { DashboardStats } from "@/app/admin/types";

interface WarehouseStockChartProps {
  stats: DashboardStats;
}

const WarehouseStockChart = ({ stats }: WarehouseStockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const warehouses = stats.warehouses || [];

  useEffect(() => {
    if (warehouses.length <= 6 && chartContainerRef.current) {
      chartContainerRef.current.scrollLeft = 0;
    }
  }, [warehouses]);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        Warehouse Stock Distribution
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300" />
      </h3>

      <div
        ref={chartContainerRef}
        className={`w-full ${warehouses.length > 6 ? "overflow-x-auto pb-6" : "overflow-hidden"}`}
      >
        <div
          className="flex items-end gap-4 h-52 pt-16"
          style={{
            minWidth:
              warehouses.length > 6 ? `${warehouses.length * 100}px` : "100%",
          }}
        >
          {warehouses.length > 0 ? (
            warehouses.map((wh: any, i: number) => {
              const maxStock =
                Math.max(
                  ...warehouses.map((w: any) => w.totalItemsInWarehouse || 0),
                ) || 1;
              const height = `${((wh.totalItemsInWarehouse || 0) / maxStock) * 100}%`;
              const isLong = warehouses.length > 6;

              return (
                <div
                  key={wh.id || i}
                  className="flex-1 flex flex-col items-center gap-3 group h-full justify-end"
                  style={{ minWidth: isLong ? "80px" : undefined }}
                >
                  <div className="w-full bg-slate-50/50 dark:bg-slate-800/50 rounded-t-xl relative flex items-end h-[85%] border-b border-slate-100 dark:border-slate-800 overflow-visible">
                    <div
                      className="w-full bg-linear-to-t from-blue-600 to-teal-400 rounded-t-xl transition-all duration-500 ease-out group-hover:scale-x-105 group-hover:brightness-110 shadow-lg group-hover:shadow-blue-200/50"
                      style={{
                        height: height === "0%" ? "4px" : height,
                      }}
                    />

                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 group-hover:-translate-y-1">
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-[10px] sm:text-xs py-2 px-3 rounded-xl font-bold whitespace-nowrap shadow-2xl border border-white/10 flex flex-col items-center gap-0.5">
                        <span className="text-slate-400 text-[10px] font-medium leading-none mb-0.5">
                          {wh.warehouseName}
                        </span>
                        <span className="text-teal-400 font-extrabold text-sm">
                          {wh.totalItemsInWarehouse?.toLocaleString() || 0}{" "}
                          Units
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-white/10 rotate-45 -mt-1.5 mx-auto rounded-xs" />
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold truncate w-full text-center px-1">
                    {wh.warehouseName}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 transition-colors">
              <div className="text-4xl">📦</div>
              <p className="text-sm font-medium">No warehouse data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseStockChart;
