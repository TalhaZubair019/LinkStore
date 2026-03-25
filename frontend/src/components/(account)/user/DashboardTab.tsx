"use client";

import React from "react";
import { Package, Heart, ShoppingCart, Store, ArrowRight } from "lucide-react";
import Link from "next/link";
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
      {/* Vendor Promotion Banner */}
      {!user?.isVendor && user?.vendorProfile?.status !== "pending" && (
        <div className="relative overflow-hidden bg-linear-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-950 rounded-4xl p-8 md:p-10 shadow-2xl shadow-purple-500/20 border border-white/10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                <Store size={12} /> Marketplace Seller
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Start selling with us today!
              </h2>
              <p className="text-purple-100 max-w-xl font-medium leading-relaxed">
                Join our community of successful vendors. Reach thousands of customers and grow your business with our powerful tools and support.
              </p>
            </div>
            <Link 
              href="/apply-vendor"
              className="px-8 py-4 bg-white text-purple-700 hover:bg-purple-50 font-black rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3 shrink-0"
            >
              Apply Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      )}

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
