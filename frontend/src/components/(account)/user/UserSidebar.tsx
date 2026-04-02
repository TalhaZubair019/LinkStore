"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Shield,
  Store,
  ChevronLeft,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

interface UserSidebarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ordersCount: number;
  wishlistCount: number;
  cartCount: number;
  handleLogout: () => void;
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
      <span
        className={`px-2 py-0.5 rounded-lg text-[9px] font-black tabular-nums transition-all ${
          active
            ? "bg-blue-600 dark:bg-blue-500 text-white"
            : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10"
        }`}
      >
        {count}
      </span>
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
  isOpen = false,
  onClose = () => {},
}: UserSidebarProps) => {
  const router = useRouter();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`w-64 h-screen bg-white dark:bg-[#0d0f14] border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between gap-3 h-24 relative overflow-hidden group">
          {/* Subtle Ambient Header Glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="flex items-center gap-4 overflow-hidden relative z-10">
            <div className="h-11 w-11 min-w-[44px] rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] dark:shadow-[0_8px_25px_rgba(37,99,235,0.2)] border border-white/20 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[14px] font-black text-slate-900 dark:text-white truncate tracking-tight">
                {user?.name || "Customer"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)] animate-pulse" />
                <p className="text-[8px] text-blue-500 uppercase tracking-[0.3em] font-black">
                  Customer Account
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent shadow-sm" />
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
            label="Orders"
            count={ordersCount}
          />
          <NavButton
            active={activeTab === "wishlist"}
            onClick={() => setActiveTab("wishlist")}
            icon={<Heart />}
            label="Wishlist"
            count={wishlistCount}
          />
          <NavButton
            active={activeTab === "cart"}
            onClick={() => setActiveTab("cart")}
            icon={<ShoppingCart />}
            label="Cart"
            count={cartCount}
          />
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
            {user?.isVendor && user?.vendorProfile?.status === "approved" ? (
              <Link href="/vendor/dashboard" className="block outline-none">
                <div className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-white/5 transition-all rounded-xl group">
                  <Store
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>Vendor Dashboard</span>
                </div>
              </Link>
            ) : user?.vendorProfile?.status === "pending" &&
              user?.vendorProfile?.storeName ? (
              <div className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed">
                <Clock size={20} />
                <span>Application Pending</span>
              </div>
            ) : user?.vendorProfile?.status === "rejected" ? (
              <Link href="/apply-vendor" className="block outline-none group">
                <div className="w-full p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 transition-all hover:bg-rose-100 dark:hover:bg-rose-900/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-500 rounded-lg text-white">
                      <AlertCircle size={18} />
                    </div>
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                      Application Rejected
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600/70 dark:text-rose-400/60 leading-relaxed mb-3">
                    Your store application was rejected. Please check your email
                    for details.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                    <span>Re-apply Now</span>
                    <ChevronLeft size={14} className="rotate-180" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/apply-vendor" className="block outline-none">
                <div className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-lg shadow-purple-600/20 transition-all group scale-95 hover:scale-100 origin-left">
                  <Store
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span>Become a Seller</span>
                </div>
              </Link>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 mt-auto bg-slate-50/30 dark:bg-white/1">
          <div className="space-y-2">
            {user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-4 px-4 py-2 text-[11px] font-black text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all w-full group uppercase tracking-widest"
                title="Switch to Admin View"
              >
                <Shield
                  size={16}
                  strokeWidth={2.5}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Admin View</span>
              </Link>
            )}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-4 px-4 py-3 text-[11px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all w-full group uppercase tracking-widest border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              title="Back to Store"
            >
              <ChevronLeft
                size={18}
                strokeWidth={2.5}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Store</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-3 text-[11px] font-black text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all w-full group uppercase tracking-[0.2em] shadow-sm hover:shadow-red-500/10 border border-transparent hover:border-red-500/20"
              title="Logout"
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
      </div>
    </>
  );
};

export default UserSidebar;
