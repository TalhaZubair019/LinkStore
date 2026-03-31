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
        className={`w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 min-w-[40px] rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden border border-slate-200 dark:border-slate-800">
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
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">
                Customer Account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
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
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
            {user?.isVendor && user?.vendorProfile?.status === "approved" ? (
              <Link href="/vendor/dashboard" className="block outline-none">
                <div className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all rounded-xl group">
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
              onClick={() => router.back()}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors w-full group"
              title="Back to Store"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Store</span>
            </button>
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
    </>
  );
};

export default UserSidebar;
