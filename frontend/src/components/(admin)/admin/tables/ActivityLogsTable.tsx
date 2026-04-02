"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollText,
  Package,
  Tag,
  ClipboardList,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Filter,
  FilterX,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  Clock,
  Mail,
  Hash,
} from "lucide-react";

interface LogEntry {
  _id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

const ENTITY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  product: {
    icon: <Package size={14} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50",
    label: "Product",
  },
  category: {
    icon: <Tag size={14} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50",
    label: "Category",
  },
  order: {
    icon: <ClipboardList size={14} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50",
    label: "Order",
  },
  review: {
    icon: <MessageSquare size={14} />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800/50",
    label: "Review",
  },
};

const ACTION_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  add: {
    icon: <Plus size={14} />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50",
    label: "Added",
  },
  update: {
    icon: <Pencil size={14} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50",
    label: "Updated",
  },
  delete: {
    icon: <Trash2 size={14} />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50",
    label: "Deleted",
  },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function ActivityLogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableAdmins, setAvailableAdmins] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [availableVendors, setAvailableVendors] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [filterVendor, setFilterVendor] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [availableUsers, setAvailableUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const LIMIT = 15;

  const fetchLogs = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
      });
      if (filterEntity !== "all") params.set("entity", filterEntity);
      if (filterAction !== "all") params.set("action", filterAction);
      if (filterAdmin !== "all") params.set("adminId", filterAdmin);
      if (filterVendor !== "all") params.set("adminId", filterVendor);
      if (filterUser !== "all") params.set("userId", filterUser);

      const res = await fetch(`/api/admin/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (data.admins) {
          setAvailableAdmins(data.admins);
        }
        if (data.vendors) {
          setAvailableVendors(data.vendors);
        }
        if (data.users) {
          setAvailableUsers(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterEntity, filterAction, filterAdmin, filterVendor, filterUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [page, filterEntity, filterAction, filterAdmin, filterVendor, filterUser]);

  useEffect(() => {
    setPage(1);
  }, [filterEntity, filterAction, filterAdmin, filterVendor, filterUser]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const handleDownloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filterEntity !== "all") params.set("entity", filterEntity);
      if (filterAction !== "all") params.set("action", filterAction);
      if (filterAdmin !== "all") params.set("adminId", filterAdmin);
      if (filterVendor !== "all") params.set("adminId", filterVendor);
      if (filterUser !== "all") params.set("userId", filterUser);

      const downloadUrl = `/api/admin/logs/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Failed to download CSV");
    }
  };

  const hasFilters =
    filterEntity !== "all" ||
    filterAction !== "all" ||
    filterAdmin !== "all" ||
    filterVendor !== "all" ||
    filterUser !== "all";

  return (
    <div className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center transition-colors">
              <ScrollText
                size={20}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Activity Logs
              </h3>
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {total} total {total === 1 ? "entry" : "entries"}
                <span className="flex items-center gap-1.5 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                    Live
                  </span>
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all shadow-sm shrink-0 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Package size={14} />
            </div>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold [&>option]:bg-white [&>option]:dark:bg-slate-900"
            >
              <option value="all">All Entities</option>
              <option value="product">Products</option>
              <option value="category">Categories</option>
              <option value="order">Orders</option>
              <option value="review">Reviews</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter size={14} />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold [&>option]:bg-white [&>option]:dark:bg-slate-900"
            >
              <option value="all">All Actions</option>
              <option value="add">Added</option>
              <option value="update">Updated</option>
              <option value="delete">Deleted</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={14} />
            </div>
            <select
              value={filterUser}
              onChange={(e) => {
                setFilterUser(e.target.value);
                if (e.target.value !== "all") {
                  setFilterAdmin("all");
                  setFilterVendor("all");
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold [&>option]:bg-white [&>option]:dark:bg-slate-900"
            >
              <option value="all">All Users</option>
              {availableUsers.map(
                (u: { id: string; name: string; email: string }) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={14} />
            </div>
            <select
              value={filterVendor}
              onChange={(e) => {
                setFilterVendor(e.target.value);
                if (e.target.value !== "all") {
                  setFilterAdmin("all");
                  setFilterUser("all");
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold [&>option]:bg-white [&>option]:dark:bg-slate-900"
            >
              <option value="all">All Vendors</option>
              {availableVendors.map(
                (v: { id: string; name: string; email: string }) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.email})
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={14} />
            </div>
            <select
              value={filterAdmin}
              onChange={(e) => {
                setFilterAdmin(e.target.value);
                if (e.target.value !== "all") setFilterVendor("all");
              }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold [&>option]:bg-white [&>option]:dark:bg-slate-900"
            >
              <option value="all">All Admins</option>
              {availableAdmins.map(
                (a: { id: string; name: string; email: string }) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ),
              )}
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setFilterEntity("all");
                setFilterAction("all");
                setFilterAdmin("all");
                setFilterVendor("all");
                setFilterUser("all");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-[11px] sm:text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent dark:border-red-500/20 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-white/5 transition-colors">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-indigo-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-4 transition-colors">
              <ScrollText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No logs found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {hasFilters
                ? "Try adjusting your filters."
                : "Admin activity will appear here."}
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const entity = ENTITY_CONFIG[log.entity] || ENTITY_CONFIG.product;
            const action = ACTION_CONFIG[log.action] || ACTION_CONFIG.update;
            const isExpanded = expandedLogs[log._id];
            const shouldTruncate = log.details.length > 150;

            return (
              <div
                key={log._id}
                className="px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
              >
                <div className="flex items-start gap-3 lg:gap-4">
                  <div
                    className={`mt-0.5 w-8 h-8 lg:w-9 lg:h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${action.bg}`}
                  >
                    <span className={action.color}>
                      {React.cloneElement(
                        action.icon as React.ReactElement<any>,
                        { size: 14 },
                      )}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] lg:text-[11px] font-bold border whitespace-nowrap transition-colors ${action.bg} ${action.color}`}
                      >
                        {action.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] lg:text-[11px] font-bold border whitespace-nowrap transition-colors ${entity.bg} ${entity.color}`}
                      >
                        {React.cloneElement(
                          entity.icon as React.ReactElement<any>,
                          { size: 10 },
                        )}
                        {entity.label}
                      </span>
                      {log.entityId && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] lg:text-[11px] font-bold border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors">
                          <Hash size={10} />
                          {String(log.entityId).slice(-6).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs lg:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed transition-colors">
                      {isExpanded
                        ? log.details
                        : `${log.details.slice(0, 100)}${log.details.length > 100 ? "..." : ""}`}
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpand(log._id)}
                          className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-[10px] lg:text-xs transition-colors"
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </p>
                    <div className="flex items-center gap-x-3 gap-y-1.5 mt-2.5 text-[10px] lg:text-xs text-slate-400 dark:text-slate-500 flex-wrap transition-colors">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <div className="w-4 h-4 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">
                          {log.adminName?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-600 dark:text-slate-300 truncate max-w-[100px] lg:max-w-none transition-colors">
                          {log.adminName}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                        <Mail size={10} className="shrink-0" />
                        <span className="truncate max-w-[100px] lg:max-w-none">
                          {log.adminEmail}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">
                          •
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock size={10} className="shrink-0" />
                          {timeAgo(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent transition-colors">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm transition-all"
          >
            <ChevronLeft size={14} />
            Prev
          </button>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm transition-all"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
