"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  ClipboardList,
  User as UserIcon,
  LogOut,
  Shield,
  Tag,
  ScrollText,
  Building2,
  Boxes,
  Store,
  ChevronLeft,
} from "lucide-react";

interface AdminSidebarProps {
  user: { name: string; email?: string; adminRole?: string } | null | any;
  activeTab: "overview" | "users" | "admins" | "vendors" | "logs" | "products" | "orders";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"overview" | "users" | "admins" | "vendors" | "logs" | "products" | "orders">
  >;
  stats: any;
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all mb-1 relative group rounded-xl ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`}
  >
    <span
      className={`${active ? "text-white" : "group-hover:scale-110 transition-transform"}`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </span>
    <span className="truncate transition-opacity duration-300 font-medium">
      {label}
    </span>
  </button>
);

const AdminSidebar = ({
  user,
  activeTab,
  setActiveTab,
  stats,
}: AdminSidebarProps) => {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/api/auth/logout";
    }
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 h-24">
        <div className="h-10 w-10 min-w-[40px] rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {user?.name || "Admin User"}
          </p>
          <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">
            Administrator
          </p>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden pt-4">
        <NavButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
          icon={<Users />}
          label={`Users (${stats?.users?.filter((u: any) => !u.isAdmin && !u.isVendor).length ?? 0})`}
        />
        <NavButton
          active={activeTab === "admins"}
          onClick={() => setActiveTab("admins")}
          icon={<Shield />}
          label={`Admins (${stats?.users?.filter((u: any) => u.isAdmin).length ?? 0})`}
        />
        <NavButton
          active={activeTab === "vendors"}
          onClick={() => setActiveTab("vendors")}
          icon={<Store />}
          label={`Vendors (${stats?.totalVendors ?? 0})`}
        />
        <NavButton
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          icon={<Package />}
          label={`Products (${stats?.products?.length ?? 0})`}
        />
        <NavButton
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
          icon={<ClipboardList />}
          label={`Orders (${stats?.totalOrders ?? 0})`}
        />
        {user?.adminRole === "super_admin" && (
          <NavButton
            active={activeTab === "logs"}
            onClick={() => setActiveTab("logs")}
            icon={<ScrollText />}
            label="Activity Logs"
          />
        )}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <div className="space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full group"
            title="Logout"
          >
            <LogOut
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
