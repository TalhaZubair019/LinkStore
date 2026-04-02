import React from "react";
import { DollarSign, PieChart, TrendingUp } from "lucide-react";

export interface ExtraStat {
  label: string;
  amount: number;
  icon?: React.ReactNode;
}

interface FinancialStatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  subAmount?: number;
  type: "commission" | "earnings";
  subtitleIcon?: React.ReactNode;
  extraStats?: ExtraStat[];
}

const FinancialStatCard = ({
  title,
  amount,
  subtitle,
  subAmount,
  type,
  subtitleIcon,
  extraStats = [],
}: FinancialStatCardProps) => {
  const isCommission = type === "commission";
  const gradientClass = isCommission
    ? "from-emerald-500 to-teal-600 shadow-emerald-500/30"
    : "from-blue-600 to-indigo-700 shadow-blue-500/30";

  return (
    <div className="relative group cursor-pointer w-full h-full">
      {/* Dynamic Glow Aura */}
      <div
        className={`absolute -inset-1 bg-linear-to-r ${isCommission ? "from-emerald-600 to-teal-600" : "from-blue-600 to-indigo-600"} rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000`}
      />

      <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
        {/* Soft Accent Gradients */}
        <div
          className={`absolute -top-32 -right-32 w-72 h-72 ${isCommission ? "bg-emerald-600/10" : "bg-blue-600/10"} rounded-full blur-[100px] group-hover:bg-opacity-20 duration-700`}
        />
        <div
          className={`absolute -bottom-32 -left-32 w-72 h-72 ${isCommission ? "bg-emerald-600/5 shadow-emerald-500/10" : "bg-blue-600/5 shadow-blue-500/10"} rounded-full blur-[100px] group-hover:bg-opacity-10 duration-700`}
        />

        <div className="flex items-start justify-between relative z-10 w-full gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {amount.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="relative">
            {/* Pulsing Icon Glow */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${isCommission ? "from-emerald-600 to-teal-600" : "from-blue-600 to-indigo-600"} rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
            />
            <div
              className={`p-4.5 rounded-3xl bg-linear-to-br ${gradientClass} shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20`}
            >
              <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent opacity-50" />
              {isCommission ? (
                <PieChart
                  size={26}
                  className="text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              ) : (
                <DollarSign
                  size={26}
                  className="text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 py-4 border-y border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {subtitle !== undefined && subAmount !== undefined && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`shrink-0 p-2 rounded-xl ${isCommission ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"}`}
                >
                  {subtitleIcon || (
                    <TrendingUp
                      size={16}
                      className={
                        isCommission ? "text-emerald-500" : "text-blue-500"
                      }
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5 truncate">
                    {subtitle}
                  </p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight whitespace-nowrap">
                    ${subAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {extraStats.map((stat, idx) => (
              <React.Fragment key={idx}>
                {idx === 0 && subtitle !== undefined && (
                  <div className="w-px h-10 bg-slate-100 dark:bg-white/5 shrink-0 mx-1" />
                )}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`shrink-0 p-2 rounded-xl ${isCommission ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"}`}
                  >
                    {stat.icon || (
                      <TrendingUp
                        size={16}
                        className={
                          isCommission ? "text-emerald-500" : "text-blue-500"
                        }
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight whitespace-nowrap">
                      ${stat.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                {idx < extraStats.length - 1 && (
                  <div className="w-px h-10 bg-slate-100 dark:bg-white/5 shrink-0 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Financial Status
            </span>
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ring-1 ${isCommission ? "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20" : "text-blue-500 bg-blue-500/10 ring-blue-500/20"}`}
            >
              {isCommission ? "10% Cut" : "90% Earnings"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex">
            <div
              className={`h-full bg-linear-to-r ${isCommission ? "from-emerald-500 to-teal-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "from-blue-600 to-indigo-700 shadow-[0_0_12px_rgba(37,99,235,0.3)]"} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatCard;
