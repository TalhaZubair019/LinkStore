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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 dark:from-slate-950 dark:via-purple-900/10 dark:to-slate-950 font-sans transition-colors duration-300">
        <PageHeader
          title={
            d.mounted ? `Welcome, ${d.user?.name || "Admin"}` : "Admin Panel"
          }
          breadcrumb="Dashboard"
        />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-32 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
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
  const filteredOrders = d.stats.recentOrders.filter(
    (o) =>
      o.id?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      o.status?.toLowerCase().includes(d.searchTerm.toLowerCase()),
  );

  const filteredProducts = d.stats.products.filter((p) => {
    const s = d.searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(s) ||
      p.sku?.toLowerCase().includes(s) ||
      p.category?.toLowerCase().includes(s)
    );
  });
  const filteredReviews = d.stats.reviews.filter(
    (r) =>
      r.userName?.toLowerCase().includes(d.searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(d.searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 font-sans text-slate-800 dark:text-slate-200">
      <PageHeader
        title={
          d.mounted ? `Welcome, ${d.user?.name || "Admin"}` : "Admin Panel"
        }
        breadcrumb="Dashboard"
      />
      <div className="max-w-full mx-auto px-4 lg:px-6 pt-8 pb-12">
        <DashboardHeader
          user={d.user}
          activeTab={d.activeTab}
          setActiveTab={d.setActiveTab}
          searchTerm={d.searchTerm}
          setSearchTerm={d.setSearchTerm}
          showSearch={[
            "users",
            "admins",
            "orders",
            "products",
            "reviews",
          ].includes(d.activeTab)}
        />

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          <AdminSidebar
            user={d.user}
            activeTab={d.activeTab}
            setActiveTab={(tab) => {
              d.setActiveTab(tab);
              setIsSidebarOpen(false);
            }}
            stats={d.stats}
          />

          <div id="admin-content-area" className="flex-1 w-full lg:min-w-0 max-w-full overflow-x-hidden pb-10">
            {d.activeTab === "overview" && (
              <OverviewTab
                stats={d.stats}
                filteredRevenueData={d.filteredRevenueData}
                showRevenueDropdown={d.showRevenueDropdown}
                setShowRevenueDropdown={d.setShowRevenueDropdown}
                revenueFilter={d.revenueFilter}
                setRevenueFilter={d.setRevenueFilter}
                applyRevenueFilter={d.applyRevenueFilter}
                customStart={d.customStart}
                setCustomStart={d.setCustomStart}
                customEnd={d.customEnd}
                setCustomEnd={d.setCustomEnd}
                revenueLoading={d.revenueLoading}
                filteredAovData={d.filteredAovData}
                showAovDropdown={d.showAovDropdown}
                setShowAovDropdown={d.setShowAovDropdown}
                aovFilter={d.aovFilter}
                setAovFilter={d.setAovFilter}
                applyAovFilter={d.applyAovFilter}
                aovCustomStart={d.aovCustomStart}
                setAovCustomStart={d.setAovCustomStart}
                aovCustomEnd={d.aovCustomEnd}
                setAovCustomEnd={d.setAovCustomEnd}
                aovLoading={d.aovLoading}
              />
            )}
            {d.activeTab === "products" && (
              <ProductsTabContent
                allProducts={filteredProducts || []}
                categories={d.stats.categories || []}
                setProductDeleteConfirm={d.setProductDeleteConfirm}
                productPage={d.productPage}
                setProductPage={d.setProductPage}
              />
            )}
            {d.activeTab === "reviews" && (
              <ReviewsTabContent
                onReviewDeleted={d.fetchStats}
                reviews={filteredReviews || []}
                products={d.stats.products}
                users={d.stats.users}
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
            {d.activeTab === "orders" && (
              <OrdersTabContent
                allOrders={filteredOrders || []}
                handleStatusChange={d.handleStatusChange}
                requestCancelOrder={d.setCancelOrderConfirm}
                setSelectedOrder={d.setSelectedOrder}
                orderPage={d.orderPage}
                setOrderPage={d.setOrderPage}
                users={d.stats.users}
                updatingOrderId={d.updatingOrderId}
              />
            )}
            {d.activeTab === "categories" && (
              <CategoriesTabContent
                categories={d.stats.categories || []}
                products={d.stats.products || []}
                onAdd={() => {
                  d.setEditingCategory(null);
                  d.setIsCategoryModalOpen(true);
                }}
                onEdit={(cat) => {
                  d.setEditingCategory(cat);
                  d.setIsCategoryModalOpen(true);
                }}
                onDelete={(cat) => d.setCategoryDeleteConfirm(cat)}
              />
            )}
            {d.activeTab === "warehouses" && (
              <WarehousesTabContent
                warehouseData={d.stats.warehouses || []}
                onRefresh={d.fetchStats}
                showToast={d.showToast}
                onCreate={() => {
                  d.setEditingWarehouse(null);
                  d.setIsWarehouseModalOpen(true);
                }}
                onEdit={(wh) => {
                  d.setEditingWarehouse(wh);
                  d.setIsWarehouseModalOpen(true);
                }}
                onDelete={(wh) => d.setWarehouseDeleteConfirm(wh)}
              />
            )}
            {d.activeTab === "inventory" && (
              <InventoryTabContent
                products={d.stats.products || []}
                onAdjustStock={d.setSelectedProductForInventory}
              />
            )}
            {d.activeTab === "logs" && d.user?.adminRole === "super_admin" && (
              <ActivityLogsTabContent />
            )}
          </div>
        </div>
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
        isCategoryModalOpen={d.isCategoryModalOpen}
        setIsCategoryModalOpen={d.setIsCategoryModalOpen}
        editingCategory={d.editingCategory}
        handleDeleteCategory={d.handleDeleteCategory}
        isDeletingCategory={d.isDeletingCategory}
        categoryDeleteConfirm={d.categoryDeleteConfirm}
        setCategoryDeleteConfirm={d.setCategoryDeleteConfirm}
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
        cancelOrderConfirm={d.cancelOrderConfirm}
        setCancelOrderConfirm={d.setCancelOrderConfirm}
        handleCancelOrder={d.handleCancelOrder}
        isCancellingOrder={d.isCancellingOrder}
        productDeleteConfirm={d.productDeleteConfirm}
        setProductDeleteConfirm={d.setProductDeleteConfirm}
        handleDeleteProduct={d.handleDeleteProduct}
        isDeletingProduct={d.isDeletingProduct}
        selectedProductForInventory={d.selectedProductForInventory}
        setSelectedProductForInventory={d.setSelectedProductForInventory}
        isWarehouseModalOpen={d.isWarehouseModalOpen}
        setIsWarehouseModalOpen={d.setIsWarehouseModalOpen}
        editingWarehouse={d.editingWarehouse}
        warehouseDeleteConfirm={d.warehouseDeleteConfirm}
        setWarehouseDeleteConfirm={d.setWarehouseDeleteConfirm}
        handleDeleteWarehouse={d.handleDeleteWarehouse}
        isDeletingWarehouse={d.isDeletingWarehouse}
      />
    </div>
  );
}
