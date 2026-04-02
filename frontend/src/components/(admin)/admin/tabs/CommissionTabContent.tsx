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
  ShieldAlert,
} from "lucide-react";

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
      <div className="space-y-10 animate-in fade-in duration-700">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Owed - Debt */}
          <div className="p-8 bg-white dark:bg-[#11141b] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-rose-600/10 transition-all duration-700" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">
                  Revenue Owed
                </h3>
                <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                  Total Outstanding
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <p className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {totalOutstanding.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-rose-600/80 dark:text-rose-400/80 text-[10px] font-black uppercase tracking-[0.2em] bg-rose-500/5 dark:bg-rose-500/10 w-fit px-3 py-1.5 rounded-xl border border-rose-500/10">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              Platform Debt
            </div>
          </div>

          {/* Success Metrics - Collected */}
          <div className="p-8 bg-white dark:bg-[#11141b] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-600/10 transition-all duration-700" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                  Success Metrics
                </h3>
                <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                  Platform Earnings
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <p className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {totalPaid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-emerald-600/80 dark:text-emerald-400/80 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500/5 dark:bg-emerald-500/10 w-fit px-3 py-1.5 rounded-xl border border-emerald-500/10">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Lifetime Reclaimed
            </div>
          </div>

          {/* Vendor Liquidity - Pool */}
          <div className="p-8 bg-white dark:bg-[#11141b] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-700" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform">
                <CreditCard size={28} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                  Vendor Liquidity
                </h3>
                <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                  Central Wallet Pool
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <p className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {totalWalletFunds.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-blue-600/80 dark:text-blue-400/80 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/5 dark:bg-blue-500/10 w-fit px-3 py-1.5 rounded-xl border border-blue-500/10">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Across all vendors
            </div>
          </div>
        </div>

        {/* Vendor Table */}
        <div className="bg-white dark:bg-[#11141b] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden group">
          <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 flex items-center justify-between relative z-10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-600 rounded-full" />
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                Vendor Commissions
              </h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              Monitoring {commissionStats.length} Vendors
            </p>
          </div>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/1 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="px-10 py-6 tracking-[0.3em]">
                    Vendor / Store
                  </th>
                  <th className="px-10 py-6 text-right tracking-[0.3em]">
                    Pending Balance
                  </th>
                  <th className="px-10 py-6 text-right tracking-[0.3em]">
                    Wallet Balance
                  </th>
                  <th className="px-10 py-6 text-right tracking-[0.3em]">
                    Settled History
                  </th>
                  <th className="px-10 py-6 text-right tracking-[0.3em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {commissionStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                        <History
                          size={48}
                          className="mb-4 opacity-10 animate-pulse"
                        />
                        <p className="text-base font-black uppercase tracking-widest italic">
                          No data found.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  commissionStats.map((v: any) => (
                    <tr
                      key={v.vendorId}
                      className="group/row hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all duration-300"
                    >
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight group-hover/row:text-blue-500 transition-colors">
                            {v.storeName}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest mt-1">
                            UID: {v.vendorId?.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            v.outstandingCommission > 0
                              ? "bg-rose-500/5 text-rose-600 border-rose-500/10 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                              : v.outstandingCommission < 0
                                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                : "bg-slate-100/50 text-slate-400 border-slate-200 dark:bg-white/5 dark:text-slate-600 dark:border-white/5"
                          }`}
                        >
                          {v.outstandingCommission < 0
                            ? `- $${Math.abs(v.outstandingCommission).toFixed(2)}`
                            : `$${v.outstandingCommission.toFixed(2)}`}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/10">
                          ${(v.walletBalance || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right font-mono text-xs font-black text-slate-500 dark:text-slate-500">
                        ${v.totalCommissionPaid.toFixed(2)}
                      </td>
                      <td className="px-10 py-6 text-right">
                        {v.outstandingCommission > 0 && onClearDebt && (
                          <button
                            onClick={() => setVendorToClear(v)}
                            className="text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 border border-transparent"
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
    <div className="max-w-5xl space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Outstanding / Credit Card */}
        <div className="relative group w-full h-full">
          <div
            className={`absolute -inset-1 bg-linear-to-br ${
              outstanding >= 0
                ? "from-rose-600 to-orange-600"
                : "from-emerald-600 to-teal-600"
            } rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000`}
          />

          <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
            <div
              className={`absolute -top-32 -right-32 w-72 h-72 ${
                outstanding >= 0 ? "bg-rose-600/10" : "bg-emerald-600/10"
              } rounded-full blur-[100px] group-hover:opacity-20 duration-700`}
            />

            <div className="flex items-start justify-between relative z-10 w-full gap-4 mb-8">
              <div className="space-y-2">
                <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  {outstanding >= 0 ? "Outstanding Debt" : "Account Credit"}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                    $
                  </span>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                    {Math.abs(outstanding).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
              </div>

              <div className="relative">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${
                    outstanding >= 0
                      ? "from-rose-600 to-orange-600"
                      : "from-emerald-600 to-teal-600"
                  } rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
                />
                <div
                  className={`p-4.5 rounded-3xl bg-linear-to-br ${
                    outstanding >= 0
                      ? "from-rose-500 to-orange-500 shadow-rose-500/30"
                      : "from-emerald-500 to-teal-500 shadow-emerald-500/30"
                  } shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20`}
                >
                  {outstanding >= 0 ? (
                    <Clock size={26} className="text-white relative z-10" />
                  ) : (
                    <CheckCircle2
                      size={26}
                      className="text-white relative z-10"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              {outstanding > 0 && onStripePay && (
                <button
                  onClick={onStripePay}
                  disabled={isProcessingStripe}
                  className="w-full px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingStripe ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  Settle Debt
                </button>
              )}
              {outstanding <= 0 && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/5 dark:bg-emerald-500/10 px-5 py-4 rounded-2xl border border-emerald-500/10">
                  <CheckCircle2 size={18} className="animate-pulse" />
                  No outstanding debt
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Wallet Funds */}
        <div className="relative group w-full h-full">
          <div className="absolute -inset-1 bg-linear-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000" />

          <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] group-hover:opacity-20 duration-700" />

            <div className="flex items-start justify-between relative z-10 w-full gap-4 mb-8">
              <div className="space-y-2">
                <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Available Credit
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                    $
                  </span>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                    {wallet.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="p-4.5 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20">
                  <DollarSign size={26} className="text-white relative z-10" />
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <button
                onClick={() => setIsTopupModalOpen(true)}
                disabled={isProcessingWallet}
                className="w-full px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingWallet ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
                Initialize Top-up
              </button>
            </div>
          </div>
        </div>

        {/* Track Record Stats */}
        <div className="relative group w-full h-full">
          <div className="absolute -inset-1 bg-linear-to-br from-emerald-600 to-teal-600 rounded-[2.5rem] opacity-0 blur-xl group-hover:opacity-15 transition-all duration-1000" />

          <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1.5 group-hover:shadow-2xl">
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-emerald-600/10 rounded-full blur-[100px] group-hover:opacity-20 duration-700" />

            <div className="flex items-start justify-between relative z-10 w-full gap-4 mb-8">
              <div className="space-y-2">
                <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Track Record
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-400 dark:text-slate-600">
                    $
                  </span>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                    {paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-teal-600 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="p-4.5 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out shrink-0 ring-1 ring-white/20">
                  <History size={26} className="text-white relative z-10" />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-col gap-2 mt-auto">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Legacy Registry
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed bg-slate-50 dark:bg-white/3 p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors uppercase tracking-tight">
                Total contribution to the platform from all completed orders.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-up Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#11141b] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 dark:border-white/5 animate-out fade-out slide-out-to-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  Top-up Wallet
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  Funds added will be used to automatically settle any
                  outstanding commissions.
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  $
                </span>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full pl-12 pr-6 py-6 bg-slate-50 dark:bg-white/3 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-3xl font-black focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="0.00"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["10", "50", "100", "200", "500", "1000"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopupAmount(amt)}
                    className={`py-3 px-4 rounded-xl border-2 text-[11px] font-black uppercase tracking-widest transition-all ${
                      topupAmount === amt
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200 dark:hover:border-blue-500/20"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsTopupModalOpen(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
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
                className="flex-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Debt Modal */}
      {vendorToClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#11141b] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 dark:border-white/5">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-4xl flex items-center justify-center text-rose-500 mb-8 mx-auto shadow-lg shadow-rose-500/10">
              <Clock size={40} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 text-center uppercase tracking-tight">
              Clear Vendor Debt?
            </h3>
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-10">
              Are you sure you want to manually clear the outstanding debt of{" "}
              <span className="text-slate-800 dark:text-white font-black uppercase tracking-tight">
                {vendorToClear.storeName}
              </span>
              ?
              <br />
              <span className="text-2xl font-black text-rose-500 mt-4 block">
                ${vendorToClear.outstandingCommission.toFixed(2)}
              </span>
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setVendorToClear(null)}
                className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearDebt && onClearDebt(vendorToClear.vendorId);
                  setVendorToClear(null);
                }}
                className="flex-2 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Yes, Clear Debt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Card */}
      <div className="relative group p-10 rounded-[2.5rem] bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex items-center gap-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]" />

        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white border border-white/20 shadow-2xl relative z-10">
            <ShieldAlert size={36} />
          </div>
        </div>

        <div className="relative z-10">
          <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">
            Matrix Protocol
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-2xl uppercase tracking-tighter opacity-80">
            Linking fees are calculated at 10% for COD orders. Commission
            billing is conducted on an hourly basis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommissionTabContent;
