"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, ShoppingCart, LogOut, Shield } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { loginSuccess, logout } from "@/redux/slices/authSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Country, State, City } from "country-state-city";
import QuickViewModal from "@/components/(store)/products/QuickViewModal";
import UserSidebar from "@/components/(account)/user/UserSidebar";

import PageHeader from "@/components/ui/PageHeader";
import LoginForm from "@/components/(account)/user/LoginForm";
import DashboardTab from "@/components/(account)/user/DashboardTab";
import ProfileTab from "@/components/(account)/user/ProfileTab";
import OrdersTab from "@/components/(account)/user/OrdersTab";
import WishlistTab from "@/components/(account)/user/WishlistTab";
import CartTab from "@/components/(account)/user/CartTab";
import OrderDetails from "@/components/(account)/user/OrderDetails";

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
      <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to manage your link store</p>
        </div>
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex">
        <UserSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={orders.length}
          wishlistCount={wishlistItems.length}
          cartCount={cartItems.length}
          handleLogout={handleLogout}
        />
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 p-6 lg:p-8 pt-8">
            <div className="mb-8">
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Order #{selectedOrder!.id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <OrderDetails
              selectedOrder={selectedOrder!}
              setSelectedOrder={setSelectedOrder}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <UserSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        wishlistCount={wishlistItems.length}
        cartCount={cartItems.length}
        handleLogout={handleLogout}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <div className="lg:hidden mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20 shrink-0">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate block">
                  {user?.name || "User"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {user?.isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-slate-800/50 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
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
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-blue-400 text-[10px] sm:text-xs font-bold py-1.5 px-1.5 sm:py-2 sm:px-3 rounded-lg border border-slate-200 dark:border-slate-700 outline-none max-w-[90px] sm:max-w-none transition-colors"
              >
                <option value="dashboard">Dashboard</option>
                <option value="profile">Edit Profile</option>
                <option value="orders">Orders</option>
                <option value="wishlist">Wishlist</option>
                <option value="cart">Cart</option>
              </select>
            </div>
          </div>

          <div id="user-content-area" className="w-full">
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
        </main>
      </div>
    </div>
  );
}
