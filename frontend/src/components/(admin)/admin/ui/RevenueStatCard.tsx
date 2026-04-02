import React from "react";
import { DollarSign, TrendingUp, XCircle } from "lucide-react";

interface RevenueStatCardProps {
  totalRevenue: number;
  grossRevenue: number;
  cancelledRevenue: number;
}

const RevenueStatCard = ({
  totalRevenue,
  grossRevenue,
  cancelledRevenue,
}: RevenueStatCardProps) => {
  const netRate =
    grossRevenue > 0 ? Math.round((totalRevenue / grossRevenue) * 100) : 100;

  return (
    <div className="relative group cursor-pointer w-full h-full">
      {/* Dynamic Glow Aura */}
      <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000" />

      <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
        {/* Soft Accent Gradients */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] group-hover:bg-violet-600/15 duration-700" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-fuchsia-600/5 rounded-full blur-[100px] group-hover:bg-fuchsia-600/10 duration-700" />

        <div className="flex items-start justify-between relative z-10 w-full gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Net Revenue
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="relative">
            {/* Pulsing Icon Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="p-4.5 rounded-3xl bg-linear-to-br from-violet-600 to-fuchsia-600 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20">
              <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent opacity-50" />
              <DollarSign
                size={26}
                className="text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 py-4 border-y border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <TrendingUp size={16} className="text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
                Gross
              </p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">
                ${grossRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <XCircle size={16} className="text-rose-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
                Canceled
              </p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">
                ${cancelledRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Fulfillment Goal
            </span>
            <span className="text-[10px] font-black text-violet-500 bg-violet-500/10 px-2.5 py-0.5 rounded-full ring-1 ring-violet-500/20">
              {netRate}% Net
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex">
            <div
              className="h-full bg-linear-to-r from-violet-600 to-fuchsia-600 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              style={{ width: `${netRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatCard;
