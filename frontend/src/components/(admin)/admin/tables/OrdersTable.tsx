"use client";
import { useState, useMemo, useEffect } from "react";
import { Eye, User, Filter, FilterX, Calendar } from "lucide-react";
import { Order as BaseOrder } from "@/app/(admin)/admin/types";

interface Order extends BaseOrder {
  vendorStatuses?: { vendorId: string; status: string }[];
}

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
  currentVendorId?: string;
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
  currentVendorId,
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
      className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl animate-in fade-in duration-700 group/table"
    >
      <div className="p-5 lg:p-8 border-b border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden transition-colors">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Order Management
              </h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">
                Track and manage customer shipments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-purple-500/20">
              {filteredOrders.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-slate-200 dark:ring-white/5">
              {allOrders.length} Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          {derivedUsers.length > 0 && (
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <User size={16} strokeWidth={2.5} />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Customers</option>
                {derivedUsers.map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-[#1a1c23]">
                    {u.name}
                    {u.name && nameFrequencies[u.name] > 1 && u.email
                      ? ` (${u.email})`
                      : ""}
                  </option>
                ))}
                {hasDeletedAccounts && (
                  <option
                    value="deleted"
                    className="text-red-500 font-bold bg-white dark:bg-[#1a1c23]"
                  >
                    Deleted Accounts
                  </option>
                )}
              </select>
            </div>
          )}

          <div className="relative flex-1 min-w-[200px] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
              <Filter size={16} strokeWidth={2.5} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
            >
              <option value="all" className="dark:bg-[#1a1c23]">
                Any Status
              </option>
              {[
                "Pending",
                "Processing",
                "Accepted",
                "Shipped",
                "Arrived in Country",
                "Arrived in City",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
              ].map((s) => (
                <option key={s} value={s} className="dark:bg-[#1a1c23]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
            >
              <option value="all" className="dark:bg-[#1a1c23]">
                Total Timeline
              </option>
              <option value="week" className="dark:bg-[#1a1c23]">
                Last 7 Days
              </option>
              <option value="month" className="dark:bg-[#1a1c23]">
                Last 30 Days
              </option>
              <option value="current-month" className="dark:bg-[#1a1c23]">
                Current Month
              </option>
              <option value="custom" className="dark:bg-[#1a1c23]">
                Custom Range
              </option>
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-95 shrink-0 uppercase tracking-widest border border-transparent hover:border-red-500/20"
            >
              <FilterX size={16} strokeWidth={3} />
              Clear
            </button>
          )}
        </div>

        {selectedDateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-4 p-5 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-100 dark:border-white/5 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                From
              </label>
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                To
              </label>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5 transition-colors">
        {paginatedOrders?.length === 0 ? (
          <div className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Filter size={24} className="opacity-50" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No orders found
            </p>
          </div>
        ) : (
          paginatedOrders?.map((o) => (
            <div
              key={o.id}
              className="p-5 lg:p-8 space-y-5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all group/card relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                    <span className="font-mono text-[13px] font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                      #{String(o.id).slice(-8).toUpperCase()}
                    </span>
                  </div>
                  {isAdminView && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest w-fit">
                      {o.vendorStoreName || "Internal"}
                    </div>
                  )}
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {new Date(o.date).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </div>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                  <span className="text-xs text-slate-400 mr-0.5">$</span>
                  {typeof o.total === "number" ? o.total.toFixed(2) : o.total}
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-white/3 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">
                    Customer
                  </span>
                  {o.customer?.name ? (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[11px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 shrink-0">
                        {o.customer.name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] text-slate-800 dark:text-slate-200 font-bold truncate tracking-tight uppercase">
                          {o.customer.name}
                        </div>
                        {!hideEmail && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate lowercase">
                            {o.customer.email}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-black uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10 italic">
                      Deleted Account
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="relative flex-1 min-w-[140px]">
                  {isAdminView ? (
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        o.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : o.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : o.status === "Cancelled"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          o.status === "Pending"
                            ? "bg-amber-500"
                            : o.status === "Delivered"
                              ? "bg-emerald-500"
                              : o.status === "Cancelled"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                      />
                      {o.status}
                    </div>
                  ) : (
                    <div className="relative group">
                      {(() => {
                        const displayStatus =
                          currentVendorId && o.vendorStatuses
                            ? o.vendorStatuses.find(
                                (vs: any) => vs.vendorId === currentVendorId,
                              )?.status || o.status
                            : o.status;

                        return (
                          <select
                            value={displayStatus}
                            disabled={
                              updatingOrderId === o.id ||
                              displayStatus === "Delivered" ||
                              displayStatus === "Cancelled"
                            }
                            onChange={(e) => {
                              if (e.target.value === "Cancelled") {
                                requestCancelOrder(o);
                              } else {
                                handleStatusChange(o.id, e.target.value);
                              }
                            }}
                            className={`w-full text-[11px] font-black py-2.5 border rounded-xl px-4 focus:outline-none transition-all appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 uppercase tracking-widest ${
                              displayStatus === "Pending"
                                ? "text-amber-500 border-amber-500/20 focus:ring-amber-500/10"
                                : displayStatus === "Processing"
                                  ? "text-orange-500 border-orange-500/20 focus:ring-orange-500/10"
                                  : displayStatus === "Accepted"
                                    ? "text-blue-500 border-blue-500/20 focus:ring-blue-500/10"
                                    : displayStatus === "Shipped"
                                      ? "text-indigo-500 border-indigo-500/20 focus:ring-indigo-500/10"
                                      : displayStatus === "Delivered"
                                        ? "text-emerald-500 border-emerald-500/20 focus:ring-emerald-500/10"
                                        : "text-red-500 border-red-500/20 focus:ring-red-500/10"
                            } ${updatingOrderId === o.id ? "animate-pulse" : ""}`}
                          >
                            <option value={displayStatus}>
                              {displayStatus}
                            </option>
                            {displayStatus === "Pending" && (
                              <option value="Accepted">Accepted</option>
                            )}
                            {displayStatus === "Accepted" && (
                              <option value="Shipped">Shipped</option>
                            )}
                            {displayStatus === "Shipped" && (
                              <option value="Arrived in Country">
                                In Country
                              </option>
                            )}
                            {displayStatus === "Arrived in Country" && (
                              <option value="Arrived in City">In City</option>
                            )}
                            {displayStatus === "Arrived in City" && (
                              <option value="Out for Delivery">
                                Out For Delivery
                              </option>
                            )}
                            {displayStatus === "Out for Delivery" && (
                              <option value="Delivered">Mark Delivered</option>
                            )}
                            {displayStatus !== "Delivered" &&
                              displayStatus !== "Cancelled" && (
                                <option value="Cancelled">Cancel</option>
                              )}
                          </select>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="flex items-center justify-center gap-2 text-[10px] font-black text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 uppercase tracking-widest whitespace-nowrap"
                >
                  <Eye size={16} strokeWidth={2.5} /> View Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                Order Info
              </th>
              {isAdminView && (
                <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                  Vendor
                </th>
              )}
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Customer
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Total
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Status
              </th>
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedOrders?.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all group/row"
              >
                <td className="px-10 py-5">
                  <div className="flex flex-col whitespace-nowrap">
                    <div className="flex items-center gap-2 line-height-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                      <span className="font-mono text-[13px] font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        #{o.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 ml-3.5">
                      {new Date(o.date).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </td>
                {isAdminView && (
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 text-[10px] font-black uppercase tracking-widest">
                      {o.vendorStoreName || "Internal"}
                    </div>
                  </td>
                )}
                <td className="px-8 py-5">
                  <div className="min-w-[140px]">
                    {o.customer?.name ? (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[11px] font-black text-slate-500 border border-slate-200 dark:border-white/10">
                          {o.customer.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] text-slate-700 dark:text-slate-200 font-black tracking-tight uppercase">
                            {o.customer.name}
                          </div>
                          {!hideEmail && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold lowercase truncate max-w-[120px]">
                              {o.customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest italic bg-red-500/5 px-2 py-0.5 rounded">
                        Deleted Account
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 font-black text-[13px] text-slate-900 dark:text-slate-100 tabular-nums">
                  <span className="text-[10px] text-slate-400 mr-0.5">$</span>
                  {typeof o.total === "number" ? o.total.toFixed(2) : o.total}
                </td>
                <td className="px-8 py-5">
                  {/* Status Display/Selector */}
                  <div className="min-w-[140px]">
                    {isAdminView ? (
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                          o.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : o.status === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : o.status === "Cancelled"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            o.status === "Pending"
                              ? "bg-amber-500 shadow-[0_0_5px_#f59e0b]"
                              : o.status === "Delivered"
                                ? "bg-emerald-500 shadow-[0_0_5px_#10b981]"
                                : o.status === "Cancelled"
                                  ? "bg-red-500 shadow-[0_0_5px_#ef4444]"
                                  : "bg-blue-500 shadow-[0_0_5px_#3b82f6]"
                          }`}
                        />
                        {o.status}
                      </div>
                    ) : (
                      <div className="relative group">
                        {/* Vendor Status Selector */}
                        {(() => {
                          const displayStatus =
                            currentVendorId && o.vendorStatuses
                              ? o.vendorStatuses.find(
                                  (vs: any) => vs.vendorId === currentVendorId,
                                )?.status || o.status
                              : o.status;

                          return (
                            <select
                              value={displayStatus}
                              disabled={
                                updatingOrderId === o.id ||
                                displayStatus === "Delivered" ||
                                displayStatus === "Cancelled"
                              }
                              onChange={(e) => {
                                if (e.target.value === "Cancelled") {
                                  requestCancelOrder(o);
                                } else {
                                  handleStatusChange(o.id, e.target.value);
                                }
                              }}
                              className={`w-full text-[10px] font-black py-1.5 border rounded-xl px-3 focus:outline-none transition-all appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 uppercase tracking-widest ${
                                displayStatus === "Pending"
                                  ? "text-amber-500 border-amber-500/20 focus:ring-amber-500/10"
                                  : displayStatus === "Processing"
                                    ? "text-orange-500 border-orange-500/20 focus:ring-orange-500/10"
                                    : "text-blue-500 border-blue-500/20 focus:ring-blue-500/10"
                              } ${updatingOrderId === o.id ? "animate-pulse" : ""}`}
                            >
                              <option value={displayStatus}>
                                {displayStatus}
                              </option>
                              <option value="Accepted">Accept</option>
                              <option value="Shipped">Ship</option>
                              <option value="Delivered">Deliver</option>
                              <option value="Cancelled">Cancel</option>
                            </select>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-10 py-5 text-right">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 active:scale-95 shadow-sm group/btn"
                    title="Inspect Resource"
                  >
                    <Eye
                      size={18}
                      strokeWidth={2.5}
                      className="group-hover/btn:scale-110 transition-transform"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 gap-6">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            disabled={orderPage === 1}
            onClick={() => setOrderPage((p) => p - 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5 mx-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageToShow = orderPage;
              if (orderPage <= 3) pageToShow = i + 1;
              else if (orderPage >= totalPages - 2)
                pageToShow = totalPages - 4 + i;
              else pageToShow = orderPage - 2 + i;

              if (pageToShow <= 0 || pageToShow > totalPages) return null;

              return (
                <button
                  key={pageToShow}
                  onClick={() => setOrderPage(pageToShow)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all active:scale-90 ${
                    orderPage === pageToShow
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-500"
                      : "bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10"
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
          </div>

          <button
            disabled={orderPage === totalPages || totalPages === 0}
            onClick={() => setOrderPage((p) => p + 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1 order-1 sm:order-2">
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
            Pages
          </span>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">
            {orderPage}{" "}
            <span className="text-slate-300 dark:text-slate-700 mx-2">/</span>{" "}
            {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
