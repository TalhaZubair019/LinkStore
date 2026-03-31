import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ClipboardList,
  Tag,
  Building2,
  Boxes,
  Shield,
  UserIcon,
  ChevronLeft,
  LogOut,
  Settings,
  DollarSign,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";

interface VendorSidebarProps {
  user?: any;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  stats?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

const NavButton = ({ active, onClick, icon, label, count }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all mb-1 relative group rounded-xl ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`}
  >
    <div className="flex items-center gap-3 truncate">
      <span
        className={`${active ? "text-white" : "group-hover:scale-110 transition-transform"}`}
      >
        {React.cloneElement(icon, { size: 20 })}
      </span>
      <span className="truncate transition-opacity duration-300 font-medium">
        {label} {count !== undefined && count > 0 ? `(${count})` : ""}
      </span>
    </div>
  </button>
);

export default function VendorSidebar({
  user: initialUser,
  activeTab: initialActiveTab,
  setActiveTab,
  stats: initialStats,
  isOpen = false,
  onClose = () => {},
}: VendorSidebarProps) {
  const pathname = usePathname();
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);

  const user = initialUser || reduxUser;
  const activeTab = initialActiveTab || "overview";
  const stats = initialStats || {};

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
      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 h-24">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 min-w-[40px] rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.vendorProfile?.storeName?.[0]?.toUpperCase() ||
                user?.name?.[0]?.toUpperCase() ||
                "V"}
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
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <nav className="flex-1 px-2 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden pt-4">
          <NavButton
            active={activeTab === "overview"}
            onClick={() => {
              setActiveTab && setActiveTab("overview");
              onClose();
            }}
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <NavButton
            active={activeTab === "products"}
            onClick={() => {
              setActiveTab && setActiveTab("products");
              onClose();
            }}
            icon={<Package />}
            label="Products"
            count={stats.products?.length || stats.totalProducts}
          />
          <NavButton
            active={activeTab === "reviews"}
            onClick={() => {
              setActiveTab && setActiveTab("reviews");
              onClose();
            }}
            icon={<MessageSquare />}
            label="Product Reviews"
            count={
              (stats.reviews || []).filter(
                (r: any) => r.targetType === "product",
              ).length
            }
          />
          <NavButton
            active={activeTab === "store_reviews"}
            onClick={() => {
              setActiveTab && setActiveTab("store_reviews");
              onClose();
            }}
            icon={<Shield />}
            label="Store Reviews"
            count={stats.storeReviews?.length}
          />
          <NavButton
            active={activeTab === "orders"}
            onClick={() => {
              setActiveTab && setActiveTab("orders");
              onClose();
            }}
            icon={<ClipboardList />}
            label="Orders"
            count={stats.totalOrders || stats.recentOrders?.length}
          />
          <NavButton
            active={activeTab === "categories"}
            onClick={() => {
              setActiveTab && setActiveTab("categories");
              onClose();
            }}
            icon={<Tag />}
            label="Categories"
            count={
              new Set(stats.products?.map((p: any) => p.category)).size ||
              stats.categories?.length
            }
          />
          <NavButton
            active={activeTab === "warehouses"}
            onClick={() => {
              setActiveTab && setActiveTab("warehouses");
              onClose();
            }}
            icon={<Building2 />}
            label="Warehouses"
            count={stats.warehouses?.length}
          />
          <NavButton
            active={activeTab === "inventory"}
            onClick={() => {
              setActiveTab && setActiveTab("inventory");
              onClose();
            }}
            icon={<Boxes />}
            label="Inventory"
            count={
              (stats.products || []).filter((p: any) => p.stock < 10).length ||
              undefined
            }
          />
          <NavButton
            active={activeTab === "commission"}
            onClick={() => {
              setActiveTab && setActiveTab("commission");
              onClose();
            }}
            icon={<DollarSign />}
            label="Commissions"
          />
          <NavButton
            active={activeTab === "settings"}
            onClick={() => {
              setActiveTab && setActiveTab("settings");
              onClose();
            }}
            icon={<Settings />}
            label="Settings"
          />
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
    </>
  );
}
