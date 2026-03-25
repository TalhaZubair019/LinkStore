"use client";
import React from "react";
import { CheckCircle, X, Store, ExternalLink } from "lucide-react";
import Link from "next/link";
import VendorSidebar from "@/components/(vendor)/vendor/VendorSidebar";
import DashboardHeader from "@/components/(admin)/admin/layout/DashboardHeader";
import DashboardModals from "@/components/(admin)/admin/layout/DashboardModals";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import OverviewTab from "@/components/(admin)/admin/tabs/OverviewTab";
import ProductsTabContent from "@/components/(admin)/admin/tabs/ProductsTabContent";
import ReviewsTabContent from "@/components/(admin)/admin/tabs/ReviewsTabContent";
import OrdersTabContent from "@/components/(admin)/admin/tabs/OrdersTabContent";
import CategoriesTabContent from "@/components/(admin)/admin/tabs/CategoriesTabContent";
import WarehousesTabContent from "@/components/(admin)/admin/tabs/WarehousesTabContent";
import InventoryTabContent from "@/components/(admin)/admin/tabs/InventoryTabContent";
import SettingsTabContent from "@/components/(vendor)/vendor/tabs/SettingsTabContent";

import { useVendorDashboard } from "@/hooks/vendor/useVendorDashboard";

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
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {d.activeTab.charAt(0).toUpperCase() + d.activeTab.slice(1)}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Welcome back,{" "}
                {d.user?.vendorProfile?.storeName || d.user?.name || "Vendor"}!
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              {d.user?.vendorProfile?.storeSlug && (
                <Link
                  href={`/vendor/view/${d.user.vendorProfile.storeSlug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <Store size={18} />
                  <span>Visit Store</span>
                  <ExternalLink size={14} className="opacity-50" />
                </Link>
              )}
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
              "orders",
              "products",
              "reviews",
            ].includes(d.activeTab)}
          />

          {/* COD Commission Warning Card */}
          {d.stats && d.stats.outstandingCommission && d.stats.outstandingCommission > 0 && (
            <div className="mb-8 p-6 bg-linear-to-r from-rose-500/10 to-orange-500/10 border-2 border-rose-500/20 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/30 shrink-0">
                    <X size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Action Required: Settle Commission</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-md">
                      You have an outstanding COD commission of <span className="font-bold text-rose-500 font-mono">${d.stats.outstandingCommission.toLocaleString()}</span>. 
                      Please settle this within 48 hours to avoid store suspension.
                    </p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10 shrink-0">
                  Pay Now
                </button>
              </div>
            </div>
          )}

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
                isAdminView={false}
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
                hideEmail={true}
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
            {d.activeTab === "settings" && (
              <SettingsTabContent user={d.user} />
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
        isAdminView={false}
      />
    </div>
  );
}
