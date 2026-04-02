"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  X,
  Store,
  Mail,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Loader2,
} from "lucide-react";
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
  processingVendorId?: { id: string; action: "approve" | "reject" } | null;
}

const VendorsTable = ({
  vendors,
  viewMode,
  onApprove,
  onReject,
  onSuspend,
  onUnsuspend,
  onClearDebt,
  isLoading,
  processingVendorId,
}: VendorsTableProps) => {
  const [suspendConfirm, setSuspendConfirm] = React.useState<UserData | null>(
    null,
  );
  const [unsuspendConfirm, setUnsuspendConfirm] =
    React.useState<UserData | null>(null);

  return (
    <div className="bg-white dark:bg-[#11141b] rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in duration-500 transition-all relative group">
      {/* Decorative Glows */}
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-700" />

      <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              {viewMode === "pending"
                ? "Vendor Applications"
                : viewMode === "suspended"
                  ? "Suspended Stores"
                  : "Active Vendors"}
            </h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-5">
            {viewMode === "pending"
              ? `Review and approve new store requests (${vendors.length})`
              : viewMode === "suspended"
                ? `Review suspended accounts (${vendors.length})`
                : `Manage your marketplace sellers (${vendors.length})`}
          </p>
        </div>
      </div>

      {}
      <div className="hidden md:block overflow-x-auto scrollbar-none relative z-10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-white/1 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-10 py-6 tracking-[0.3em]">Vendor / Store</th>
              <th className="px-10 py-6 tracking-[0.3em]">Contact</th>
              <th className="px-10 py-6 tracking-[0.3em]">Applied Date</th>
              <th className="px-10 py-6 text-right tracking-[0.3em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                    <Store
                      size={64}
                      className="mb-4 opacity-10 animate-pulse"
                    />
                    <p className="text-xl font-black uppercase tracking-widest italic">
                      No {viewMode} entities found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              vendors.map((v) => (
                <tr
                  key={v.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all duration-300"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-20 group-hover/row:opacity-40 transition-opacity" />
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-xl border border-white/10 relative z-10 transition-transform group-hover/row:scale-110">
                          {v.vendorProfile?.storeName?.[0]?.toUpperCase() || (
                            <Store size={24} />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-base text-slate-800 dark:text-white truncate tracking-tight uppercase group-hover/row:text-blue-500 transition-colors">
                          {v.vendorProfile?.storeName || "Unnamed Store"}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 truncate mt-1 flex items-center gap-2 uppercase tracking-widest">
                          <ShieldCheck
                            size={12}
                            className={
                              v.isVendor ? "text-emerald-500" : "text-amber-500"
                            }
                          />
                          {v.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 group/link">
                      <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group-hover/link:border-blue-500/30 transition-colors">
                        <Mail
                          size={14}
                          className="text-slate-400 dark:text-slate-600 group-hover/link:text-blue-500"
                        />
                      </div>
                      <span className="group-hover/link:text-slate-800 dark:group-hover:text-white transition-colors">
                        {v.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2.5 text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                      <Calendar size={14} className="opacity-50" />
                      <span>
                        {v.createdAt
                          ? new Date(v.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all duration-300">
                      {viewMode === "pending" ? (
                        <>
                          <button
                            onClick={() => onApprove(v.id)}
                            disabled={
                              isLoading || processingVendorId?.id === v.id
                            }
                            className="group/btn flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                          >
                            {processingVendorId?.id === v.id &&
                            processingVendorId.action === "approve" ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <>
                                <Check
                                  size={16}
                                  className="group-hover/btn:rotate-12 transition-transform"
                                />{" "}
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => onReject?.(v.id)}
                            disabled={
                              isLoading || processingVendorId?.id === v.id
                            }
                            className="group/btn flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                          >
                            {processingVendorId?.id === v.id &&
                            processingVendorId.action === "reject" ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <>
                                <X
                                  size={16}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />{" "}
                                Reject
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          {viewMode === "active" && (
                            <button
                              onClick={() => setSuspendConfirm(v)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                            >
                              <ShieldAlert size={16} /> Suspend
                            </button>
                          )}
                          {viewMode === "suspended" && (
                            <button
                              onClick={() => setUnsuspendConfirm(v)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                            >
                              <Shield size={16} /> Restore
                            </button>
                          )}
                          <Link
                            href={`/admin/vendors/view/${v.vendorProfile?.storeSlug}`}
                            className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-blue-500/10 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
                          >
                            <ExternalLink size={18} />
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

      {}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5 bg-white/50 dark:bg-transparent transition-colors">
        {vendors.length === 0 ? (
          <div className="px-6 py-24 text-center">
            <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
              <Store size={48} className="mb-4 opacity-10 animate-pulse" />
              <p className="text-base font-black uppercase tracking-widest italic">
                No {viewMode} entities found.
              </p>
            </div>
          </div>
        ) : (
          vendors.map((v) => (
            <div
              key={v.id}
              className="p-8 space-y-6 hover:bg-slate-50 dark:hover:bg-white/2 transition-all duration-300 group/card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-20" />
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-black shadow-lg relative z-10 border border-white/10 transition-transform group-hover/card:scale-105">
                      {v.vendorProfile?.storeName?.[0]?.toUpperCase() || (
                        <Store size={20} />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-base text-slate-800 dark:text-white truncate tracking-tight uppercase">
                      {v.vendorProfile?.storeName || "Unnamed Store"}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 truncate mt-1 flex items-center gap-1.5 uppercase tracking-widest">
                      <ShieldCheck
                        size={10}
                        className={
                          v.isVendor ? "text-emerald-500" : "text-amber-500"
                        }
                      />
                      {v.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-white/3 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="opacity-50" />
                    <span>{v.email}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="opacity-50" />
                    <span>
                      {v.createdAt
                        ? new Date(v.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {viewMode === "pending" ? (
                  <>
                    <button
                      onClick={() => onApprove(v.id)}
                      disabled={isLoading || processingVendorId?.id === v.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.2)] disabled:opacity-50 min-h-[50px] transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {processingVendorId?.id === v.id &&
                      processingVendorId.action === "approve" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={16} /> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onReject?.(v.id)}
                      disabled={isLoading || processingVendorId?.id === v.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(244,63,94,0.2)] disabled:opacity-50 min-h-[50px] transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {processingVendorId?.id === v.id &&
                      processingVendorId.action === "reject" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <X size={16} /> Reject
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 w-full">
                    {viewMode === "active" && (
                      <button
                        onClick={() => setSuspendConfirm(v)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(245,158,11,0.2)] disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <ShieldAlert size={16} /> Suspend
                      </button>
                    )}
                    {viewMode === "suspended" && (
                      <button
                        onClick={() => setUnsuspendConfirm(v)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(59,130,246,0.2)] disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <Shield size={16} /> Restore
                      </button>
                    )}
                    <Link
                      href={`/admin/vendors/view/${v.vendorProfile?.storeSlug}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <ExternalLink size={16} /> View Store
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {}
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
            <span className="font-black text-rose-500 uppercase tracking-tight">
              {suspendConfirm?.vendorProfile?.storeName || suspendConfirm?.name}
            </span>
            ? They will lose access to the seller dashboard.
          </>
        }
        confirmLabel="Suspension"
        confirmClassName="flex-1 px-8 py-4 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-900/20 active:scale-95 transition-all text-[10px]"
        isLoading={isLoading || false}
        icon={<ShieldAlert size={32} className="text-rose-500 animate-pulse" />}
      />

      {}
      <DeleteConfirmationModal
        isOpen={!!unsuspendConfirm}
        onClose={() => setUnsuspendConfirm(null)}
        onConfirm={() => {
          if (unsuspendConfirm) {
            onUnsuspend?.(unsuspendConfirm.id);
            setUnsuspendConfirm(null);
          }
        }}
        title="Restore Store?"
        message={
          <>
            Restore full marketplace access for{" "}
            <span className="font-black text-emerald-500 uppercase tracking-tight">
              {unsuspendConfirm?.vendorProfile?.storeName ||
                unsuspendConfirm?.name}
            </span>
            ? They will regain full access to the seller dashboard.
          </>
        }
        confirmLabel="Authorize Restoration"
        confirmClassName="flex-1 px-8 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all text-[10px]"
        isLoading={isLoading || false}
        icon={<Shield size={32} className="text-emerald-500" />}
      />
    </div>
  );
};

export default VendorsTable;
