"use client";

import React from "react";
import Link from "next/link";
import { Search, X, Menu, Store } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface DashboardHeaderProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSearch: boolean;
  isAdminView?: boolean;
  onMenuClick?: () => void;
  visitStoreUrl?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  searchTerm,
  setSearchTerm,
  showSearch,
  onMenuClick = () => {},
  visitStoreUrl,
}) => {
  return (
    <>
      <div className="lg:hidden mb-6 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-slate-900 p-3 lg:p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMenuClick}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-100 dark:border-slate-800"
            title="Open Menu"
          >
            <Menu size={18} />
          </button>
          <span className="text-[13px] font-bold text-slate-900 dark:text-white capitalize truncate max-w-[120px]">
            {activeTab.replace("_", " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {visitStoreUrl && (
            <Link
              href={visitStoreUrl}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-100 dark:border-slate-800"
              title="Visit Store"
            >
              <Store size={18} />
            </Link>
          )}
          <ThemeToggle />
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-slate-200 dark:border-slate-800">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
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
