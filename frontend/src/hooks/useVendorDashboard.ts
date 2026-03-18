"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { DashboardStats, UserData, Order } from "@/app/admin/types";

export function useVendorDashboard() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "orders"
    | "products"
    | "reviews"
    | "categories"
    | "warehouses"
    | "inventory"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewType, setViewType] = useState<"cart" | "wishlist" | "both">("both");

  const ITEMS_PER_PAGE = 5;
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryDeleteConfirm, setCategoryDeleteConfirm] = useState<any>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  const [warehouseDeleteConfirm, setWarehouseDeleteConfirm] = useState<any>(null);
  const [isDeletingWarehouse, setIsDeletingWarehouse] = useState(false);

  const [productDeleteConfirm, setProductDeleteConfirm] = useState<any>(null);
  const [cancelOrderConfirm, setCancelOrderConfirm] = useState<Order | null>(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedProductForInventory, setSelectedProductForInventory] = useState<any>(null);

  const [revenueFilter, setRevenueFilter] = useState<"week" | "month" | "current-month" | "custom">("week");
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [filteredRevenueData, setFilteredRevenueData] = useState<any[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);

  const [aovFilter, setAovFilter] = useState<"week" | "month" | "current-month" | "custom">("week");
  const [showAovDropdown, setShowAovDropdown] = useState(false);
  const [aovCustomStart, setAovCustomStart] = useState("");
  const [aovCustomEnd, setAovCustomEnd] = useState("");
  const [filteredAovData, setFilteredAovData] = useState<any[]>([]);
  const [aovLoading, setAovLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [res, whRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/warehouses"),
      ]);

      if (res.ok && whRes.ok) {
        const data = await res.json();
        const whData = await whRes.json();
        const nextStats = { ...data, warehouses: whData };
        setStats(nextStats);
        setFilteredRevenueData(nextStats.revenueData);
        setFilteredAovData(nextStats.revenueData);
      }
    } catch (error) {
      console.error("Failed to fetch vendor stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const page = params.get("page");
      const validTabs = ["overview", "orders", "products", "reviews", "categories", "warehouses", "inventory"];

      if (tab && validTabs.includes(tab)) {
        setActiveTab(tab as any);
        const pageNum = Number(page) || 1;
        if (tab === "products") setProductPage(pageNum);
        if (tab === "orders") setOrderPage(pageNum);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !user.isVendor) {
      router.push("/apply-vendor");
      return;
    }
    if (user?.isVendor) {
      fetchStats();
    }
  }, [user, isAuthenticated, isAuthLoading, router, fetchStats]);

  useEffect(() => {
    if (!user?.isVendor) return;
    const interval = setInterval(() => {
      if (activeTab !== "warehouses" && activeTab !== "overview") {
        fetchStats();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [user, activeTab, fetchStats]);

  useEffect(() => {
    setSearchTerm("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (activeTab === "overview") {
        url.searchParams.delete("tab");
        url.searchParams.delete("page");
      } else {
        url.searchParams.set("tab", activeTab);
        let currentPage = 1;
        if (activeTab === "products") currentPage = productPage;
        else if (activeTab === "orders") currentPage = orderPage;

        if (currentPage > 1) {
          url.searchParams.set("page", currentPage.toString());
        } else {
          url.searchParams.delete("page");
        }
      }
      window.history.replaceState({}, "", url.toString());
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, productPage, orderPage]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchRevenueData = async (startDate: string, endDate: string) => {
    setRevenueLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setFilteredRevenueData(data.revenueData);
      }
    } catch (error) {
      console.error("Failed to fetch revenue data");
    } finally {
      setRevenueLoading(false);
    }
  };

  const fetchAovData = async (startDate: string, endDate: string) => {
    setAovLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setFilteredAovData(data.revenueData);
      }
    } catch (error) {
      console.error("Failed to fetch AOV data");
    } finally {
      setAovLoading(false);
    }
  };

  const applyRevenueFilter = (filter: "week" | "month" | "current-month" | "custom", start?: string, end?: string) => {
    const today = new Date();
    const fmt = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    if (filter === "week") {
      const s = new Date(today);
      s.setDate(s.getDate() - 6);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "month") {
      const s = new Date(today);
      s.setDate(s.getDate() - 29);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "current-month") {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "custom" && start && end) {
      fetchRevenueData(start, end);
    }
  };

  const applyAovFilter = (filter: "week" | "month" | "current-month" | "custom", start?: string, end?: string) => {
    const today = new Date();
    const fmt = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    if (filter === "week") {
      const s = new Date(today);
      s.setDate(s.getDate() - 6);
      fetchAovData(fmt(s), fmt(today));
    } else if (filter === "month") {
      const s = new Date(today);
      s.setDate(s.getDate() - 29);
      fetchAovData(fmt(s), fmt(today));
    } else if (filter === "current-month") {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      fetchAovData(fmt(s), fmt(today));
    } else if (filter === "custom" && start && end) {
      fetchAovData(start, end);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchStats();
        showToast(`Order status updated to "${newStatus}". Customer has been notified via email.`, "success");
      } else {
        showToast("Failed to update order status.", "error");
      }
    } catch (error) {
      showToast("Error updating status.", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setIsDeletingProduct(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchStats();
        setProductDeleteConfirm(null);
        showToast("Product deleted successfully.", "success");
      } else {
        showToast("Failed to delete product.", "error");
      }
    } catch {
      showToast("Error deleting product.", "error");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderConfirm) return;
    setIsCancellingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${cancelOrderConfirm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (res.ok) {
        await fetchStats();
        setCancelOrderConfirm(null);
        showToast("Order cancelled successfully.", "success");
      } else {
        showToast("Failed to cancel order.", "error");
      }
    } catch {
      showToast("Error cancelling order.", "error");
    } finally {
      setIsCancellingOrder(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setIsDeletingCategory(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchStats();
        setCategoryDeleteConfirm(null);
        showToast("Category deleted successfully.", "success");
      } else {
        showToast("Failed to delete category.", "error");
      }
    } catch {
      showToast("Error deleting category.", "error");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleDeleteWarehouse = async (id: string) => {
    setIsDeletingWarehouse(true);
    try {
      const res = await fetch(`/api/admin/warehouses/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchStats();
        setWarehouseDeleteConfirm(null);
        showToast("Warehouse deleted successfully.", "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete warehouse.", "error");
      }
    } catch {
      showToast("Error deleting warehouse.", "error");
    } finally {
      setIsDeletingWarehouse(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    stats,
    loading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    selectedOrder,
    setSelectedOrder,
    viewType,
    setViewType,
    orderPage,
    setOrderPage,
    productPage,
    setProductPage,
    isDeletingProduct,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    categoryDeleteConfirm,
    setCategoryDeleteConfirm,
    isDeletingCategory,
    isWarehouseModalOpen,
    setIsWarehouseModalOpen,
    editingWarehouse,
    setEditingWarehouse,
    warehouseDeleteConfirm,
    setWarehouseDeleteConfirm,
    isDeletingWarehouse,
    productDeleteConfirm,
    setProductDeleteConfirm,
    cancelOrderConfirm,
    setCancelOrderConfirm,
    isCancellingOrder,
    updatingOrderId,
    toast,
    setToast,
    selectedProductForInventory,
    setSelectedProductForInventory,
    revenueFilter,
    setRevenueFilter,
    showRevenueDropdown,
    setShowRevenueDropdown,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    filteredRevenueData,
    revenueLoading,
    aovFilter,
    setAovFilter,
    showAovDropdown,
    setShowAovDropdown,
    aovCustomStart,
    setAovCustomStart,
    aovCustomEnd,
    setAovCustomEnd,
    filteredAovData,
    aovLoading,
    fetchStats,
    showToast,
    applyRevenueFilter,
    applyAovFilter,
    handleStatusChange,
    handleDeleteProduct,
    handleCancelOrder,
    handleDeleteCategory,
    handleDeleteWarehouse,
    ITEMS_PER_PAGE,
  };
}
