"use client";
import { useState, useMemo, useEffect } from "react";
import { Eye, User, Filter, FilterX, Calendar } from "lucide-react";
import { Order } from "@/app/(admin)/admin/types";

interface OrdersTableProps {
  allOrders: Order[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  requestCancelOrder: (order: Order) => void;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  orderPage: number;
  setOrderPage: React.Dispatch<React.SetStateAction<number>>;
  users?: { id: string; name: string; email?: string }[];
  updatingOrderId?: string | null;
  hideEmail?: boolean;
  isAdminView?: boolean;
  totalOrderPages?: number;
  itemsPerPage?: number;
}

const OrdersTable = ({
  allOrders,
  handleStatusChange,
  requestCancelOrder,
  setSelectedOrder,
  orderPage,
  setOrderPage,
  users = [],
  updatingOrderId,
  hideEmail = false,
  isAdminView = false,
  totalOrderPages,
  itemsPerPage = 10,
}: OrdersTableProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const ITEMS_PER_PAGE = itemsPerPage;

  const nameFrequencies = useMemo(() => {
    const freqs: Record<string, number> = {};
    users.forEach((u) => {
      freqs[u.name] = (freqs[u.name] || 0) + 1;
    });
    return freqs;
  }, [users]);

  const derivedUsers = useMemo(() => {
    if (users && users.length > 0) return users;

    const uniqueCustomers: Record<
      string,
      { id: string; name: string; email?: string }
    > = {};
    allOrders.forEach((order) => {
      if (order.userId && order.customer?.name) {
        if (!uniqueCustomers[order.userId]) {
          uniqueCustomers[order.userId] = {
            id: order.userId,
            name: order.customer.name,
            email: order.customer.email,
          };
        }
      }
    });
    return Object.values(uniqueCustomers).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allOrders, users]);

  const hasDeletedAccounts = useMemo(() => {
    if (!users || users.length === 0) return false;
    const userIds = new Set(users.map((u) => u.id));
    return allOrders.some((o) => !userIds.has(o.userId));
  }, [allOrders, users]);

  const filteredOrders = useMemo(() => {
    const userIds = new Set(derivedUsers.map((u) => u.id));
    return allOrders.filter((order) => {
      let userMatch = false;
      if (selectedUserId === "all") {
        userMatch = true;
      } else if (selectedUserId === "deleted") {
        userMatch = !userIds.has(order.userId);
      } else {
        userMatch = order.userId === selectedUserId;
      }

      const statusMatch =
        selectedStatus === "all" || order.status === selectedStatus;

      let dateMatch = true;
      if (selectedDateRange !== "all") {
        const orderDate = new Date(order.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDateRange === "week") {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          dateMatch = orderDate >= lastWeek && orderDate <= today;
        } else if (selectedDateRange === "month") {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          dateMatch = orderDate >= lastMonth && orderDate <= today;
        } else if (selectedDateRange === "current-month") {
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
          );
          dateMatch = orderDate >= startOfMonth && orderDate <= today;
        } else if (selectedDateRange === "custom" && customStart && customEnd) {
          const start = new Date(customStart);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          dateMatch = orderDate >= start && orderDate <= end;
        }
      }

      return userMatch && statusMatch && dateMatch;
    });
  }, [
    allOrders,
    selectedUserId,
    selectedStatus,
    selectedDateRange,
    customStart,
    customEnd,
    users,
  ]);

