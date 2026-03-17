import React from "react";
import {
  Shield,
  Trash2,
  Crown,
  UserPlus,
  ShieldOff,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { UserData } from "@/app/admin/types";

interface AdminsTableProps {
  paginatedAdmins: UserData[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setViewType: React.Dispatch<
    React.SetStateAction<"cart" | "wishlist" | "both">
  >;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
  onRevokeAdmin: (userId: string, userName: string) => void;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  totalAdminPages: number;
  onAddAdmin: () => void;
  isSuperAdmin: boolean;
}

const AdminsTable = ({
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
}: AdminsTableProps) => {
  return (
    <div
      key="admins"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Management
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {paginatedAdmins.length} administrator
                {paginatedAdmins.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {isSuperAdmin && (
            <button
              onClick={onAddAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-purple-200"
            >
              <UserPlus size={16} />
              Add Admin
            </button>
          )}
        </div>
      </div>
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {paginatedAdmins.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm italic">
            No admins found.
          </div>
        ) : (
          paginatedAdmins.map((u) => (
            <div
              key={u.id}
              className="p-4 space-y-4 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {u.email}
                    </p>
                  </div>
                </div>
                {u.adminRole === "super_admin" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full">
                    <Crown size={10} /> Super
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold rounded-full">
                    <Shield size={10} /> Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("cart");
                  }}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                >
                  <ShoppingCart size={14} className="text-blue-500" />
                  Cart ({u.cartCount})
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("wishlist");
                  }}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:border-red-200 dark:hover:border-red-800 transition-all"
                >
                  <Heart size={14} className="text-red-500" />
                  Wishlist ({u.wishlistCount})
                </button>
              </div>

              {isSuperAdmin && u.adminRole !== "super_admin" && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <button
                    onClick={() => onRevokeAdmin(u.id, u.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                  >
                    <ShieldOff size={14} /> Revoke
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Administrator</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Storage</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedAdmins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-12 text-center text-slate-400 text-sm"
                >
                  No admins found.
                </td>
              </tr>
            ) : (
              paginatedAdmins.map((u) => (
                <tr
                  key={u.id}
                  className="group hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-all duration-200"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {u.adminRole === "super_admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full whitespace-nowrap">
                        <Crown size={10} />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full whitespace-nowrap">
                        <Shield size={10} />
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setViewType("cart");
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap transition-colors"
                      >
                        <ShoppingCart
                          size={12}
                          className="text-blue-500 dark:text-blue-400"
                        />{" "}
                        Cart ({u.cartCount})
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setViewType("wishlist");
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap transition-colors"
                      >
                        <Heart
                          size={12}
                          className="text-red-500 dark:text-red-400"
                        />{" "}
                        Wishlist ({u.wishlistCount})
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {isSuperAdmin && u.adminRole !== "super_admin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onRevokeAdmin(u.id, u.name)}
                          className="text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                          title="Revoke Admin Access"
                        >
                          <ShieldOff size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u.id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <button
          disabled={adminPage === 1}
          onClick={() => setAdminPage((p) => p - 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Page {adminPage} of {totalAdminPages}
        </span>
        <button
          disabled={adminPage === totalAdminPages || totalAdminPages === 0}
          onClick={() => setAdminPage((p) => p + 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminsTable;
