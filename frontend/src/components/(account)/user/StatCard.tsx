"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, bg }) => {
  return (
    <div className="bg-white dark:bg-[#0d0f14] p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 flex items-center gap-4 sm:gap-5 lg:gap-6 transition-all group hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-500/30 duration-300 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      <div
        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-[1.25rem] flex items-center justify-center border transition-all relative z-10 ${bg}`}
      >
        <span className="group-hover:scale-110 transition-transform duration-500">
          {icon}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest transition-colors mb-1">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
