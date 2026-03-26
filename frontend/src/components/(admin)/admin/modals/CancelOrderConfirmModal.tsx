import React from "react";
import Image from "next/image";
import { AlertTriangle, Clock, MapPin, Package, User } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200">
        <div className="bg-red-50 dark:bg-red-950/20 p-6 sm:p-8 flex flex-col items-center text-center shrink-0 transition-colors">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50 dark:ring-red-900/20">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2 transition-colors">
            Cancel Order
          </h2>
          <p className="text-red-700 dark:text-red-400 font-medium transition-colors">
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </p>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
                  <Package className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                    Order ID
                  </div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors">
                    #{order.id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 transition-colors">
                    <User className="w-3 h-3" /> Customer
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                    {order.customer?.name || "Deleted User"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 transition-colors">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                    {order.customer?.address ? (
                      <>
                        {order.customer.address}
                        <br />
                        {order.customer.city && order.customer.country
                          ? `${order.customer.city}, ${order.customer.country}`
                          : order.customer.city || order.customer.country || ""}
                      </>
                    ) : (
                      "Unknown Location"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Date
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-1">
                    Total Amount
                  </div>
                  <div className="text-sm font-bold text-red-600">
                    ${order.total?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                Order Items ({order.items?.length || 0})
              </div>
              <div className="divide-y divide-slate-50 overflow-y-auto max-h-40">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg relative overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center transition-colors">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0 transition-colors">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/40 flex gap-3 text-amber-800 dark:text-amber-300 text-sm font-medium transition-colors">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>
                Cancelling an order will halt its delivery process, send a
                cancellation email to the customer, and deduct its total from
                your revenue statistics.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-3 sm:justify-end shrink-0 transition-colors">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="relative px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 overflow-hidden w-full sm:w-auto shadow-sm shadow-red-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
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
