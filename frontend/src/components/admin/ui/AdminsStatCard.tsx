import React from "react";
import { ShieldCheck, UserCheck, ShieldAlert } from "lucide-react";
import { UserData } from "@/app/admin/types";

interface AdminsStatCardProps {
  totalAdmins: number;
  users: UserData[];
}

const AdminsStatCard = ({ totalAdmins, users }: AdminsStatCardProps) => {
  const superAdmins = users?.filter(u => u.adminRole === "super_admin").length || 0;
  const regularAdmins = totalAdmins - superAdmins;
  
  const superRate = totalAdmins > 0 ? Math.round((superAdmins / totalAdmins) * 100) : 0;
  const regularRate = 100 - superRate;

  return (
    <div className="relative group cursor-pointer w-full">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-blue-600 rounded-4xl opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-700" />
      <div className="relative p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden transform group-hover:-translate-y-1.5 flex flex-col justify-between min-h-[180px]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-indigo-500 to-blue-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-25 transition-opacity duration-700 mix-blend-multiply" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-linear-to-tr from-cyan-400 to-blue-500 rounded-full blur-[80px] opacity-5 group-hover:opacity-15 transition-opacity duration-700 mix-blend-multiply" />
        <div className="flex items-start justify-between relative z-10 w-full gap-4">
          <div className="space-y-1.5">
            <p className="text-slate-500/80 dark:text-slate-400/80 text-xs font-bold uppercase tracking-[0.2em]">
              Total Admins
            </p>
            <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              {totalAdmins}
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-500 to-blue-600 shadow-lg shadow-blue-500/30 relative overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-out shrink-0">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldCheck size={24} className="text-white relative z-10" />
          </div>
        </div>
        <div className="relative z-10 my-4 border-t border-slate-100 dark:border-slate-800" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 text-nowrap">
            <div className="shrink-0 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <ShieldAlert size={15} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                Super
              </p>
              <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none transition-colors">
                {superAdmins}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 shrink-0" />
          <div className="flex items-center gap-2.5 flex-1 text-nowrap">
            <div className="shrink-0 p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <UserCheck size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                Staff
              </p>
              <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none transition-colors">
                {regularAdmins}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {superRate}% super
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
            style={{ width: `${superRate}%` }}
          />
          <div
            className="absolute top-0 right-0 h-full bg-linear-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${regularRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminsStatCard;
