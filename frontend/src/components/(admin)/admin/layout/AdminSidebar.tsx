"use client";
import React from "react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  ClipboardList,
  LogOut,
  Shield,
  ScrollText,
  Store,
  ChevronLeft,
  Star,
  DollarSign,
  Settings,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";

interface AdminSidebarProps {
  user: { name: string; email?: string; adminRole?: string } | null | any;
  activeTab:
    | "overview"
    | "users"
    | "admins"
    | "vendors"
    | "logs"
    | "products"
    | "orders"
    | "product_reviews"
    | "store_reviews"
    | "commission"
    | "settings";
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      | "overview"
      | "users"
      | "admins"
      | "vendors"
      | "logs"
      | "products"
      | "orders"
      | "product_reviews"
      | "store_reviews"
      | "commission"
      | "settings"
    >
  >;
  stats: any;
  isOpen?: boolean;
  onClose?: () => void;
}

const NavButton = ({ active, onClick, icon, label, count }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-bold transition-all mb-1 relative group rounded-xl ${
      active
        ? "bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
        : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/2 border border-transparent"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
    )}
    <div className="flex items-center gap-3 truncate">
      <span
        className={`${active ? "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" : "group-hover:scale-110 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all"}`}
      >
        {React.cloneElement(icon, { size: 18 })}
      </span>
      <span className="truncate transition-opacity duration-300 font-bold uppercase tracking-tight">
        {label}
      </span>
    </div>
    {count !== undefined && count > 0 && (
      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tabular-nums transition-all ${
        active 
          ? "bg-blue-600 dark:bg-blue-500 text-white" 
          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10"
      }`}>
        {count}
      </span>
    )}
  </button>
);

const AdminSidebar = ({
  user,
  activeTab,
  setActiveTab,
  stats,
  isOpen = false,
  onClose = () => {},
}: AdminSidebarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartState");
        localStorage.removeItem("wishlistItems");
      }
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`w-64 h-screen bg-white dark:bg-[#0d0f14] border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between gap-3 h-24 relative overflow-hidden group">
          {/* Subtle Ambient Header Glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex items-center gap-4 overflow-hidden relative z-10">
            <div className="h-11 w-11 min-w-[44px] rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] dark:shadow-[0_8px_25px_rgba(37,99,235,0.2)] border border-white/20">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[14px] font-black text-slate-900 dark:text-white truncate tracking-tight">
                {user?.name || "Admin User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)] animate-pulse" />
                <p className="text-[8px] text-blue-500 uppercase tracking-[0.3em] font-black">
                  Administrator
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-6 py-4">
           <div className="h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent shadow-sm" />
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
          <NavButton
            active={activeTab === "commission"}
            onClick={() => setActiveTab("commission")}
            icon={<DollarSign size={20} />}
            label="Commissions"
          />
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Reviews & Feedback
            </p>
          </div>
          <NavButton
            active={activeTab === "product_reviews"}
            onClick={() => setActiveTab("product_reviews")}
            icon={<Star />}
            label={`Product Reviews (${stats?.productReviews?.length ?? 0})`}
          />
          <NavButton
            active={activeTab === "store_reviews"}
            onClick={() => setActiveTab("store_reviews")}
            icon={<MessageSquare />}
            label={`Store Reviews (${stats?.storeReviews?.length ?? 0})`}
          />
          {user?.adminRole === "super_admin" && (
            <NavButton
              active={activeTab === "logs"}
              onClick={() => setActiveTab("logs")}
              icon={<ScrollText />}
              label="Activity Logs"
            />
          )}
          <NavButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<Settings />}
            label="Settings"
          />
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 mt-auto bg-slate-50/30 dark:bg-white/1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-[11px] font-black text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all w-full group uppercase tracking-[0.2em] shadow-sm hover:shadow-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut
              size={18}
              strokeWidth={3}
              className="group-hover:-translate-x-1 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
