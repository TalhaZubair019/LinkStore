"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, ShoppingCart, LogOut, Shield } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { loginSuccess, logout } from "@/redux/AuthSlice";
import { addToCart } from "@/redux/CartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Country, State, City } from "country-state-city";
import QuickViewModal from "@/components/products/QuickViewModal";
import UserSidebar from "@/components/layout/UserSidebar";

import PageHeader from "@/components/ui/PageHeader";
import LoginForm from "@/components/account/LoginForm";
import DashboardTab from "@/components/account/DashboardTab";
import ProfileTab from "@/components/account/ProfileTab";
import OrdersTab from "@/components/account/OrdersTab";
import WishlistTab from "@/components/account/WishlistTab";
import CartTab from "@/components/account/CartTab";
import OrderDetails from "@/components/account/OrderDetails";

interface TrackingEntry {
  status: string;
  message: string;
  timestamp: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    country?: string;
    address?: string;
    countryCode?: string;
    stateCode?: string;
    postcode?: string;
    phone?: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  trackingHistory?: TrackingEntry[];
}

export default function MyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
    countryCode: "PK",
    stateCode: "",
    province: "",
    postcode: "",
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (profileForm.countryCode) {
      setStates(State.getStatesOfCountry(profileForm.countryCode));
      if (profileForm.stateCode) {
        setCities(
          City.getCitiesOfState(profileForm.countryCode, profileForm.stateCode),
        );
      }
    }
  }, [profileForm.countryCode, profileForm.stateCode]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["dashboard", "orders", "wishlist", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [searchParams, orders]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "Pakistan",
        countryCode: user.countryCode || "PK",
        stateCode: user.stateCode || "",
        province: user.province || "",
        postcode: user.postcode || "",
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/public/orders");
      if (res.ok) {
        const data = await res.json();
        const sortedOrders = (data.orders || []).sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setOrders(sortedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      if (data.user.isAdmin) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const contentArea = document.getElementById("user-content-area");
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    setActiveTab("dashboard");
    setOrders([]);
    router.push("/login");
  };

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price;
    dispatch(
      addToCart({
        id: product.id,
        name: product.title || product.name,
        price: priceVal,
        image: product.image,
        quantity: quantity,
      }),
    );
    alert(`Added ${quantity} x "${product.title || product.name}" to cart!`);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        dispatch(
          loginSuccess({ user: { ...user, ...profileForm }, token: "active" }),
        );
      }
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">
        <PageHeader title="My Account" breadcrumb="Account" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-32 pt-10">
          <LoginForm
            handleLogin={handleLogin}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">
        <PageHeader
          title={`Order #${selectedOrder.id.slice(-8).toUpperCase()}`}
          breadcrumb="Order Details"
        />
        <OrderDetails
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <PageHeader
        title={`Welcome, ${user?.name || "User"}`}
        breadcrumb="Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="lg:hidden mb-6 flex items-center justify-between bg-white dark:bg-[#0f172a] p-3 sm:p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600 border border-purple-500/20 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-purple-600/20 shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <span className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate block transition-colors">
                {user?.name || "User"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-1.5 sm:p-2 rounded-lg bg-purple-50 dark:bg-slate-800/50 hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors"
                title="Switch to Admin View"
              >
                <Shield size={16} />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1.5 sm:p-2 rounded-lg bg-red-50 dark:bg-slate-800/50 hover:bg-red-100 dark:hover:bg-slate-700 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-purple-400 text-[10px] sm:text-xs font-bold py-1.5 px-1.5 sm:py-2 sm:px-3 rounded-lg border border-slate-200 dark:border-slate-700 outline-none max-w-[90px] sm:max-w-none transition-colors"
            >
              <option value="dashboard">Dashboard</option>
              <option value="profile">Edit Profile</option>
              <option value="orders">Orders</option>
              <option value="wishlist">Wishlist</option>
              <option value="cart">Cart</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <UserSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ordersCount={orders.length}
            wishlistCount={wishlistItems.length}
            cartCount={cartItems.length}
            handleLogout={handleLogout}
          />
          <div id="user-content-area" className="lg:flex-1">
            {activeTab === "dashboard" && (
              <DashboardTab
                user={user}
                ordersCount={orders.length}
                wishlistCount={wishlistItems.length}
                cartCount={cartItems.length}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                handleUpdateProfile={handleUpdateProfile}
                countries={countries}
                states={states}
                cities={cities}
              />
            )}
            {activeTab === "orders" && (
              <OrdersTab orders={orders} setSelectedOrder={setSelectedOrder} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab
                wishlistItems={wishlistItems}
                setQuickViewProduct={setQuickViewProduct}
              />
            )}
            {activeTab === "cart" && <CartTab cartItems={cartItems} />}
          </div>
        </div>
      </div>
    </div>
  );
}
