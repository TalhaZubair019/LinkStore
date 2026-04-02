import React from "react";
import { Star, Activity } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface ReviewRatingChartProps {
  title?: string;
  distribution: Record<string, number>;
  color?: string;
}

const ReviewRatingChart = ({
  title = "Review Rating Distribution",
  distribution,
  color = "amber-400",
}: ReviewRatingChartProps) => {
  const totalReviews = Object.values(distribution || {}).reduce(
    (a: number, b: number) => a + b,
    0,
  );
  const totalStars = Object.entries(distribution || {}).reduce(
    (acc: number, [stars, count]: [string, number]) =>
      acc + Number(stars) * count,
    0,
  );
  const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

  const accentColor = color.includes("amber")
    ? "#f59e0b"
    : color.includes("purple")
      ? "#a85df6"
      : color.includes("blue")
        ? "#3b82f6"
        : "#f59e0b";

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-amber-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-600/5 dark:bg-amber-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] dark:shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 leading-none">
          {title}
          <span className="ml-3 inline-block w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
        </h3>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution?.[rating] || 0;
          const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="group/row flex items-center gap-4">
              <div className="flex items-center gap-1.5 w-14 shrink-0">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 group-hover/row:text-amber-600 dark:group-hover/row:text-amber-400 transition-colors uppercase">
                  {rating}
                </span>
                <Star
                  size={10}
                  className="fill-amber-500 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]"
                />
              </div>
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/2 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 relative group-hover/row:border-slate-300 dark:group-hover/row:border-white/10 transition-colors">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 group-hover/row:text-slate-900 dark:group-hover/row:text-slate-200 transition-colors tabular-nums tracking-tighter">
                  {count}{" "}
                  <span className="opacity-40 text-[8px] ml-1 uppercase">
                    {percentage.toFixed(0)}%
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-amber-600/5 dark:bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all duration-700" />
            <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] tracking-tighter tabular-nums">
              {averageRating.toFixed(1)}
            </div>
          </div>

          <div className="flex justify-center items-center gap-1.5 mb-3 relative z-10">
            {[...Array(5)].map((_, i) => {
              const fill = Math.max(
                0,
                Math.min(100, (averageRating - i) * 100),
              );
              return (
                <div
                  key={i}
                  className="relative leading-none group-hover:scale-110 transition-transform duration-500"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <Star size={14} className="text-slate-200 dark:text-white/5 fill-slate-100 dark:fill-white/2" />
                  {fill > 0 && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fill}%` }}
                    >
                      <Star
                        size={14}
                        className="fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRatingChart;
