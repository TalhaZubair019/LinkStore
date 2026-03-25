"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Store, Mail, Calendar, ExternalLink, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { UserData } from "@/app/(admin)/admin/types";
import DeleteConfirmationModal from "@/components/(admin)/admin/modals/DeleteConfirmationModal";

interface VendorsTableProps {
  vendors: UserData[];
  viewMode: "pending" | "active" | "suspended";
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onUnsuspend?: (id: string) => void;
  onClearDebt?: (id: string) => void;
  isLoading?: boolean;
}

const VendorsTable = ({
  vendors,
  viewMode,
  onApprove,
  onReject,
  onSuspend,
  onUnsuspend,
  onClearDebt,
  isLoading
}: VendorsTableProps) => {
  const [suspendConfirm, setSuspendConfirm] = React.useState<UserData | null>(null);
  const [unsuspendConfirm, setUnsuspendConfirm] = React.useState<UserData | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300 transition-colors">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {viewMode === "pending" ? "Vendor Applications" : viewMode === "suspended" ? "Suspended Stores" : "Active Vendors"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {viewMode === "pending" 
              ? `Review and approve new store requests (${vendors.length})` 
              : viewMode === "suspended"
              ? `Review suspended accounts (${vendors.length})`
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
              <th className="px-8 py-5">Commission</th>
              <th className="px-8 py-5">Applied Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
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
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${v.vendorProfile?.outstandingCommission ? 'text-rose-500' : 'text-emerald-500'}`}>
                        ${(v.vendorProfile?.outstandingCommission || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Outstanding</span>
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
                          {viewMode === "active" && (v.vendorProfile?.outstandingCommission || 0) > 0 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Clear debt of $${v.vendorProfile?.outstandingCommission} for ${v.vendorProfile?.storeName}?`)) {
                                  onClearDebt?.(v.id);
                                }
                              }}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                              <ShieldCheck size={16} /> Clear Debt
                            </button>
                          )}
                          {viewMode === "active" && (
                            <button
                              onClick={() => setSuspendConfirm(v)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                            >
                              <X size={16} /> Suspend
                            </button>
                          )}
                          {viewMode === "suspended" && (
                            <button
                              onClick={() => setUnsuspendConfirm(v)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                              <Check size={16} /> Unsuspend
                            </button>
                          )}
                           <Link
                            href={`/admin/vendors/view/${v.vendorProfile?.storeSlug}`}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-all border border-indigo-100 dark:border-indigo-800/30"
                            title="Visit Store"
                          >
                            <Store size={16} /> Visit
                          </Link>
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

      {/* Suspend Modal */}
      <DeleteConfirmationModal
        isOpen={!!suspendConfirm}
        onClose={() => setSuspendConfirm(null)}
        onConfirm={() => {
          if (suspendConfirm) {
            onSuspend?.(suspendConfirm.id);
            setSuspendConfirm(null);
          }
        }}
        title="Suspend Store?"
        message={
          <>
            Are you sure you want to suspend access for{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {suspendConfirm?.vendorProfile?.storeName || suspendConfirm?.name}
            </span>
            ? They will lose access to the seller dashboard.
          </>
        }
        confirmLabel="Suspend"
        confirmClassName="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
        isLoading={isLoading || false}
        icon={<ShieldAlert size={32} />}
      />

      {/* Unsuspend Modal */}
      <DeleteConfirmationModal
        isOpen={!!unsuspendConfirm}
        onClose={() => setUnsuspendConfirm(null)}
        onConfirm={() => {
          if (unsuspendConfirm) {
            onUnsuspend?.(unsuspendConfirm.id);
            setUnsuspendConfirm(null);
          }
        }}
        title="Unsuspend Store?"
        message={
          <>
            Restore access for{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {unsuspendConfirm?.vendorProfile?.storeName || unsuspendConfirm?.name}
            </span>
            ? They will regain full access to the seller dashboard.
          </>
        }
        confirmLabel="Unsuspend"
        confirmClassName="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
        isLoading={isLoading || false}
        icon={<Shield size={32} />}
      />
    </div>
  );
};

export default VendorsTable;
