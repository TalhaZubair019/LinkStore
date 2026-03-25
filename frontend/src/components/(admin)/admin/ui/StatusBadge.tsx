import React from "react";
import { Clock, Package, CheckCircle, X, LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<
    string,
    { bg: string; text: string; border: string; icon: LucideIcon | null }
  > = {
    Pending: {
      bg: "bg-linear-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-800",
      icon: Clock,
    },
    Accepted: {
      bg: "bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-300 dark:border-blue-800",
      icon: Package,
    },
    Completed: {
      bg: "bg-linear-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-300 dark:border-emerald-800",
      icon: CheckCircle,
    },
    Cancelled: {
      bg: "bg-linear-to-r from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/40",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-300 dark:border-rose-800",
      icon: X,
    },
  };

  const config = styles[status] || {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    icon: null,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${config.bg} ${config.text} ${config.border}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
