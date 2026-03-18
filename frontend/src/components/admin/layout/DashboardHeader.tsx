"use client";

import React from "react";
import Link from "next/link";
import { Search, X, Shield } from "lucide-react";

interface DashboardHeaderProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSearch: boolean;
  isAdminView?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  showSearch,
  isAdminView = false,
}) => {
  return (
    <>
      <div className="lg:hidden mb-6 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-full bg-purple-600 border border-purple-500/20 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-purple-600/20">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate block">
              {user?.name || "Admin User"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Switch Dashboard"
          >
            <Shield size={18} />
          </Link>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 outline-none max-w-[120px]"
          >
            <option value="overview">Overview</option>
            {isAdminView ? (
              <>
                <option value="users">Users</option>
                <option value="admins">Admins</option>
                <option value="vendors">Vendors</option>
                {user?.adminRole === "super_admin" && (
                  <option value="logs">Activity Logs</option>
                )}
              </>
            ) : (
              <>
                <option value="products">Products</option>
                <option value="reviews">Reviews</option>
                <option value="orders">Orders</option>
                <option value="categories">Categories</option>
                <option value="warehouses">Warehouses</option>
                <option value="inventory">Inventory</option>
              </>
            )}
          </select>
        </div>
      </div>

      {showSearch && (
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition duration-300" />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 group-focus-within:border-purple-400 transition-all duration-300">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-300"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
