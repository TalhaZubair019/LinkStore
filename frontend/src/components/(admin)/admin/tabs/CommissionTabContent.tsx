"use client";

import React from "react";
import { DollarSign, History, CreditCard, ArrowUpRight,  CheckCircle2, 
  Clock,
  Loader2,
} from "lucide-react";

interface CommissionStats {
  outstandingCommission: number;
  totalCommissionPaid: number;
  vendorId?: string;
  storeName?: string;
}

interface CommissionTabContentProps {
  stats: any;
  isAdminView?: boolean;
  onClearDebt?: (vendorId: string) => void;
  onStripePay?: () => void;
  onNotifyAdmin?: () => void;
  isProcessingStripe?: boolean;
  isNotifyingAdmin?: boolean;
}

const CommissionTabContent: React.FC<CommissionTabContentProps> = ({
  stats,
  isAdminView = false,
  onClearDebt,
  onStripePay,
  onNotifyAdmin,
  isProcessingStripe = false,
  isNotifyingAdmin = false,
}) => {
  if (isAdminView) {
    const commissionStats = stats?.commissionStats || [];
    const totalOutstanding = commissionStats.reduce((sum: number, v: any) => sum + (v.outstandingCommission || 0), 0);
    const totalPaid = commissionStats.reduce((sum: number, v: any) => sum + (v.totalCommissionPaid || 0), 0);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Admin Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Clock size={120} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Total Outstanding</h3>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Fees currently due from all vendors</p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={120} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Total Collected</h3>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Life-time commission received</p>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vendor Commissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor / Store</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Outstanding (Current)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total Paid (Previous)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 regular-rows">
                {commissionStats.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No vendor data available</td>
                    </tr>
                ) : (
                    commissionStats.map((v: any) => (
                    <tr key={v.vendorId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{v.storeName}</td>
                        <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.outstandingCommission > 0 ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                            ${v.outstandingCommission.toFixed(2)}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        ${v.totalCommissionPaid.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                        {v.outstandingCommission > 0 && onClearDebt && (
                            <button
                            onClick={() => onClearDebt(v.vendorId)}
                            className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                            >
                            Clear Debt
                            </button>
                        )}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Vendor View
  const outstanding = stats?.outstandingCommission || 0;
  const paid = stats?.totalCommissionPaid || 0;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Fee (Outstanding) */}
        <div className="p-8 bg-linear-to-br from-rose-500 to-orange-500 rounded-3xl text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 scale-150 rotate-12">
            <Clock size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md text-white">
                <Clock size={20} />
              </div>
              <h3 className="text-md font-bold text-white/90 uppercase tracking-wider">Current Fee Due</h3>
            </div>
            <p className="text-5xl font-black font-mono tracking-tighter">
              ${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {outstanding > 0 && onStripePay && (
                <button
                  onClick={onStripePay}
                  disabled={isProcessingStripe}
                  className="px-6 py-3 bg-white text-rose-600 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessingStripe ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                  Pay with Card
                </button>
              )}
              {outstanding > 0 && onNotifyAdmin && (
                <button
                  onClick={onNotifyAdmin}
                  disabled={isNotifyingAdmin}
                  className="px-6 py-3 bg-rose-600/20 text-white border border-rose-400/30 rounded-xl font-bold text-sm hover:bg-rose-600/40 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isNotifyingAdmin ? <Loader2 className="animate-spin" size={18} /> : <Clock size={18} />}
                  Notify Admin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Total Paid (History) */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <History size={120} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <History size={20} />
              </div>
              <h3 className="text-md font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Life-time Paid</h3>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
              ${paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
              The total amount of commission you have contributed to the platform since joining.
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-6 bg-slate-900 dark:bg-white rounded-3xl text-white dark:text-slate-900 flex items-center gap-6 shadow-2xl">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
          <ArrowUpRight size={28} />
        </div>
        <div>
           <h4 className="text-lg font-bold">Commission Policy</h4>
           <p className="text-sm opacity-70">Linking fees are calculated at 10% for COD orders. Commission billing is conducted on an hourly basis.</p>
        </div>
      </div>
    </div>
  );
};

export default CommissionTabContent;
