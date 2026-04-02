import React from "react";
import { ShoppingCart, Heart, Trash2, Shield, User } from "lucide-react";
import { UserData } from "@/app/(admin)/admin/types";

interface UsersTableProps {
  paginatedUsers: UserData[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setViewType: React.Dispatch<
    React.SetStateAction<"cart" | "wishlist" | "both">
  >;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
  onPromoteToAdmin: (userId: string, userName: string) => void;
  userPage: number;
  setUserPage: React.Dispatch<React.SetStateAction<number>>;
  totalUserPages: number;
  isSuperAdmin: boolean;
}

const UsersTable = ({
  paginatedUsers,
  setSelectedUser,
  setViewType,
  setDeleteConfirm,
  onPromoteToAdmin,
  userPage,
  setUserPage,
  totalUserPages,
  isSuperAdmin,
}: UsersTableProps) => {
  return (
    <div
      key="users"
      className="bg-white dark:bg-[#11141b] rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in duration-500 transition-all relative group"
    >
      {/* Decorative Glows */}
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-600/10 transition-all duration-700" />

      <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              Regular Users
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              Platform Customer Base
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5 bg-white/50 dark:bg-transparent transition-colors">
        {paginatedUsers?.length === 0 ? (
          <div className="px-6 py-20 text-center text-slate-400 dark:text-slate-600 text-sm italic font-medium">
            No users found.
          </div>
        ) : (
          paginatedUsers?.map((u) => (
            <div
              key={u.id}
              className="p-6 space-y-5 hover:bg-slate-50 dark:hover:bg-white/2 transition-all duration-300 group/item"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl blur-md opacity-20 group-hover/item:opacity-40 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 dark:from-purple-900/40 to-blue-100 dark:to-blue-900/40 border border-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-300 font-black text-lg relative z-10">
                    {u.name[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-base text-slate-800 dark:text-white truncate tracking-tight">
                    {u.name}
                  </p>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate mt-0.5 tracking-tight group-hover/item:text-purple-500/80 transition-colors">
                    {u.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("cart");
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-slate-600 dark:text-slate-400 group/btn"
                >
                  <ShoppingCart
                    size={18}
                    className="text-blue-500 group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Cart ({u.cartCount})
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("wishlist");
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all text-slate-600 dark:text-slate-400 group/btn"
                >
                  <Heart
                    size={18}
                    className="text-rose-500 group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Wishlist ({u.wishlistCount})
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Active User
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSuperAdmin && (
                    <button
                      onClick={() => onPromoteToAdmin(u.id, u.name)}
                      className="p-2.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 transition-all active:scale-90"
                      title="Promote User"
                    >
                      <Shield size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="p-2.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all active:scale-90"
                    title="Terminate Access"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {}
      <div className="hidden lg:block overflow-x-auto scrollbar-none relative z-10 transition-colors">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-white/1 text-slate-500 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-10 py-5">User</th>
              <th className="px-10 py-5">Storage</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedUsers?.map((u) => (
              <tr
                key={u.id}
                className="group/row hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all duration-300"
              >
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl blur-md opacity-0 group-hover/row:opacity-20 transition-opacity" />
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 dark:from-[#1a1d25] to-blue-100 dark:to-[#1a1d25] border border-slate-200 dark:border-white/5 flex items-center justify-center text-purple-700 dark:text-purple-400 font-black text-lg transition-all group-hover/row:scale-105 group-hover/row:border-purple-500/30">
                        {u.name[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 dark:text-white truncate tracking-tight">
                        {u.name}
                      </p>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate mt-0.5 tracking-tight group-hover/row:text-purple-500 transition-colors">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setViewType("cart");
                      }}
                      className="group/btn flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 bg-slate-100/50 dark:bg-white/3 px-4 py-2 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                    >
                      <ShoppingCart
                        size={14}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                      Cart ({u.cartCount})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setViewType("wishlist");
                      }}
                      className="group/btn flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 bg-slate-100/50 dark:bg-white/3 px-4 py-2 rounded-xl hover:bg-rose-500/10 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                    >
                      <Heart
                        size={14}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                      Wishlist ({u.wishlistCount})
                    </button>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all duration-300">
                    {isSuperAdmin && (
                      <button
                        onClick={() => onPromoteToAdmin(u.id, u.name)}
                        className="text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 p-2 rounded-xl hover:bg-purple-500/10 transition-all"
                        title="Promote to Administrative Access"
                      >
                        <Shield size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(u.id)}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all"
                      title="Terminate User"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-10 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 relative z-10 transition-colors">
        <button
          disabled={userPage === 1}
          onClick={() => setUserPage((p) => p - 1)}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black bg-white dark:bg-white/3 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-2xl disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95"
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
            Page {userPage} / {totalUserPages}
          </span>
        </div>
        <button
          disabled={userPage === totalUserPages || totalUserPages === 0}
          onClick={() => setUserPage((p) => p + 1)}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black bg-white dark:bg-white/3 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-2xl disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
