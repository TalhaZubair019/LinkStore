"use client";

import React, { Dispatch, SetStateAction } from "react";
import UsersTable from "@/components/admin/tables/UsersTable";
import { UserData } from "@/app/admin/types";

interface UsersTabContentProps {
  paginatedUsers: UserData[];
  setSelectedUser: Dispatch<SetStateAction<UserData | null>>;
  setViewType: Dispatch<SetStateAction<"cart" | "wishlist" | "both">>;
  setDeleteConfirm: Dispatch<SetStateAction<string | null>>;
  onPromoteToAdmin: (id: string, name: string) => void;
  userPage: number;
  setUserPage: Dispatch<SetStateAction<number>>;
  totalUserPages: number;
  isSuperAdmin: boolean;
}

const UsersTabContent: React.FC<UsersTabContentProps> = ({
  paginatedUsers,
  setSelectedUser,
  setViewType,
  setDeleteConfirm,
  onPromoteToAdmin,
  userPage,
  setUserPage,
  totalUserPages,
  isSuperAdmin,
}) => {
  return (
    <UsersTable
      paginatedUsers={paginatedUsers}
      setSelectedUser={setSelectedUser}
      setViewType={setViewType}
      setDeleteConfirm={setDeleteConfirm}
      onPromoteToAdmin={onPromoteToAdmin}
      userPage={userPage}
      setUserPage={setUserPage}
      totalUserPages={totalUserPages}
      isSuperAdmin={isSuperAdmin}
    />
  );
};

export default UsersTabContent;
