"use client";

import React from "react";
import { Check, X, Store, Mail, Calendar, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { UserData } from "@/app/admin/types";

interface VendorsTableProps {
  vendors: UserData[];
  viewMode: "pending" | "active";
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
  onSuspend?: (id: string) => void;
  isLoading?: boolean;
}

const VendorsTable = ({
  vendors,
  viewMode,
  onApprove,
  onReject,
  onSuspend,
  isLoading
}: VendorsTableProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300 transition-colors">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {viewMode === "pending" ? "Vendor Applications" : "Active Vendors"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {viewMode === "pending" 
              ? `Review and approve new store requests (${vendors.length})` 
              : `Manage your marketplace sellers (${vendors.length})`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-5">Vendor / Store</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5">Applied Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Store size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium italic">No {viewMode} vendors found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              vendors.map((v) => (
                <tr 
                  key={v.id} 
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                        {v.vendorProfile?.storeName?.[0]?.toUpperCase() || <Store size={20} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {v.vendorProfile?.storeName || "Unnamed Store"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          <ShieldCheck size={12} className={v.isVendor ? "text-emerald-500" : "text-amber-500"} />
                          {v.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail size={14} className="text-slate-400" />
                        <span>{v.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar size={14} />
                      <span>{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {viewMode === "pending" ? (
                        <>
                          <button
                            onClick={() => onApprove(v.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button
                            onClick={() => onReject?.(v.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
                          >
                            <X size={16} /> Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSuspend?.(v.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                          >
                            <X size={16} /> Suspend
                          </button>
                          <button
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Storefront"
                          >
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsTable;
