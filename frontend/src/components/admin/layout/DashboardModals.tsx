"use client";

import React from "react";
import AddAdminModal from "@/components/admin/modals/AddAdminModal";
import CategoryModal from "@/components/admin/modals/CategoryModal";
import UserModal from "@/components/admin/modals/UserModal";
import OrderModal from "@/components/admin/modals/OrderModal";
import DeleteConfirmationModal from "@/components/admin/modals/DeleteConfirmationModal";
import CancelOrderConfirmModal from "@/components/admin/modals/CancelOrderConfirmModal";
import StockAdjustmentModal from "@/components/admin/modals/StockAdjustmentModal";
import WarehouseModal from "@/components/admin/modals/WarehouseModal";
import { Order, UserData, DashboardStats } from "@/app/admin/types";

interface DashboardModalsProps {
  stats: DashboardStats | null;
  fetchStats: () => void;
  showToast: (message: string, type?: "success" | "error") => void;
  isAddAdminModalOpen?: boolean;
  setIsAddAdminModalOpen?: (open: boolean) => void;
  isCategoryModalOpen?: boolean;
  setIsCategoryModalOpen?: (open: boolean) => void;
  editingCategory?: any;
  handleDeleteCategory?: (id: string) => void;
  isDeletingCategory?: boolean;
  categoryDeleteConfirm?: any;
  setCategoryDeleteConfirm?: (val: any) => void;
  selectedUser?: UserData | null;
  setSelectedUser?: (user: UserData | null) => void;
  viewType?: "cart" | "wishlist" | "both";
  deleteConfirm?: string | null;
  setDeleteConfirm?: (val: string | null) => void;
  handleDeleteUser?: (id: string) => void;
  isDeleting?: boolean;
  promoteConfirm?: { id: string; name: string } | null;
  setPromoteConfirm?: (val: any) => void;
  handlePromoteToAdmin?: (id: string) => void;
  isPromoting?: boolean;
  revokeConfirm?: { id: string; name: string } | null;
  setRevokeConfirm?: (val: any) => void;
  handleRevokeAdmin?: (id: string) => void;
  isRevoking?: boolean;
  selectedOrder?: Order | null;
  setSelectedOrder?: (order: Order | null) => void;
  cancelOrderConfirm?: Order | null;
  setCancelOrderConfirm?: (order: Order | null) => void;
  handleCancelOrder?: () => void;
  isCancellingOrder?: boolean;
  productDeleteConfirm?: any;
  setProductDeleteConfirm?: (val: any) => void;
  handleDeleteProduct?: (id: number) => void;
  isDeletingProduct?: boolean;
  selectedProductForInventory?: any;
  setSelectedProductForInventory?: (val: any) => void;
  isWarehouseModalOpen?: boolean;
  setIsWarehouseModalOpen?: (open: boolean) => void;
  editingWarehouse?: any;
  warehouseDeleteConfirm?: any;
  setWarehouseDeleteConfirm?: (val: any) => void;
  handleDeleteWarehouse?: (id: string) => void;
  isDeletingWarehouse?: boolean;
  isAdminView?: boolean;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  stats,
  fetchStats,
  showToast,
  isAddAdminModalOpen,
  setIsAddAdminModalOpen,
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  editingCategory,
  handleDeleteCategory,
  isDeletingCategory,
  categoryDeleteConfirm,
  setCategoryDeleteConfirm,
  selectedUser,
  setSelectedUser,
  viewType,
  deleteConfirm,
  setDeleteConfirm,
  handleDeleteUser,
  isDeleting,
  promoteConfirm,
  setPromoteConfirm,
  handlePromoteToAdmin,
  isPromoting,
  revokeConfirm,
  setRevokeConfirm,
  handleRevokeAdmin,
  isRevoking,
  selectedOrder,
  setSelectedOrder,
  cancelOrderConfirm,
  setCancelOrderConfirm,
  handleCancelOrder,
  isCancellingOrder,
  productDeleteConfirm,
  setProductDeleteConfirm,
  handleDeleteProduct,
  isDeletingProduct,
  selectedProductForInventory,
  setSelectedProductForInventory,
  isWarehouseModalOpen,
  setIsWarehouseModalOpen,
  editingWarehouse,
  warehouseDeleteConfirm,
  setWarehouseDeleteConfirm,
  handleDeleteWarehouse,
  isDeletingWarehouse,
  isAdminView = true,
}) => {
  return (
    <>
      {isAddAdminModalOpen !== undefined && setIsAddAdminModalOpen && (
        <AddAdminModal
          isOpen={isAddAdminModalOpen}
          onClose={() => setIsAddAdminModalOpen(false)}
          onSuccess={fetchStats}
          showToast={showToast}
        />
      )}

      {isCategoryModalOpen !== undefined && setIsCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          editingCategory={editingCategory}
          onSaved={fetchStats}
          showToast={showToast}
          isAdminView={isAdminView}
        />
      )}

      {selectedUser !== undefined && setSelectedUser && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          viewType={viewType || "both"}
        />
      )}

      {selectedOrder !== undefined && setSelectedOrder && (
        <OrderModal
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {productDeleteConfirm !== undefined && setProductDeleteConfirm && handleDeleteProduct && (
        <DeleteConfirmationModal
          isOpen={!!productDeleteConfirm}
          onClose={() => setProductDeleteConfirm(null)}
          onConfirm={() =>
            productDeleteConfirm && handleDeleteProduct(productDeleteConfirm.id)
          }
          title="Delete Product?"
          message={`Remove "${productDeleteConfirm?.title}" from store?`}
          isLoading={isDeletingProduct || false}
        />
      )}

      {deleteConfirm !== undefined && setDeleteConfirm && handleDeleteUser && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
          title="Delete User?"
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {stats?.users.find((u) => u.id === deleteConfirm)?.name ||
                  "this user"}
              </span>
              ? This action cannot be undone.
            </>
          }
          isLoading={isDeleting || false}
        />
      )}

      {promoteConfirm !== undefined && setPromoteConfirm && handlePromoteToAdmin && (
        <DeleteConfirmationModal
          isOpen={!!promoteConfirm}
          onClose={() => setPromoteConfirm(null)}
          onConfirm={() =>
            promoteConfirm && handlePromoteToAdmin(promoteConfirm.id)
          }
          title="Promote to Admin?"
          message={
            <>
              Promote{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {promoteConfirm?.name}
              </span>{" "}
              to Administrator? They will have full access to the admin dashboard.
            </>
          }
          confirmLabel="Promote"
          confirmClassName="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90"
          isLoading={isPromoting || false}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }
        />
      )}

      {revokeConfirm !== undefined && setRevokeConfirm && handleRevokeAdmin && (
        <DeleteConfirmationModal
          isOpen={!!revokeConfirm}
          onClose={() => setRevokeConfirm(null)}
          onConfirm={() => revokeConfirm && handleRevokeAdmin(revokeConfirm.id)}
          title="Revoke Admin Access?"
          message={
            <>
              Remove admin privileges from{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {revokeConfirm?.name}
              </span>
              ? They will become a regular user but their account will remain.
            </>
          }
          confirmLabel="Revoke"
          confirmClassName="flex-1 px-4 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600"
          isLoading={isRevoking || false}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          }
        />
      )}

      {categoryDeleteConfirm !== undefined && setCategoryDeleteConfirm && handleDeleteCategory && (
        <DeleteConfirmationModal
          isOpen={!!categoryDeleteConfirm}
          onClose={() => setCategoryDeleteConfirm(null)}
          onConfirm={() =>
            categoryDeleteConfirm &&
            handleDeleteCategory(categoryDeleteConfirm._id)
          }
          title="Delete Category?"
          message={`Remove the "${categoryDeleteConfirm?.name}" category? Products assigned to this category will become uncategorized.`}
          isLoading={isDeletingCategory || false}
        />
      )}

      {cancelOrderConfirm !== undefined && setCancelOrderConfirm && handleCancelOrder && (
        <CancelOrderConfirmModal
          isOpen={!!cancelOrderConfirm}
          order={cancelOrderConfirm}
          onClose={() => setCancelOrderConfirm(null)}
          onConfirm={handleCancelOrder}
          isLoading={isCancellingOrder || false}
        />
      )}

      {!!selectedProductForInventory && setSelectedProductForInventory && (
        <StockAdjustmentModal
          product={selectedProductForInventory}
          onClose={() => setSelectedProductForInventory(null)}
          onSuccess={() => {
            fetchStats();
            setSelectedProductForInventory(null);
            showToast("Inventory adjusted successfully.", "success");
          }}
          isAdminView={isAdminView}
        />
      )}

      {isWarehouseModalOpen !== undefined && setIsWarehouseModalOpen && (
        <WarehouseModal
          isOpen={isWarehouseModalOpen}
          onClose={() => setIsWarehouseModalOpen(false)}
          editingWarehouse={editingWarehouse}
          onSaved={fetchStats}
          showToast={showToast}
          isAdminView={isAdminView}
        />
      )}

      {warehouseDeleteConfirm !== undefined && setWarehouseDeleteConfirm && handleDeleteWarehouse && (
        <DeleteConfirmationModal
          isOpen={!!warehouseDeleteConfirm}
          onClose={() => setWarehouseDeleteConfirm(null)}
          onConfirm={() =>
            warehouseDeleteConfirm &&
            handleDeleteWarehouse(warehouseDeleteConfirm.id)
          }
          title="Delete Warehouse?"
          message={`Delete "${warehouseDeleteConfirm?.warehouseName}"? Removing this warehouse will completely delete it from the system.`}
          isLoading={isDeletingWarehouse || false}
        />
      )}
    </>
  );
};

export default DashboardModals;
