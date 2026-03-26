"use client";

import React from "react";
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
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
          Order History
        </h3>
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
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 font-bold uppercase text-xs transition-colors">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-purple-600 dark:text-purple-400 transition-colors">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 transition-colors">
                        ${order.total.toFixed(2)}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 block transition-colors">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 font-bold text-xs uppercase tracking-wide border border-blue-200 dark:border-blue-900/50 hover:border-purple-200 dark:hover:border-purple-300 px-3 py-1.5 rounded-full transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => (
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
                        {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all">
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
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
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
