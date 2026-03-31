"use client";

import React from "react";
import {
  DollarSign,
  History,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
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
  onWalletTopup?: (amount: number) => void;
  isProcessingStripe?: boolean;
  isProcessingWallet?: boolean;
}

const CommissionTabContent: React.FC<CommissionTabContentProps> = ({
  stats,
  isAdminView = false,
  onClearDebt,
  onStripePay,
  onWalletTopup,
  isProcessingStripe = false,
  isProcessingWallet = false,
}) => {
  const [isTopupModalOpen, setIsTopupModalOpen] = React.useState(false);
  const [topupAmount, setTopupAmount] = React.useState("50");
  const [vendorToClear, setVendorToClear] = React.useState<any>(null);
  if (isAdminView) {
    const commissionStats = stats?.commissionStats || [];
    const totalOutstanding = commissionStats.reduce(
      (sum: number, v: any) => sum + (v.outstandingCommission || 0),
      0,
    );
    const totalPaid = commissionStats.reduce(
      (sum: number, v: any) => sum + (v.totalCommissionPaid || 0),
      0,
    );
    const totalWalletFunds = commissionStats.reduce(
      (sum: number, v: any) => sum + (v.walletBalance || 0),
      0,
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-linear-to-br from-rose-500/10 to-orange-500/10 dark:from-rose-500/5 dark:to-orange-500/5 rounded-3xl border border-rose-200/50 dark:border-rose-500/20 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-rose-600">
              <Clock size={160} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest">
                  Revenue Owed
                </h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Total Outstanding
                </p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              $
              {totalOutstanding.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-4 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold bg-rose-50 dark:bg-rose-500/10 w-fit px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              Platform Debt
            </div>
          </div>

          <div className="p-8 bg-linear-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-3xl border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-emerald-600">
              <CheckCircle2 size={160} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                  Success Metrics
                </h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Platform Earnings
                </p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              $
              {totalPaid.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Life-time Collected
            </div>
          </div>

          <div className="p-8 bg-linear-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-3xl border border-blue-200/50 dark:border-blue-500/20 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-blue-600">
              <CreditCard size={160} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest">
                  Vendor Liquidity
                </h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Total Wallet Funds
                </p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              $
              {totalWalletFunds.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-500/10 w-fit px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Across all vendors
            </div>
          </div>
        </div>

        {}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Vendor Commissions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Vendor / Store
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Outstanding (Current)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Wallet Balance
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Total Paid (Previous)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 regular-rows">
                {commissionStats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No vendor data available
                    </td>
                  </tr>
                ) : (
                  commissionStats.map((v: any) => (
                    <tr
                      key={v.vendorId}
                      className="group/row hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-all duration-200"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">
                            {v.storeName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                            Vendor ID: {v.vendorId?.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black ring-1 ring-inset ${
                            v.outstandingCommission > 0
                              ? "bg-rose-50 text-rose-600 ring-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                              : v.outstandingCommission < 0
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-slate-50 text-slate-500 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {v.outstandingCommission < 0
                            ? `- $${Math.abs(v.outstandingCommission).toFixed(2)}`
                            : `$${v.outstandingCommission.toFixed(2)}`}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">
                          ${(v.walletBalance || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                          ${v.totalCommissionPaid.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {v.outstandingCommission > 0 && onClearDebt && (
                          <button
                            onClick={() => setVendorToClear(v)}
                            className="text-[10px] uppercase tracking-widest px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
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

  const outstanding = stats?.outstandingCommission || 0;
  const paid = stats?.totalCommissionPaid || 0;
  const wallet = stats?.walletBalance || 0;

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {}
        <div
          className={`p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
            outstanding >= 0
              ? "bg-linear-to-br from-rose-500 via-rose-600 to-orange-500 shadow-rose-500/20"
              : "bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-500 shadow-emerald-500/20"
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 scale-[2] rotate-12 -mr-8 -mt-8 grayscale brightness-200">
            {outstanding >= 0 ? (
              <Clock size={160} />
            ) : (
              <CheckCircle2 size={160} />
            )}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl text-white border border-white/30">
                {outstanding >= 0 ? (
                  <Clock size={20} />
                ) : (
                  <CheckCircle2 size={24} />
                )}
              </div>
              <h3 className="text-xs font-black text-white/80 uppercase tracking-widest">
                {outstanding >= 0 ? "Outstanding Debt" : "Account Credit"}
              </h3>
            </div>
            <p className="text-5xl font-black font-mono tracking-tighter">
              $
              {Math.abs(outstanding).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {outstanding > 0 && onStripePay && (
                <button
                  onClick={onStripePay}
                  disabled={isProcessingStripe}
                  className="w-full px-6 py-4 bg-white text-rose-600 rounded-2xl font-black text-sm shadow-xl shadow-black/10 hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingStripe ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  Pay Fee Now
                </button>
              )}
              {outstanding <= 0 && (
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
                  <CheckCircle2 size={18} />
                  No outstanding debt
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="p-8 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-blue-400/20">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 scale-150 rotate-6 grayscale brightness-200">
            <DollarSign size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl text-white border border-white/30">
                <DollarSign size={20} />
              </div>
              <h3 className="text-xs font-black text-white/80 uppercase tracking-widest">
                Available Funds
              </h3>
            </div>
            <p className="text-5xl font-black text-white font-mono tracking-tighter">
              $
              {wallet.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsTopupModalOpen(true)}
                disabled={isProcessingWallet}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl font-black text-sm border border-white/20 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingWallet ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
                Top Up Wallet
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-emerald-600">
            <History size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                  Track Record
                </h3>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-1">
              Lifetime Paid
            </p>
            <p className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
              $
              {paid.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              Your total contribution to the platform from all completed orders.
            </p>
          </div>
        </div>
      </div>

      {}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Top Up Wallet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Funds added will be used to automatically settle any outstanding
              commissions.
            </p>

            <div className="space-y-4 mb-8">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-2xl font-black focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="0.00"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["10", "50", "100", "200", "500", "1000"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 px-4 rounded-xl border-2 font-bold transition-all ${
                      topupAmount === amt
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400"
                        : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsTopupModalOpen(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={
                  !topupAmount ||
                  parseFloat(topupAmount) < 1 ||
                  isProcessingWallet
                }
                onClick={() => {
                  onWalletTopup && onWalletTopup(parseFloat(topupAmount));
                  setIsTopupModalOpen(false);
                }}
                className="flex-2 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {vendorToClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
              <Clock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Clear Vendor Debt?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to manually clear the outstanding debt of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {vendorToClear.storeName}
              </span>
              ?
              <br />
              <br />
              Amount:{" "}
              <span className="font-mono font-black text-rose-500">
                ${vendorToClear.outstandingCommission.toFixed(2)}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setVendorToClear(null)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearDebt && onClearDebt(vendorToClear.vendorId);
                  setVendorToClear(null);
                }}
                className="flex-2 py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Yes, Clear Debt
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="p-6 bg-slate-900 dark:bg-white rounded-3xl text-white dark:text-slate-900 flex items-center gap-6 shadow-2xl">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
          <ArrowUpRight size={28} />
        </div>
        <div>
          <h4 className="text-lg font-bold">Commission Policy</h4>
          <p className="text-sm opacity-70">
            Linking fees are calculated at 10% for COD orders. Commission
            billing is conducted on an hourly basis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommissionTabContent;
