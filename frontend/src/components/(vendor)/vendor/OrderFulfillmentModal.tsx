"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { 
  X, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Package, 
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OrderFulfillmentModalProps {
  order: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderFulfillmentModal({ order, onClose, onUpdate }: OrderFulfillmentModalProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(
    order.vendorStatuses?.find((vs: any) => vs.vendorId === user?.id)?.status || "Pending"
  );

  const vendorItems = order.items.filter((item: any) => item.vendorId === user?.id);
  const vendorSubtotal = vendorItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/vendor/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setStatus(newStatus);
        onUpdate();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "Pending", icon: Clock },
    { label: "Processing", value: "Processing", icon: Package },
    { label: "Shipped", value: "Shipped", icon: Truck },
    { label: "Delivered", value: "Delivered", icon: CheckCircle2 },
    { label: "Cancelled", value: "Cancelled", icon: AlertCircle }
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl pointer-events-auto border border-white/20 dark:border-slate-800 transition-colors"
      >
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order #{order.id}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Placed on {order.date}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left Column: Customer & Shipping */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                  <User size={18} />
                  <h3 className="text-sm uppercase tracking-widest font-black">Customer Information</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4 border border-slate-100 dark:border-slate-800 transition-colors">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Mail size={16} />
                      <span className="font-medium">{order.customer?.email}</span>
                    </div>
                    {order.customer?.phone && (
                      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <Phone size={16} />
                        <span className="font-medium">{order.customer?.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                  <MapPin size={18} />
                  <h3 className="text-sm uppercase tracking-widest font-black">Shipping Address</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                    {order.customer?.firstName} {order.customer?.lastName}<br />
                    {order.customer?.address}{order.customer?.apartment ? `, ${order.customer?.apartment}` : ""}<br />
                    {order.customer?.city}, {order.customer?.province} {order.customer?.postcode}<br />
                    {order.customer?.country}
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Status & Summary */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                  <Truck size={18} />
                  <h3 className="text-sm uppercase tracking-widest font-black">Fulfillment Status</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      disabled={updating}
                      onClick={() => handleStatusUpdate(opt.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        status === opt.value
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-500 dark:hover:border-blue-500"
                      } disabled:opacity-50`}
                    >
                      {updating && status === opt.value ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <opt.icon size={18} />
                      )}
                      <span className="text-sm font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                  <CreditCard size={18} />
                  <h3 className="text-sm uppercase tracking-widest font-black">Your Subtotal</h3>
                </div>
                <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-4xl text-white shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 font-bold text-sm">Items Value</span>
                    <span className="font-bold">${vendorSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                    <span className="text-white/80 font-black">Total Payout</span>
                    <span className="text-3xl font-black text-blue-400">${vendorSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <Package size={18} />
              <h3 className="text-sm uppercase tracking-widest font-black">Items to pack</h3>
            </div>
            <div className="space-y-4">
              {vendorItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="relative w-20 h-20 shrink-0 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">SKU: {item.sku || "N/A"}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)} ea</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
