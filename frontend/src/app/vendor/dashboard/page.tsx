"use client";
import React from "react";
import { CheckCircle, X } from "lucide-react";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import DashboardHeader from "@/components/admin/layout/DashboardHeader";
import DashboardModals from "@/components/admin/layout/DashboardModals";

import OverviewTab from "@/components/admin/tabs/OverviewTab";
import ProductsTabContent from "@/components/admin/tabs/ProductsTabContent";
import ReviewsTabContent from "@/components/admin/tabs/ReviewsTabContent";
import OrdersTabContent from "@/components/admin/tabs/OrdersTabContent";
import CategoriesTabContent from "@/components/admin/tabs/CategoriesTabContent";
import WarehousesTabContent from "@/components/admin/tabs/WarehousesTabContent";
import InventoryTabContent from "@/components/admin/tabs/InventoryTabContent";

import { useVendorDashboard } from "@/hooks/useVendorDashboard";

export default function VendorDashboard() {
  const d = useVendorDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (d.user?.isVendor) {
      d.fetchStats();
    }
  }, [d.activeTab, d.fetchStats]);

  if (d.isAuthLoading || d.loading || !d.stats) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex">
      <VendorSidebar
        user={d.user}
        activeTab={d.activeTab as any}
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
              Welcome back, {d.user?.vendorProfile?.storeName || d.user?.name || "Vendor"}!
            </p>
          </div>

          <DashboardHeader
            user={d.user}
            activeTab={d.activeTab}
            setActiveTab={d.setActiveTab}
            searchTerm={d.searchTerm}
            setSearchTerm={d.setSearchTerm}
            showSearch={[
              "orders",
              "products",
              "reviews",
            ].includes(d.activeTab)}
          />
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
        isCategoryModalOpen={d.isCategoryModalOpen}
        setIsCategoryModalOpen={d.setIsCategoryModalOpen}
        editingCategory={d.editingCategory}
        handleDeleteCategory={d.handleDeleteCategory}
        isDeletingCategory={d.isDeletingCategory}
        categoryDeleteConfirm={d.categoryDeleteConfirm}
        setCategoryDeleteConfirm={d.setCategoryDeleteConfirm}
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
