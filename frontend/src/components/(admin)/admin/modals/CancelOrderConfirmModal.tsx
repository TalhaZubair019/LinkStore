import React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Clock,
  MapPin,
  Package,
  User,
  X,
  Loader2,
} from "lucide-react";
import { Order } from "@/app/(admin)/admin/types";

interface CancelOrderConfirmModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const CancelOrderConfirmModal = ({
  isOpen,
  order,
  onClose,
  onConfirm,
  isLoading,
}: CancelOrderConfirmModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 border border-transparent dark:border-slate-800">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Close Button (Desktop) */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors hidden sm:flex disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Fixed Header */}
        <div className="px-4 sm:px-6 pt-2 sm:pt-6 pb-4 flex flex-col items-center text-center shrink-0 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-500/5">
            <AlertTriangle className="w-7 h-7 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            Cancel Order?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px]">
            This action will stop the delivery process and notify the customer.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 scrollbar-hide space-y-5">
          {/* Main Info Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                  <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Order ID
                  </div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    #{order.id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  ${order.total?.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Customer
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {order.customer?.name || "Deleted User"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Date
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Shipping Location
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {order.customer?.address
                    ? `${order.customer.address}, ${order.customer.city}`
                    : "Default Address"}
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Order Items
              </span>
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md">
                {order.items?.length || 0}
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Package className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-3 sm:p-4 border border-red-100 dark:border-red-500/20 flex gap-3 items-start">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              <strong>Warning:</strong> Cancelling an order is permanent. This
              will notify the customer and adjust your statistics immediately.
            </p>
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col-reverse sm:flex-row gap-3 shrink-0 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 relative px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 overflow-hidden flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Yes, Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderConfirmModal;
