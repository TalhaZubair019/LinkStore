"use client";

import React, { useState } from "react";
import VendorsTable from "@/components/(admin)/admin/tables/VendorsTable";
import { UserData } from "@/app/(admin)/admin/types";
import { Clock, CheckCircle2, Search, Filter, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VendorsTabContentProps {
  allUsers: UserData[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onUnsuspend: (id: string) => void;
  onClearDebt: (id: string) => void;
}

const VendorsTabContent: React.FC<VendorsTabContentProps> = ({
  allUsers,
  onApprove,
  onReject,
  onSuspend,
  onUnsuspend,
  onClearDebt
}) => {
  const [viewMode, setViewMode] = useState<"pending" | "active" | "suspended">("pending");
  const [search, setSearch] = useState("");

  const filteredVendors = allUsers.filter(user => {
    const isPending = user.vendorProfile?.status === "pending";
    const isActive = user.isVendor && user.vendorProfile?.status === "approved";
    const isSuspended = user.vendorProfile?.status === "suspended";
    
    const matchesMode = viewMode === "pending" ? isPending : viewMode === "suspended" ? isSuspended : isActive;
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.vendorProfile?.storeName?.toLowerCase().includes(search.toLowerCase());

    return matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
          <button
            onClick={() => setViewMode("pending")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === "pending"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Clock size={16} />
            Pending Applications
          </button>
          <button
            onClick={() => setViewMode("active")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === "active"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <CheckCircle2 size={16} />
            Active Sellers
          </button>
          <button
            onClick={() => setViewMode("suspended")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === "suspended"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Ban size={16} />
            Suspended Account
          </button>
        </div>

        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search stores or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <VendorsTable 
            vendors={filteredVendors} 
            viewMode={viewMode}
            onApprove={onApprove}
            onReject={onReject}
            onSuspend={onSuspend}
            onUnsuspend={onUnsuspend}
            onClearDebt={onClearDebt}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorsTabContent;
