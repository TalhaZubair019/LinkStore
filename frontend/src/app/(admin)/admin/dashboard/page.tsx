"use client";
import React from "react";
import { CheckCircle, X } from "lucide-react";
import AdminSidebar from "@/components/(admin)/admin/layout/AdminSidebar";
import DashboardHeader from "@/components/(admin)/admin/layout/DashboardHeader";
import DashboardModals from "@/components/(admin)/admin/layout/DashboardModals";

import OverviewTab from "@/components/(admin)/admin/tabs/OverviewTab";
import UsersTabContent from "@/components/(admin)/admin/tabs/UsersTabContent";
import AdminsTabContent from "@/components/(admin)/admin/tabs/AdminsTabContent";
import ActivityLogsTabContent from "@/components/(admin)/admin/tabs/ActivityLogsTabContent";
import VendorsTabContent from "@/components/(admin)/admin/tabs/VendorsTabContent";
import ProductsTabContent from "@/components/(admin)/admin/tabs/ProductsTabContent";
import OrdersTabContent from "@/components/(admin)/admin/tabs/OrdersTabContent";
import ReviewsTabContent from "@/components/(admin)/admin/tabs/ReviewsTabContent";
import CommissionTabContent from "@/components/(admin)/admin/tabs/CommissionTabContent";
import SettingsTabContent from "@/components/(admin)/admin/tabs/SettingsTabContent";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";

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
    .filter((u: any) => !u.isAdmin && !u.isVendor)
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
    .filter((u: any) => u.isAdmin)
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

  const filteredProducts = (d.stats.products || []).filter(
    (p: any) =>
      p.title?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      p.vendorStoreName?.toLowerCase().includes(d.searchTerm.toLowerCase()),
  );
  const paginatedProducts = filteredProducts.slice(
    (d.productPage - 1) * d.ITEMS_PER_PAGE,
    d.productPage * d.ITEMS_PER_PAGE,
  );
  const totalProductPages =
    Math.ceil(filteredProducts.length / d.ITEMS_PER_PAGE) || 1;

  const filteredOrders = (d.stats.recentOrders || []).filter(
    (o: any) =>
      String(o.id).toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      o.vendorStoreName?.toLowerCase().includes(d.searchTerm.toLowerCase()),
  );
  const paginatedOrders = filteredOrders.slice(
    (d.orderPage - 1) * d.ITEMS_PER_PAGE,
    d.orderPage * d.ITEMS_PER_PAGE,
  );
  const totalOrderPages =
    Math.ceil(filteredOrders.length / d.ITEMS_PER_PAGE) || 1;

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
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-8">
          <div className="hidden lg:flex mb-8 justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {d.activeTab.charAt(0).toUpperCase() +
                  d.activeTab.slice(1).replace("_", " ")}
              </h1>
              {d.activeTab === "overview" && (
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Welcome back, {d.user?.name || "Admin"}!
                </p>
              )}
            </div>
            <div className="hidden lg:block shrink-0">
              <ThemeToggle />
            </div>
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
              "products",
              "orders",
              "product_reviews",
              "store_reviews",
              "commission",
            ].includes(d.activeTab)}
            isAdminView={true}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          {d.activeTab === "overview" && (
            <OverviewTab stats={d.stats} isAdminView={true} />
          )}
          {d.activeTab === "users" && (
            <UsersTabContent
              paginatedUsers={paginatedUsers || []}
              setSelectedUser={d.setSelectedUser}
              setViewType={d.setViewType}
              setDeleteConfirm={d.setDeleteConfirm}
              onPromoteToAdmin={(id, name) => d.setPromoteConfirm({ id, name })}
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
              onUnsuspend={d.handleUnsuspendVendor}
              onClearDebt={d.handleClearCommissionDebt}
              isProcessingVendor={d.isProcessingVendor}
            />
          )}
          {d.activeTab === "logs" && d.user?.adminRole === "super_admin" && (
            <ActivityLogsTabContent />
          )}
          {d.activeTab === "products" && (
            <ProductsTabContent
              allProducts={filteredProducts || []}
              categories={d.stats.categories || []}
              setProductDeleteConfirm={() => {}}
              productPage={d.productPage}
              setProductPage={d.setProductPage}
              totalProductPages={totalProductPages}
              itemsPerPage={d.ITEMS_PER_PAGE}
              isAdminView={true}
            />
          )}
          {d.activeTab === "orders" && (
            <OrdersTabContent
              allOrders={filteredOrders || []}
              handleStatusChange={() => {}}
              requestCancelOrder={() => {}}
              setSelectedOrder={d.setSelectedOrder}
              orderPage={d.orderPage}
              setOrderPage={d.setOrderPage}
              users={d.stats.users || []}
              updatingOrderId={null}
              isAdminView={true}
              totalOrderPages={totalOrderPages}
            />
          )}
          {d.activeTab === "product_reviews" && (
            <ReviewsTabContent
              reviews={d.stats.productReviews || []}
              products={d.stats.products || []}
              users={d.stats.users || []}
              reviewPage={d.reviewPage}
              setReviewPage={d.setReviewPage}
              itemsPerPage={d.ITEMS_PER_PAGE}
              searchTerm={d.searchTerm}
              isStoreReview={false}
              onReviewDeleted={d.fetchStats}
              isAdminView={true}
            />
          )}
          {d.activeTab === "store_reviews" && (
            <ReviewsTabContent
              reviews={d.stats.storeReviews || []}
              products={d.stats.products || []}
              users={d.stats.users || []}
              reviewPage={d.reviewPage}
              setReviewPage={d.setReviewPage}
              itemsPerPage={d.ITEMS_PER_PAGE}
              searchTerm={d.searchTerm}
              isStoreReview={true}
              onReviewDeleted={d.fetchStats}
              isAdminView={true}
            />
          )}
          {d.activeTab === "commission" && (
            <CommissionTabContent
              stats={d.stats}
              isAdminView={true}
              onClearDebt={d.handleClearCommissionDebt}
            />
          )}
          {d.activeTab === "settings" && (
            <SettingsTabContent
              user={d.user}
              fetchStats={d.fetchStats}
              showToast={d.showToast}
            />
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
