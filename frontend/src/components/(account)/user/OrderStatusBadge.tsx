"use client";

import React from "react";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const colors: { [key: string]: string } = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-amber-100 text-amber-700 font-medium",
    Accepted: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    "Arrived in Country": "bg-violet-100 text-violet-700",
    "Arrived in City": "bg-pink-100 text-pink-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
        colors[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
