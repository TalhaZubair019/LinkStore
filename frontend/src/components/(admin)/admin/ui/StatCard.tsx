import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="relative group cursor-pointer w-full h-full">
    {/* Dynamic Glow Aura */}
    <div
      className={`absolute -inset-1 bg-linear-to-br ${color} rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000`}
    />

    <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
      {/* Soft Accent Gradients */}
      <div
        className={`absolute -top-32 -right-32 w-72 h-72 bg-linear-to-br ${color} rounded-full blur-[100px] opacity-10 group-hover:opacity-20 duration-700`}
      />

      <div className="flex items-start justify-between relative z-10 w-full gap-4">
        <div className="space-y-2">
          <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            {title}
          </p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
            {value}
          </h3>
        </div>

        <div className="relative">
          {/* Pulsing Icon Glow */}
          <div
            className={`absolute inset-0 bg-linear-to-br ${color} rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
          />
          <div
            className={`p-4.5 rounded-3xl bg-linear-to-br ${color} shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20`}
          >
            <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent opacity-50" />
            <Icon size={26} className="text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 space-y-3">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-linear-to-r ${color} rounded-full w-2/3 transition-all duration-1000 ease-out group-hover:shadow-[0_0_12px_rgba(255,255,255,0.3)]`}
          />
        </div>
      </div>
    </div>
  </div>
);

export default StatCard;
