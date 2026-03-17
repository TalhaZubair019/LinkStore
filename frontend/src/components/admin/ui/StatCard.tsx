import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="relative group cursor-pointer w-full">
    <div
      className={`absolute inset-0 bg-linear-to-br ${color} rounded-4xl opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-700`}
    />
    <div className="relative p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden transform group-hover:-translate-y-1.5 flex flex-col justify-between min-h-[180px]">
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br ${color} rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 mix-blend-multiply`}
      />
      <div
        className={`absolute -bottom-24 -left-24 w-64 h-64 bg-linear-to-tr ${color} rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 mix-blend-multiply`}
      />

      <div className="flex items-start justify-between relative z-10 w-full gap-4">
        <div className="space-y-2">
          <p className="text-slate-500/80 dark:text-slate-400/80 text-xs font-bold uppercase tracking-[0.2em]">
            {title}
          </p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight break-all">
            {value}
          </h3>
        </div>

        <div
          className={`p-4 rounded-2xl bg-linear-to-br ${color} shadow-lg shadow-current/30 relative overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-out shrink-0`}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Icon size={24} className="text-white relative z-10" />
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between w-full">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-linear-to-r ${color} rounded-full w-2/3 group-hover:w-full transition-all duration-1000 ease-out opacity-60`}
          />
        </div>
      </div>
    </div>
  </div>
);

export default StatCard;
