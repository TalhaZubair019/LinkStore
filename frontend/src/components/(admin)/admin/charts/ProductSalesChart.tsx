import React from "react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface ProductSalesChartProps {
  stats: DashboardStats;
}

const ProductSalesChart = ({ stats }: ProductSalesChartProps) => {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          Product Sales Performance
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          Units Sold
        </span>
      </h3>
      <div className="space-y-4">
        {stats.topProductsByQuantity &&
        stats.topProductsByQuantity.length > 0 ? (
          stats.topProductsByQuantity
            .slice(0, 5)
            .map((product: any, i: number) => {
              const maxSales = Math.max(
                ...stats.topProductsByQuantity.map((p: any) => p.quantity || 0),
              );
              const percentage =
                maxSales > 0 ? (product.quantity / maxSales) * 100 : 0;
              return (
                <div key={i} className="space-y-2 group">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </span>
                    <span className="font-bold text-purple-600 group-hover:scale-110 transition-transform">
                      {product.quantity} sold
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-600 group-hover:to-blue-600 shadow-sm"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-4">
            No sales data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSalesChart;
