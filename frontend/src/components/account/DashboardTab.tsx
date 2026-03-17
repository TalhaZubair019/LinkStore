"use client";

import React from "react";
import { Package, Heart, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardTabProps {
  user: any;
  ordersCount: number;
  wishlistCount: number;
  cartCount: number;
  setActiveTab: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  user,
  ordersCount,
  wishlistCount,
  cartCount,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Orders"
          value={ordersCount.toString()}
          icon={<Package className="text-blue-500 dark:text-blue-400" />}
          bg="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50"
        />
        <StatCard
          label="Wishlist Items"
          value={wishlistCount.toString()}
          icon={<Heart className="text-pink-500 dark:text-pink-400" />}
          bg="bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800/50"
        />
        <StatCard
          label="Cart Items"
          value={cartCount.toString()}
          icon={<ShoppingCart className="text-orange-500 dark:text-orange-400" />}
          bg="bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/50"
        />
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
          Hello, {user?.name}!
        </h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
          From your account dashboard you can view your{" "}
          <button
            onClick={() => setActiveTab("orders")}
            className="text-purple-600 dark:text-purple-400 hover:underline font-bold transition-colors"
          >
            recent orders
          </button>
          ,{" "}
          <button
            onClick={() => setActiveTab("cart")}
            className="text-purple-600 dark:text-purple-400 hover:underline font-bold transition-colors"
          >
            items in cart
          </button>
          ,{" "}
          <button
            onClick={() => setActiveTab("wishlist")}
            className="text-purple-600 dark:text-purple-400 hover:underline font-bold transition-colors"
          >
            items in wishlist
          </button>
          {" and "}edit your{" "}
          <button
            onClick={() => setActiveTab("profile")}
            className="text-purple-600 dark:text-purple-400 hover:underline font-bold transition-colors"
          >
            account details
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default DashboardTab;
