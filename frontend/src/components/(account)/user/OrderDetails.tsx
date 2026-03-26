"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTrackingTimeline from "./OrderTrackingTimeline";
import ReviewModal from "@/components/(store)/shop/ReviewModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    vendorId?: string;
    vendorStoreName?: string;
  }[];
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    country?: string;
    address?: string;
    countryCode?: string;
    stateCode?: string;
    postcode?: string;
    phone?: string;
  };
  vendorStatuses?: { vendorId: string; status: string }[];
  trackingNumber?: string;
  trackingUrl?: string;
  trackingHistory?: { status: string; message: string; timestamp: string }[];
}

interface OrderDetailsProps {
  selectedOrder: Order;
  setSelectedOrder: (order: Order | null) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  selectedOrder,
  setSelectedOrder,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [reviewTarget, setReviewTarget] = React.useState<{
    type: "product" | "vendor";
    id: string | number;
    name: string;
    vendorId?: string;
    orderId?: string;
  } | null>(null);

  const getItemStatus = (vendorId?: string) => {
    if (!vendorId || !selectedOrder.vendorStatuses) return null;
    return selectedOrder.vendorStatuses.find((vs) => vs.vendorId === vendorId)
      ?.status;
  };

  const activeTotal = (selectedOrder.items || []).reduce((sum, item) => {
    const itemStatus = getItemStatus(item.vendorId);
    if (itemStatus === "Cancelled") return sum;
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16">
      <button
        onClick={() => setSelectedOrder(null)}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 mb-6 transition-colors group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Dashboard
      </button>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 transition-colors">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              Order Details
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {selectedOrder.date}
              </span>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Order Total
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${activeTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <OrderTrackingTimeline
            status={selectedOrder.status}
            trackingHistory={selectedOrder.trackingHistory || []}
            order={selectedOrder}
          />
        </div>
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg transition-colors">
                Items Ordered
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedOrder.items.map((item, idx) => {
                const itemStatus = getItemStatus(item.vendorId);
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 py-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 group transition-colors"
                  >
                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-xl relative overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 transition-colors">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-300 dark:text-slate-600">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold transition-colors leading-tight ${
                          itemStatus === "Cancelled"
                            ? "text-rose-500 line-through"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {item.name}{" "}
                        {itemStatus === "Cancelled" && "(Cancelled)"}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 transition-colors">
                        Qty: {item.quantity} · ${item.price} each
                      </p>
                      {itemStatus && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              itemStatus === "Delivered"
                                ? "bg-emerald-500"
                                : itemStatus === "Shipped"
                                  ? "bg-blue-500"
                                  : itemStatus === "Processing"
                                    ? "bg-amber-500"
                                    : "bg-slate-300"
                            }`}
                          />
                          <span
                            className={`${
                              itemStatus === "Cancelled"
                                ? "text-rose-500 font-bold"
                                : "text-slate-500 dark:text-slate-400"
                            } text-[10px] uppercase tracking-wider`}
                          >
                            {itemStatus} by {item.vendorStoreName || "Seller"}
                          </span>
                        </div>
                      )}

                      {itemStatus === "Delivered" && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              setReviewTarget({
                                type: "product",
                                id: item.id,
                                name: item.name,
                              })
                            }
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                          >
                            Review Product
                          </button>
                          {item.vendorId && (
                            <button
                              onClick={() =>
                                setReviewTarget({
                                  type: "vendor",
                                  id: item.vendorId!,
                                  name: item.vendorStoreName || "Seller",
                                  vendorId: item.vendorId,
                                  orderId: selectedOrder.id,
                                })
                              }
                              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-100 dark:border-amber-800/30 hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Star size={10} fill="currentColor" /> Rate Seller
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold transition-colors ${
                          itemStatus === "Cancelled"
                            ? "text-rose-500 line-through"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        $
                        {(itemStatus === "Cancelled"
                          ? 0
                          : item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center transition-colors">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">
                Grand Total
              </span>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 transition-colors">
                ${activeTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        target={reviewTarget}
        user={user}
      />
    </div>
  );
};

export default OrderDetails;
