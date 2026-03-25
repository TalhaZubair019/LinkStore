"use client";

import React, { Dispatch, SetStateAction } from "react";
import AdminsTable from "@/components/(admin)/admin/tables/AdminsTable";
import { UserData } from "@/app/(admin)/admin/types";

interface AdminsTabContentProps {
  paginatedAdmins: UserData[];
  setSelectedUser: Dispatch<SetStateAction<UserData | null>>;
  setViewType: Dispatch<SetStateAction<"cart" | "wishlist" | "both">>;
  setDeleteConfirm: Dispatch<SetStateAction<string | null>>;
  onRevokeAdmin: (id: string, name: string) => void;
  adminPage: number;
  setAdminPage: Dispatch<SetStateAction<number>>;
  totalAdminPages: number;
  onAddAdmin: () => void;
  isSuperAdmin: boolean;
}

const AdminsTabContent: React.FC<AdminsTabContentProps> = ({
  paginatedAdmins,
  setSelectedUser,
  setViewType,
  setDeleteConfirm,
  onRevokeAdmin,
  adminPage,
  setAdminPage,
  totalAdminPages,
  onAddAdmin,
  isSuperAdmin,
}) => {
  return (
    <AdminsTable
      paginatedAdmins={paginatedAdmins}
      setSelectedUser={setSelectedUser}
      setViewType={setViewType}
      setDeleteConfirm={setDeleteConfirm}
      onRevokeAdmin={onRevokeAdmin}
      adminPage={adminPage}
      setAdminPage={setAdminPage}
      totalAdminPages={totalAdminPages}
      onAddAdmin={onAddAdmin}
      isSuperAdmin={isSuperAdmin}
    />
  );
};

export default AdminsTabContent;
