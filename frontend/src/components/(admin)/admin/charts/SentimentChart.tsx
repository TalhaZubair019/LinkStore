import React from "react";
import Image from "next/image";
import { Smile, Frown, Meh, LayoutGrid } from "lucide-react";
import { DashboardStats } from "@/app/(admin)/admin/types";

interface SentimentChartProps {
  stats: DashboardStats;
}

const SentimentChart = ({ stats }: SentimentChartProps) => {
  const sentimentData = stats.productSentiment || [];

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group transition-all duration-700 hover:shadow-emerald-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl flex flex-col h-full">
      {/* Ambient Depth Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-600/5 dark:bg-emerald-600/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            Sentiment Matrix
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          </h3>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full">
           <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Smile size={10} className="text-emerald-600 dark:text-emerald-500" />
             Core Resonance
           </p>
        </div>
      </div>

      <div className="flex-1 space-y-8 relative z-10">
        {sentimentData.length > 0 ? (
          sentimentData.map((item, index) => {
            const goodPercent = (item.good / item.total) * 100;
            const badPercent = (item.bad / item.total) * 100;
            const neutralPercent = (item.neutral / item.total) * 100;

            return (
              <div key={index} className="space-y-3 group/item cursor-default">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/10 overflow-hidden relative shrink-0 group-hover/item:border-emerald-400 dark:group-hover/item:border-emerald-500/50 transition-all duration-500 shadow-inner">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
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
                        {item.name}
                      </p>
                      <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">
                        {item.total} Logs Synchronized
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                     <div className="text-right">
                        <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none tracking-tighter">{goodPercent.toFixed(0)}%</p>
                        <p className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">Pos</p>
                     </div>
                     <div className="w-px h-6 bg-slate-100 dark:bg-white/5" />
                     <div className="text-center min-w-[30px]">
                        <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 tabular-nums leading-none tracking-tighter">{neutralPercent.toFixed(0)}%</p>
                        <p className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">Neu</p>
                     </div>
                     <div className="w-px h-6 bg-slate-100 dark:bg-white/5" />
                     <div className="text-left">
                        <p className="text-[11px] font-black text-rose-600 dark:text-rose-500 tabular-nums leading-none tracking-tighter">{badPercent.toFixed(0)}%</p>
                        <p className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">Neg</p>
                     </div>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/2 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 flex relative group-hover/item:border-slate-300 dark:group-hover/item:border-white/10 transition-colors">
                  {goodPercent > 0 && (
                    <div
                      style={{ width: `${goodPercent}%` }}
                      className="h-full bg-emerald-500/90 shadow-[0_0_10px_rgba(16,185,129,0.2)] dark:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out"
                    />
                  )}
                  {neutralPercent > 0 && (
                    <div
                      style={{ width: `${neutralPercent}%` }}
                      className="h-full bg-slate-300 dark:bg-slate-700 transition-all duration-1000 ease-out"
                    />
                  )}
                  {badPercent > 0 && (
                    <div
                      style={{ width: `${badPercent}%` }}
                      className="h-full bg-rose-500/90 shadow-[0_0_10px_rgba(244,63,94,0.2)] dark:shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-1000 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 gap-4">
             <div className="w-16 h-16 rounded-4xl bg-slate-50 dark:bg-white/2 flex items-center justify-center border border-slate-100 dark:border-white/5">
                <Meh size={24} className="text-slate-300 dark:text-slate-700 opacity-50" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Polarity Detected</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 px-2">
         {[
           { icon: <Smile size={10} />, label: "Positive", color: "text-emerald-600 dark:text-emerald-500" },
           { icon: <Meh size={10} />, label: "Neutral", color: "text-slate-400 dark:text-slate-500" },
           { icon: <Frown size={10} />, label: "Negative", color: "text-rose-600 dark:text-rose-500" }
         ].map((l, i) => (
           <div key={i} className="flex items-center justify-center gap-2">
             <div className={l.color}>{l.icon}</div>
             <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{l.label}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default SentimentChart;
