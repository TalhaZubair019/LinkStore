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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-colors ${bg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
