import React from "react";
import Image from "next/image";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface TopReviewedProductsProps {
  stats: DashboardStats;
}

const TopReviewedProducts = ({ stats }: TopReviewedProductsProps) => {
  return (
    <div className="h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500 flex flex-col">
      <h3 className="font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
        Top Reviewed Products
        <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-200" />
      </h3>
      <div className="space-y-5">
        {stats.topReviewedProducts?.map((product, index) => {
          const maxReviews =
            Math.max(
              ...(stats.topReviewedProducts?.map((p) => p.count) || [0]),
            ) || 1;
          const percentage = (product.count / maxReviews) * 100;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                    {product.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {product.count}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {(!stats.topReviewedProducts ||
          stats.topReviewedProducts.length === 0) && (
          <p className="text-center text-slate-400 dark:text-slate-500 transition-colors text-sm py-8">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopReviewedProducts;
