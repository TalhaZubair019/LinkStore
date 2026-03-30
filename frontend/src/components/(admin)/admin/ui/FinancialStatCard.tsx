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
  extraStats?: ExtraStat[];
}

const FinancialStatCard = ({
  title,
  amount,
  subtitle,
  subAmount,
  type,
  extraStats = [],
}: FinancialStatCardProps) => {
  const isCommission = type === "commission";
  const gradientClass = isCommission 
    ? "from-emerald-500 to-teal-600 shadow-emerald-500/30" 
    : "from-blue-600 to-indigo-700 shadow-blue-500/30";

  return (
    <div className="relative group cursor-pointer w-full">
      <div className={`absolute inset-0 bg-linear-to-br ${isCommission ? "from-emerald-600 to-teal-600" : "from-blue-600 to-indigo-600"} rounded-4xl opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-700`} />
      <div className="relative p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden transform group-hover:-translate-y-1.5 flex flex-col justify-between min-h-[180px]">
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br ${isCommission ? "from-emerald-600 to-teal-600" : "from-blue-600 to-indigo-600"} rounded-full blur-[80px] opacity-10 group-hover:opacity-25 transition-opacity duration-700 mix-blend-multiply`} />
        
        <div className="flex items-start justify-between relative z-10 w-full gap-4">
          <div className="space-y-1.5">
            <p className="text-slate-500/80 dark:text-slate-400/80 text-xs font-bold uppercase tracking-[0.2em]">
              {title}
            </p>
            <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              ${amount.toLocaleString()}
            </h3>
          </div>
          <div className={`p-4 rounded-2xl bg-linear-to-br ${gradientClass} shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-out shrink-0`}>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {isCommission ? (
              <PieChart size={24} className="text-white relative z-10" />
            ) : (
              <DollarSign size={24} className="text-white relative z-10" />
            )}
          </div>
        </div>
        
        <div className="relative z-10 my-4 border-t border-slate-100 dark:border-slate-800" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {(subtitle !== undefined && subAmount !== undefined) && (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`shrink-0 p-1.5 rounded-lg ${isCommission ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-blue-50 dark:bg-blue-500/10"}`}>
                  <TrendingUp size={15} className={isCommission ? "text-emerald-500" : "text-blue-500"} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5 truncate">
                    {subtitle}
                  </p>
                  <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none transition-colors">
                    ${subAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {(subtitle !== undefined && extraStats.length > 0) && (
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 shrink-0" />
            )}

            {extraStats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`shrink-0 p-1.5 rounded-lg ${isCommission ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-blue-50 dark:bg-blue-500/10"}`}>
                    {stat.icon || <TrendingUp size={14} className={isCommission ? "text-emerald-500" : "text-blue-500"} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none">
                      ${stat.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                {idx < extraStats.length - 1 && (
                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="shrink-0 text-right">
            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${isCommission ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
              {isCommission ? "10% Cut" : "90% Earnings"}
            </span>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="relative z-10 mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-linear-to-r ${isCommission ? "from-emerald-500 to-teal-600" : "from-blue-600 to-indigo-700"} rounded-full transition-all duration-1000 ease-out group-hover:brightness-110`}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialStatCard;
