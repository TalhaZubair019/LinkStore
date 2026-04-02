"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: any[];
}

interface OrdersTabProps {
  orders: Order[];
  setSelectedOrder: (order: Order) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, setSelectedOrder }) => {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [orders, sortOrder]);
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d0f14] rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
      <div className="p-6 sm:p-8 lg:p-10 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors tracking-tight">
          Order History
        </h3>
        {orders.length > 0 && (
          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="w-full sm:w-auto bg-white dark:bg-[#0d0f14] border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer appearance-none transition-all shadow-sm hover:border-purple-200 dark:hover:border-purple-500/30"
            >
              <option value="desc" className="bg-white dark:bg-[#0d0f14]">Sort: Newest to Oldest</option>
              <option value="asc" className="bg-white dark:bg-[#0d0f14]">Sort: Oldest to Newest</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 transition-colors">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p>You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline mt-2 inline-block transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-200 font-black uppercase text-[10px] tracking-wider transition-colors border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 lg:px-10 py-5">Order ID</th>
                    <th className="px-6 lg:px-10 py-5">Date</th>
                    <th className="px-6 lg:px-10 py-5">Status</th>
                    <th className="px-6 lg:px-10 py-5">Total</th>
                    <th className="px-6 lg:px-10 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors bg-white dark:bg-transparent">
                  {sortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 lg:px-10 py-5 font-medium text-purple-600 dark:text-purple-400 transition-colors">
                        {order.id}
                      </td>
                      <td className="px-6 lg:px-10 py-5">{formatDate(order.date)}</td>
                      <td className="px-6 lg:px-10 py-5">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 lg:px-10 py-5 font-bold text-slate-800 dark:text-slate-200 transition-colors">
                        ${order.total.toFixed(2)}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 block transition-colors">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="px-6 lg:px-10 py-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-200 dark:border-blue-900/50 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5 bg-slate-50/30 dark:bg-transparent">
              {sortedOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                        Order ID
                      </p>
                      <p className="font-bold text-purple-600 dark:text-purple-400 transition-colors">
                        {order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                        Date
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-all">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">
                        Status
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">
                        Total
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white transition-colors">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 dark:bg-white border border-transparent text-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 transition-all"
                  >
                    View Order Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
