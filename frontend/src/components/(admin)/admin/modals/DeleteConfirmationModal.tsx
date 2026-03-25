import React from "react";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  warning?: string;
  confirmLabel?: string;
  confirmClassName?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warning,
  confirmLabel = "Delete",
  confirmClassName = "flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700",
  icon,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200 shadow-2xl border border-white dark:border-slate-800">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
            icon
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          }`}
        >
          {icon ?? <Trash2 size={32} />}
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm transition-colors">{message}</p>
        {warning && <p className="text-slate-400 dark:text-slate-500 mb-6 text-xs transition-colors">{warning}</p>}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${confirmClassName} disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
