"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { DashboardStats, UserData, Order } from "@/app/(admin)/admin/types";

export function useAdminDashboard() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "admins" | "vendors" | "logs" | "products" | "orders" | "product_reviews" | "store_reviews" | "commission" | "settings"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewType, setViewType] = useState<"cart" | "wishlist" | "both">("both");

  const ITEMS_PER_PAGE = 50;
  const [userPage, setUserPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [promoteConfirm, setPromoteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<{ id: string; name: string } | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isProcessingVendor, setIsProcessingVendor] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const page = params.get("page");
      const validTabs = ["overview", "users", "admins", "vendors", "logs", "products", "orders", "product_reviews", "store_reviews", "commission", "settings"];

      if (tab && validTabs.includes(tab)) {
        setActiveTab(tab as any);
        const pageNum = Number(page) || 1;
        if (tab === "users") setUserPage(pageNum);
        if (tab === "admins") setAdminPage(pageNum);
        if (tab === "products") setProductPage(pageNum);
        if (tab === "orders") setOrderPage(pageNum);
        if (tab === "product_reviews" || tab === "store_reviews") setReviewPage(pageNum);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !user.isAdmin) {
      router.push("/user");
      return;
    }
    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user, isAuthenticated, isAuthLoading, router, fetchStats]);

  useEffect(() => {
    if (!user?.isAdmin || activeTab === "overview") return;
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [user, activeTab, fetchStats]);

  useEffect(() => {
    setSearchTerm("");
    setDeleteConfirm(null);
    setPromoteConfirm(null);
    setRevokeConfirm(null);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (activeTab === "overview") {
        url.searchParams.delete("tab");
        url.searchParams.delete("page");
      } else {
        url.searchParams.set("tab", activeTab);
        let currentPage = 1;
        if (activeTab === "users") currentPage = userPage;
        else if (activeTab === "admins") currentPage = adminPage;
        else if (activeTab === "products") currentPage = productPage;
        else if (activeTab === "orders") currentPage = orderPage;
        else if (activeTab === "product_reviews" || activeTab === "store_reviews") currentPage = reviewPage;

        if (currentPage > 1) {
          url.searchParams.set("page", currentPage.toString());
        } else {
          url.searchParams.delete("page");
        }
      }
      window.history.replaceState({}, "", url.toString());
    }

    const contentArea = document.getElementById("admin-content-area");
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab, userPage, adminPage, productPage, orderPage]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchStats();
        setDeleteConfirm(null);
        showToast("User deleted successfully.", "success");
      } else {
        showToast("Failed to delete user.", "error");
      }
    } catch {
      showToast("Error deleting user.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    setIsPromoting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: true }),
      });
      if (res.ok) {
        fetchStats();
        setPromoteConfirm(null);
        showToast(`${promoteConfirm?.name} has been promoted to Admin.`, "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to promote user.", "error");
      }
    } catch {
      showToast("Error promoting user.", "error");
    } finally {
      setIsPromoting(false);
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    setIsRevoking(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: false }),
      });
      if (res.ok) {
        fetchStats();
        setRevokeConfirm(null);
        showToast(`${revokeConfirm?.name}'s admin access has been revoked.`, "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to revoke admin.", "error");
      }
    } catch {
      showToast("Error revoking admin.", "error");
    } finally {
      setIsRevoking(false);
    }
  };

  const handleApproveVendor = async (userId: string) => {
    setIsProcessingVendor({ id: userId, action: "approve" });
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve-vendor`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchStats();
        showToast("Vendor application approved successfully.", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to approve vendor.", "error");
      }
    } catch {
      showToast("Error approving vendor.", "error");
    } finally {
      setIsProcessingVendor(null);
    }
  };

  const handleRejectVendor = async (userId: string) => {
    setIsProcessingVendor({ id: userId, action: "reject" });
    try {
      const res = await fetch(`/api/admin/users/${userId}/reject-vendor`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchStats();
        showToast("Vendor application rejected.", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to reject application.", "error");
      }
    } catch {
      showToast("Error rejecting application.", "error");
    } finally {
      setIsProcessingVendor(null);
    }
  };

  const handleSuspendVendor = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend-vendor`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchStats();
        showToast("Vendor account suspended.", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to suspend account.", "error");
      }
    } catch {
      showToast("Error suspending account.", "error");
    }
  };

  const handleUnsuspendVendor = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/unsuspend-vendor`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchStats();
        showToast("Vendor account unsuspended successfully.", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to unsuspend account.", "error");
      }
    } catch {
      showToast("Error unsuspending account.", "error");
    }
  };

  const handleClearCommissionDebt = async (vendorId: string) => {
    try {
      const res = await fetch("/api/admin/clear-commission-debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId }),
      });
      if (res.ok) {
        fetchStats();
        showToast("Commission debt cleared successfully.", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to clear commission debt.", "error");
      }
    } catch {
      showToast("Error clearing commission debt.", "error");
    }
  };

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    stats,
    loading,
    mounted,
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
    userPage,
    setUserPage,
    adminPage,
    setAdminPage,
    productPage,
    setProductPage,
    orderPage,
    setOrderPage,
    reviewPage,
    setReviewPage,
    deleteConfirm,
    setDeleteConfirm,
    isAddAdminModalOpen,
    setIsAddAdminModalOpen,
    promoteConfirm,
    setPromoteConfirm,
    revokeConfirm,
    setRevokeConfirm,
    isDeleting,
    isPromoting,
    isRevoking,
    isProcessingVendor,
    toast,
    setToast,
    fetchStats,
    showToast,
    handleDeleteUser,
    handlePromoteToAdmin,
    handleRevokeAdmin,
    handleApproveVendor,
    handleRejectVendor,
    handleSuspendVendor,
    handleUnsuspendVendor,
    handleClearCommissionDebt,
    ITEMS_PER_PAGE,
  };
}
