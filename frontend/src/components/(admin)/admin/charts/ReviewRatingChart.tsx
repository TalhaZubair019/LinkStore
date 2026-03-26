import React from "react";
import { Star } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface ReviewRatingChartProps {
  stats: DashboardStats;
}

const ReviewRatingChart = ({ stats }: ReviewRatingChartProps) => {
  const totalReviews = Object.values(stats.ratingDistribution || {}).reduce(
    (a: number, b: number) => a + b,
    0,
  );
  const totalStars = Object.entries(stats.ratingDistribution || {}).reduce(
    (acc: number, [stars, count]: [string, number]) =>
      acc + Number(stars) * count,
    0,
  );
  const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        Review Rating Distribution
        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-200" />
      </h3>
      <div className="space-y-4">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution?.[rating] || 0;
          const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="flex items-center gap-1 w-12 text-sm font-medium text-slate-600 dark:text-slate-400">
                {rating}{" "}
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right transition-colors">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
        <div className="pt-4 text-center">
          <div className="text-3xl font-bold text-slate-700 dark:text-slate-200">
            {averageRating.toFixed(1)}
          </div>

          <div className="flex justify-center items-center gap-0.5 my-1">
            {[...Array(5)].map((_, i) => {
              const fillPercentage = Math.max(
                0,
                Math.min(100, (averageRating - i) * 100),
              );

              return (
                <div key={i} className="relative leading-none">
                  <Star
                    size={14}
                    className="text-gray-300 dark:text-slate-700"
                  />
                  {fillPercentage > 0 && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fillPercentage}%` }}
                    >
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
            Average Rating
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewRatingChart;
