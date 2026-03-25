import React from "react";
import Image from "next/image";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface SentimentChartProps {
  stats: DashboardStats;
}

const SentimentChart = ({ stats }: SentimentChartProps) => {
  return (
    <div className="mt-6 mb-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-white transition-colors mb-6 flex items-center gap-2">
        Product Review Sentiment
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-200" />
      </h3>
      <div className="space-y-6">
        {stats.productSentiment?.map((item, index) => {
          const goodPercent = (item.good / item.total) * 100;
          const badPercent = (item.bad / item.total) * 100;
          const neutralPercent = (item.neutral / item.total) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        ?
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {item.total} reviews
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {goodPercent > 0 && (
                  <div
                    style={{ width: `${goodPercent}%` }}
                    className="h-full bg-green-500 hover:bg-green-600 transition-colors"
                    title={`Good: ${item.good}`}
                  />
                )}
                {neutralPercent > 0 && (
                  <div
                    style={{ width: `${neutralPercent}%` }}
                    className="h-full bg-gray-400 hover:bg-gray-500 transition-colors"
                    title={`Neutral: ${item.neutral}`}
                  />
                )}
                {badPercent > 0 && (
                  <div
                    style={{ width: `${badPercent}%` }}
                    className="h-full bg-red-500 hover:bg-red-600 transition-colors"
                    title={`Bad: ${item.bad}`}
                  />
                )}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 px-1">
                <span className="text-green-600 dark:text-green-400">Good: {item.good}</span>
                <span className="text-red-500 dark:text-red-400">Bad: {item.bad}</span>
              </div>
            </div>
          );
        })}
        {(!stats.productSentiment || stats.productSentiment.length === 0) && (
          <p className="text-center text-slate-400 dark:text-slate-500 transition-colors text-sm py-8">
            No sentiment data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default SentimentChart;