  const totalPages =
    (totalOrderPages ?? Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setOrderPage(1);
  }, [
    selectedUserId,
    selectedStatus,
    selectedDateRange,
    customStart,
    customEnd,
    setOrderPage,
  ]);

  return (
    <div
      key="orders"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Order Management
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track and manage customer shipments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100 dark:ring-purple-800/50">
              {filteredOrders.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700">
              {allOrders.length} Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {derivedUsers.length > 0 && (
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={16} />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all appearance-none text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">All Customers</option>
                {derivedUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {u.name && nameFrequencies[u.name] > 1 && u.email
                      ? ` (${u.email})`
                      : ""}
                  </option>
                ))}
                {hasDeletedAccounts && (
                  <option value="deleted" className="text-red-500 font-bold">
                    Deleted Accounts
                  </option>
                )}
              </select>
            </div>
          )}

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter size={16} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all appearance-none text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Shipped">Shipped</option>
              <option value="Arrived in Country">Arrived in Country</option>
              <option value="Arrived in City">Arrived in City</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar size={16} />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all appearance-none text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="all">Total Timeline</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="current-month">Current Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {(selectedUserId !== "all" ||
            selectedStatus !== "all" ||
            selectedDateRange !== "all") && (
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedStatus("all");
                setSelectedDateRange("all");
                setCustomStart("");
                setCustomEnd("");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>

        {selectedDateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                From
              </label>
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                To
              </label>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        )}
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {paginatedOrders?.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 italic">
            No orders found.
          </div>
        ) : (
          paginatedOrders?.map((o) => (
            <div
              key={o.id}
              className="p-4 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                    #{String(o.id).slice(-8).toUpperCase()}
                  </span>
                  {isAdminView && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded mt-1">
                      {o.vendorStoreName || "Internal"}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {new Date(o.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {o.total}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </span>
                {o.customer?.name ? (
                  <div className="flex flex-col">
                    <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[200px]">
                      {o.customer.name}
                    </div>
                    {!hideEmail && (
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        {o.customer.email}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-red-600 font-medium italic">
                    Deleted Account
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {isAdminView ? (
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      o.status === "Pending"
                        ? "bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                        : o.status === "Accepted"
                          ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          : o.status === "Shipped"
                            ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                            : o.status === "Arrived in Country"
                              ? "bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
                              : o.status === "Arrived in City"
                                ? "bg-pink-50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800"
                                : o.status === "Out for Delivery"
                                  ? "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                  : o.status === "Delivered"
                                    ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                    : "bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}
                  >
                    {o.status}
                  </div>
                ) : (
                  <div className="relative flex-1 min-w-[140px]">
                    <select
                      value={o.status}
                      disabled={
                        updatingOrderId === o.id ||
                        o.status === "Delivered" ||
                        o.status === "Cancelled"
                      }
                      onChange={(e) => {
                        if (e.target.value === "Cancelled") {
                          requestCancelOrder(o);
                        } else {
                          handleStatusChange(o.id, e.target.value);
                        }
                      }}
                      className={`w-full text-xs font-bold py-2 border rounded-xl px-3 focus:outline-none transition-all ring-offset-1 focus:ring-2 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                        o.status === "Pending"
                          ? "bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 focus:ring-amber-500/20"
                          : o.status === "Accepted"
                            ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 focus:ring-blue-500/20"
                            : o.status === "Shipped"
                              ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500/20"
                              : o.status === "Arrived in Country"
                                ? "bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 focus:ring-violet-500/20"
                                : o.status === "Arrived in City"
                                  ? "bg-pink-50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 focus:ring-pink-500/20"
                                  : o.status === "Out for Delivery"
                                    ? "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 focus:ring-orange-500/20"
                                    : o.status === "Delivered"
                                      ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500/20"
                                      : "bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 focus:ring-red-500/20"
                      } ${updatingOrderId === o.id ? "animate-pulse" : ""}`}
                    >
                      <option value={o.status}>{o.status}</option>
                      {o.status === "Pending" && (
                        <option value="Accepted">Accepted</option>
                      )}
                      {o.status === "Accepted" && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {o.status === "Shipped" && (
                        <option value="Arrived in Country">
                          Arrived in Country
                        </option>
                      )}
                      {o.status === "Arrived in Country" && (
                        <option value="Arrived in City">Arrived in City</option>
                      )}
                      {o.status === "Arrived in City" && (
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                      )}
                      {o.status === "Out for Delivery" && (
                        <option value="Delivered">Delivered</option>
                      )}
                      {o.status !== "Delivered" && o.status !== "Cancelled" && (
                        <option value="Cancelled">Cancelled</option>
                      )}
                    </select>
                    {updatingOrderId === o.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 px-4 py-2 rounded-xl hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors border border-transparent dark:border-slate-700"
                >
                  <Eye size={14} /> View Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Order Info</th>
              {isAdminView && <th className="px-8 py-4">Vendor</th>}
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Total</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedOrders?.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                      #{o.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(o.date).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                {isAdminView && (
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {o.vendorStoreName || "Internal"}
                    </span>
                  </td>
                )}
                <td className="px-8 py-5">
                  <div className="min-w-[120px]">
                    {o.customer?.name ? (
                      <>
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate max-w-[150px]">
                          {o.customer.name}
                        </div>
                        {!hideEmail && (
                          <div className="text-xs text-slate-500 truncate max-w-[150px]">
                            {o.customer.email}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-red-600 font-medium italic">
                        Deleted Account
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 font-bold text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {o.total}
                </td>
                <td className="px-8 py-5">
                  <div className="relative group min-w-[140px]">
                    {isAdminView ? (
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                          o.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : o.status === "Accepted"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : o.status === "Shipped"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                                : o.status === "Arrived in Country"
                                  ? "bg-violet-50 text-violet-600 border-violet-200"
                                  : o.status === "Arrived in City"
                                    ? "bg-pink-50 text-pink-600 border-pink-200"
                                    : o.status === "Out for Delivery"
                                      ? "bg-orange-50 text-orange-600 border-orange-200"
                                      : o.status === "Delivered"
                                        ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                        : "bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                        }`}
                      >
                        {o.status}
                      </div>
                    ) : (
                      <select
                        value={o.status}
                        disabled={
                          updatingOrderId === o.id ||
                          o.status === "Delivered" ||
                          o.status === "Cancelled"
                        }
                        onChange={(e) => {
                          if (e.target.value === "Cancelled") {
                            requestCancelOrder(o);
                          } else {
                            handleStatusChange(o.id, e.target.value);
                          }
                        }}
                        className={`w-full text-xs font-bold py-1.5 border rounded-lg px-3 focus:outline-none transition-all ring-offset-1 focus:ring-2 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                          o.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-200 focus:ring-amber-500/20"
                            : o.status === "Accepted"
                              ? "bg-blue-50 text-blue-600 border-blue-200 focus:ring-blue-500/20"
                              : o.status === "Shipped"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200 focus:ring-indigo-500/20"
                                : o.status === "Arrived in Country"
                                  ? "bg-violet-50 text-violet-600 border-violet-200 focus:ring-violet-500/20"
                                  : o.status === "Arrived in City"
                                    ? "bg-pink-50 text-pink-600 border-pink-200 focus:ring-pink-500/20"
                                    : o.status === "Out for Delivery"
                                      ? "bg-orange-50 text-orange-600 border-orange-200 focus:ring-orange-500/20"
                                      : o.status === "Delivered"
                                        ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500/20"
                                        : "bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 focus:ring-red-500/20"
                        } ${updatingOrderId === o.id ? "animate-pulse" : ""}`}
                      >
                        <option value={o.status}>{o.status}</option>
                        {o.status === "Pending" && (
                          <option value="Accepted">Accepted</option>
                        )}
                        {o.status === "Accepted" && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {o.status === "Shipped" && (
                          <option value="Arrived in Country">
                            Arrived in Country
                          </option>
                        )}
                        {o.status === "Arrived in Country" && (
                          <option value="Arrived in City">
                            Arrived in City
                          </option>
                        )}
                        {o.status === "Arrived in City" && (
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                        )}
                        {o.status === "Out for Delivery" && (
                          <option value="Delivered">Delivered</option>
                        )}
                        {o.status !== "Delivered" &&
                          o.status !== "Cancelled" && (
                            <option value="Cancelled">Cancelled</option>
                          )}
                      </select>
                    )}
                    {!isAdminView && updatingOrderId === o.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-500 whitespace-nowrap border border-transparent dark:border-slate-700"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <button
          disabled={orderPage === 1}
          onClick={() => setOrderPage((p) => p - 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs lg:text-sm text-slate-500 font-medium">
          Page {orderPage} of {totalPages}
        </span>
        <button
          disabled={orderPage === totalPages || totalPages === 0}
          onClick={() => setOrderPage((p) => p + 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;
