"use client";
import React from "react";
import { CheckCircle, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import DashboardHeader from "@/components/admin/layout/DashboardHeader";
import DashboardModals from "@/components/admin/layout/DashboardModals";

import OverviewTab from "@/components/admin/tabs/OverviewTab";
import ProductsTabContent from "@/components/admin/tabs/ProductsTabContent";
import ReviewsTabContent from "@/components/admin/tabs/ReviewsTabContent";
import UsersTabContent from "@/components/admin/tabs/UsersTabContent";
import AdminsTabContent from "@/components/admin/tabs/AdminsTabContent";
import OrdersTabContent from "@/components/admin/tabs/OrdersTabContent";
import CategoriesTabContent from "@/components/admin/tabs/CategoriesTabContent";
import WarehousesTabContent from "@/components/admin/tabs/WarehousesTabContent";
import InventoryTabContent from "@/components/admin/tabs/InventoryTabContent";
import ActivityLogsTabContent from "@/components/admin/tabs/ActivityLogsTabContent";
import VendorsTabContent from "@/components/admin/tabs/VendorsTabContent";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const d = useAdminDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (d.user?.isAdmin) {
      d.fetchStats();
    }
  }, [d.activeTab, d.fetchStats]);
  React.useEffect(() => {
    const handleFocus = () => {
      if (d.user?.isAdmin) d.fetchStats();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [d.fetchStats, d.user?.isAdmin]);

  if (d.isAuthLoading || d.loading || !d.stats) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredUsers = d.stats.users
    .filter((u) => !u.isAdmin)
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(d.searchTerm.toLowerCase()),
    );
  const paginatedUsers = filteredUsers.slice(
    (d.userPage - 1) * d.ITEMS_PER_PAGE,
    d.userPage * d.ITEMS_PER_PAGE,
  );
  const totalUserPages =
    Math.ceil(filteredUsers.length / d.ITEMS_PER_PAGE) || 1;

  const filteredAdmins = d.stats.users
    .filter((u) => u.isAdmin)
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(d.searchTerm.toLowerCase()),
    );
  const paginatedAdmins = filteredAdmins.slice(
    (d.adminPage - 1) * d.ITEMS_PER_PAGE,
    d.adminPage * d.ITEMS_PER_PAGE,
  );
  const totalAdminPages =
    Math.ceil(filteredAdmins.length / d.ITEMS_PER_PAGE) || 1;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex">
      <AdminSidebar
        user={d.user}
        activeTab={d.activeTab}
        setActiveTab={(tab) => {
          d.setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        stats={d.stats}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {d.activeTab.charAt(0).toUpperCase() + d.activeTab.slice(1)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {d.user?.name || "Admin"}!
            </p>
          </div>

          <DashboardHeader
            user={d.user}
            activeTab={d.activeTab}
            setActiveTab={d.setActiveTab}
            searchTerm={d.searchTerm}
            setSearchTerm={d.setSearchTerm}
            showSearch={[
              "users",
              "admins",
            ].includes(d.activeTab)}
          />
            {d.activeTab === "overview" && (
              <OverviewTab
                stats={d.stats}
                isAdminView={true}
              />
            )}
            {d.activeTab === "users" && (
              <UsersTabContent
                paginatedUsers={paginatedUsers || []}
                setSelectedUser={d.setSelectedUser}
                setViewType={d.setViewType}
                setDeleteConfirm={d.setDeleteConfirm}
                onPromoteToAdmin={(id, name) =>
                  d.setPromoteConfirm({ id, name })
                }
                userPage={d.userPage}
                setUserPage={d.setUserPage}
                totalUserPages={totalUserPages}
                isSuperAdmin={d.user?.adminRole === "super_admin"}
              />
            )}
            {d.activeTab === "admins" && (
              <AdminsTabContent
                paginatedAdmins={paginatedAdmins || []}
                setSelectedUser={d.setSelectedUser}
                setViewType={d.setViewType}
                setDeleteConfirm={d.setDeleteConfirm}
                onRevokeAdmin={(id, name) => d.setRevokeConfirm({ id, name })}
                adminPage={d.adminPage}
                setAdminPage={d.setAdminPage}
                totalAdminPages={totalAdminPages}
                onAddAdmin={() => d.setIsAddAdminModalOpen(true)}
                isSuperAdmin={d.user?.adminRole === "super_admin"}
              />
            )}
            {d.activeTab === "vendors" && (
              <VendorsTabContent
                allUsers={d.stats.users || []}
                onApprove={d.handleApproveVendor}
                onReject={d.handleRejectVendor}
                onSuspend={d.handleSuspendVendor}
              />
            )}
            {d.activeTab === "logs" && d.user?.adminRole === "super_admin" && (
              <ActivityLogsTabContent />
            )}
        </main>
      </div>

      {d.toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
            d.toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {d.toast.type === "success" ? (
            <CheckCircle size={18} className="shrink-0" />
          ) : (
            <X size={18} className="shrink-0" />
          )}
          <span>{d.toast.message}</span>
          <button
            onClick={() => d.setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <DashboardModals
        stats={d.stats}
        fetchStats={d.fetchStats}
        showToast={d.showToast}
        isAddAdminModalOpen={d.isAddAdminModalOpen}
        setIsAddAdminModalOpen={d.setIsAddAdminModalOpen}
        selectedUser={d.selectedUser}
        setSelectedUser={d.setSelectedUser}
        viewType={d.viewType}
        deleteConfirm={d.deleteConfirm}
        setDeleteConfirm={d.setDeleteConfirm}
        handleDeleteUser={d.handleDeleteUser}
        isDeleting={d.isDeleting}
        promoteConfirm={d.promoteConfirm}
        setPromoteConfirm={d.setPromoteConfirm}
        handlePromoteToAdmin={d.handlePromoteToAdmin}
        isPromoting={d.isPromoting}
        revokeConfirm={d.revokeConfirm}
        setRevokeConfirm={d.setRevokeConfirm}
        handleRevokeAdmin={d.handleRevokeAdmin}
        isRevoking={d.isRevoking}
        selectedOrder={d.selectedOrder}
        setSelectedOrder={d.setSelectedOrder}
      />
    </div>
  );
}
