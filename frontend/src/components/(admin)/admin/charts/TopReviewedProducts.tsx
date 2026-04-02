import React from "react";
import Image from "next/image";
import { MessageSquare, Star, LayoutGrid } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface TopReviewedProductsProps {
  stats: DashboardStats;
}

const TopReviewedProducts = ({ stats }: TopReviewedProductsProps) => {
  const products = stats.topReviewedProducts || [];
  const maxReviews = Math.max(0, ...products.map((p) => p.count)) || 1;

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-indigo-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(100,102,241,0.3)] dark:shadow-[0_0_10px_rgba(100,102,241,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Engagement Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(100,102,241,0.5)] animate-pulse" />
          </h3>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full">
           <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <MessageSquare size={10} className="text-indigo-600 dark:text-indigo-500" />
             Feedback Logic
           </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 relative z-10">
        {products.length > 0 ? (
          products.slice(0, 5).map((product, i) => {
            const percentage = (product.count / maxReviews) * 100;
            return (
              <div key={i} className="space-y-2.5 group/item cursor-default">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/10 overflow-hidden relative shrink-0 group-hover/item:border-indigo-400 dark:group-hover/item:border-indigo-500/50 transition-all duration-500 shadow-inner">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
                          unoptimized
                        />
                      ) : (
                        <LayoutGrid className="m-auto text-slate-300 dark:text-slate-700 w-full h-full p-2.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-200 transition-colors uppercase tracking-tight truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                         {[...Array(5)].map((_, idx) => (
                           <Star key={idx} size={8} className="fill-amber-500/30 text-transparent" />
                         ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[13px] font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {product.count}
                    </span>
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Logs</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/2 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 relative group-hover/item:border-slate-300 dark:group-hover/item:border-white/10 transition-colors">
                  <div
                    className="h-full bg-linear-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)] dark:shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 gap-4">
             <div className="w-16 h-16 rounded-4xl bg-slate-50 dark:bg-white/2 flex items-center justify-center border border-slate-100 dark:border-white/5">
                <MessageSquare size={24} className="text-slate-300 dark:text-slate-700 opacity-50" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Feedback Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopReviewedProducts;
