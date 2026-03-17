"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Heart,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Shield,
} from "lucide-react";

interface UserSidebarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ordersCount: number;
  wishlistCount: number;
  cartCount: number;
  handleLogout: () => void;
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all mb-1 relative group ${
      active
        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 dark:bg-purple-500 rounded-r" />
    )}
    <span
      className={`${active ? "text-purple-600 dark:text-purple-400" : "group-hover:scale-110 transition-transform"}`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </span>
    <span className="truncate transition-opacity duration-300">{label}</span>

    {active && (
      <span className="absolute right-4 w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
    )}
  </button>
);

const UserSidebar = ({
  user,
  activeTab,
  setActiveTab,
  ordersCount,
  wishlistCount,
  cartCount,
  handleLogout,
}: UserSidebarProps) => {
  return (
    <div className="transition-all duration-300 ease-in-out shrink-0 sticky top-24 h-[calc(100vh-120px)] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex-col overflow-hidden scrollbar-hide z-40 w-64 hidden lg:flex">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/50 mb-4 h-24">
        <div className="h-10 w-10 min-w-[40px] rounded-full bg-purple-600 border border-purple-500/20 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-600/20">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {user?.name || "User"}
          </p>
          <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">
            Customer Account
          </p>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden">
        <NavButton
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          icon={<UserIcon />}
          label="Edit Profile"
        />
        <NavButton
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
          icon={<Package />}
          label={`Orders (${ordersCount})`}
        />
        <NavButton
          active={activeTab === "wishlist"}
          onClick={() => setActiveTab("wishlist")}
          icon={<Heart />}
          label={`Wishlist (${wishlistCount})`}
        />
        <NavButton
          active={activeTab === "cart"}
          onClick={() => setActiveTab("cart")}
          icon={<ShoppingCart />}
          label={`Cart (${cartCount})`}
        />
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <div className="space-y-1">
          {user?.isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors w-full"
              title="Switch to Admin View"
            >
              <Shield size={16} />
              <span>Switch to Admin View</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full"
            title="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
