import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { LayoutDashboard, Package, MessageSquare, ClipboardList, Tag, Building2, Boxes, Shield, UserIcon, ChevronLeft, LogOut } from "lucide-react";

interface VendorSidebarProps {
  user?: any;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  stats?: any;
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
    <span className="truncate transition-opacity duration-300 font-medium">{label}</span>
  </button>
);

export default function VendorSidebar({
  user: initialUser,
  activeTab: initialActiveTab,
  setActiveTab,
  stats: initialStats,
}: VendorSidebarProps) {
  const pathname = usePathname();
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);

  const user = initialUser || reduxUser;

  const activeTab = initialActiveTab || "overview";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/api/auth/logout";
    }
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 h-24">
        <div className="h-10 w-10 min-w-[40px] rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
          {user?.vendorProfile?.storeName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "V"}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {user?.vendorProfile?.storeName || user?.name || "Vendor"}
          </p>
          <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">
            Vendor Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden pt-4">
        <NavButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab && setActiveTab("overview")}
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavButton
          active={activeTab === "products"}
          onClick={() => setActiveTab && setActiveTab("products")}
          icon={<Package />}
          label="Products"
        />
        <NavButton
          active={activeTab === "reviews"}
          onClick={() => setActiveTab && setActiveTab("reviews")}
          icon={<MessageSquare />}
          label="Reviews"
        />
        <NavButton
          active={activeTab === "orders"}
          onClick={() => setActiveTab && setActiveTab("orders")}
          icon={<ClipboardList />}
          label="Orders"
        />
        <NavButton
          active={activeTab === "categories"}
          onClick={() => setActiveTab && setActiveTab("categories")}
          icon={<Tag />}
          label="Categories"
        />
        <NavButton
          active={activeTab === "warehouses"}
          onClick={() => setActiveTab && setActiveTab("warehouses")}
          icon={<Building2 />}
          label="Warehouses"
        />
        <NavButton
          active={activeTab === "inventory"}
          onClick={() => setActiveTab && setActiveTab("inventory")}
          icon={<Boxes />}
          label="Inventory"
        />
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <div className="space-y-1">
          {user?.isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors w-full"
              title="Admin Dashboard"
            >
              <Shield size={16} />
              <span>Admin Dashboard</span>
            </Link>
          )}
          <Link
            href="/user"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors w-full"
            title="Switch Dashboard"
          >
            <UserIcon size={16} />
            <span>Switch Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors w-full group"
            title="Back to Store"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full group"
            title="Logout"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
