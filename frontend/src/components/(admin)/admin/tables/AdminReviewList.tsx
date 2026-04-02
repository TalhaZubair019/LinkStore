"use client";

import { useState, useMemo, Fragment } from "react";
import {
  Star,
  Trash2,
  User,
  Package,
  Filter,
  FilterX,
  Calendar,
  Store,
} from "lucide-react";
import Image from "next/image";
import Toast from "@/components/(store)/products/Toast";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  productId: number;
  vendorId?: string;
  isEdited?: boolean;
  previousReview?: {
    rating: number;
    comment: string;
    date: string;
  };
}

interface Product {
  id: number;
  title: string;
  image: string;
}

interface AdminReviewListProps {
  onReviewDeleted?: () => void;
  reviews: Review[];
  products: Product[];
  users?: any[];
  isStoreReview?: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  searchTerm: string;
  isAdminView?: boolean;
}

export default function AdminReviewList({
  onReviewDeleted,
  reviews,
  products,
  users = [],
  isStoreReview = false,
  page,
  setPage,
  itemsPerPage,
  searchTerm,
  isAdminView = false,
}: AdminReviewListProps) {
  const canDelete = isAdminView;
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [expandedEditId, setExpandedEditId] = useState<string | null>(null);

  const nameFrequencies = useMemo(() => {
    const freqs: Record<string, number> = {};
    users.forEach((u) => {
      freqs[u.name] = (freqs[u.name] || 0) + 1;
    });
    return freqs;
  }, [users]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchMatch =
        !searchTerm ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      const userMatch =
        selectedUserId === "all" || review.userId === selectedUserId;
      const productMatch =
        selectedProductId === "all" ||
        review.productId.toString() === selectedProductId;

      let dateMatch = true;
      if (selectedDateRange !== "all") {
        const reviewDate = new Date(review.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDateRange === "week") {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          dateMatch = reviewDate >= lastWeek && reviewDate <= today;
        } else if (selectedDateRange === "month") {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          dateMatch = reviewDate >= lastMonth && reviewDate <= today;
        } else if (selectedDateRange === "current-month") {
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
          );
          dateMatch = reviewDate >= startOfMonth && reviewDate <= today;
        } else if (selectedDateRange === "custom" && customStart && customEnd) {
          const start = new Date(customStart);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          dateMatch = reviewDate >= start && reviewDate <= end;
        }
      }

      const statusMatch =
        selectedStatus === "all" ||
        (selectedStatus === "edited" && review.isEdited) ||
        (selectedStatus === "unedited" && !review.isEdited);

      return userMatch && productMatch && dateMatch && statusMatch;
    });
  }, [
    reviews,
    selectedUserId,
    selectedProductId,
    selectedDateRange,
    selectedStatus,
    customStart,
    customEnd,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const uniqueUsersInReviews = useMemo(() => {
    const userMap = new Map<string, string>();
    reviews.forEach((r) => {
      if (!userMap.has(r.userId)) {
        userMap.set(r.userId, r.userName);
      }
    });
    return Array.from(userMap.entries()).map(([id, name]) => ({
      id,
      name,
      email: undefined as string | undefined,
    }));
  }, [reviews]);

  const getProductDetails = (productId: number) => {
    return products.find((p) => p.id === productId);
  };

  const getVendorStoreName = (vendorId?: string) => {
    if (!vendorId) return "Unknown Store";
    const vendor = users.find((u) => u.id === vendorId);
    return vendor?.vendorProfile?.storeName || vendor?.name || "Unknown Store";
  };

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Review deleted successfully", "remove");
        if (onReviewDeleted) onReviewDeleted();
      } else {
        showToast("Failed to delete review", "remove");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error connecting to server", "remove");
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl animate-in fade-in duration-700 group/table">
      <div className="p-8 border-b border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                {isStoreReview
                  ? "Seller Feedback Management"
                  : "Product Review Management"}
              </h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">
                {isStoreReview
                  ? "Manage and filter seller-level feedback"
                  : "Manage and filter product-specific feedback"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-purple-500/20">
              {filteredReviews.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-slate-200 dark:ring-white/5">
              {reviews.length} Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          {!isStoreReview && (
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <User size={16} strokeWidth={2.5} />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Users</option>
                {(users.length > 0 ? users : uniqueUsersInReviews).map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-[#1a1c23]">
                    {u.name}
                    {u.name && nameFrequencies[u.name] > 1 && u.email
                      ? ` (${u.email})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isStoreReview && (
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Package size={16} strokeWidth={2.5} />
              </div>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Products</option>
                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id.toString()}
                    className="dark:bg-[#1a1c23]"
                  >
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isStoreReview && (
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
                {(users.length > 0 ? users : uniqueUsersInReviews).map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-[#1a1c23]">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              <option value="edited" className="dark:bg-[#1a1c23]">
                Edited Reviews
              </option>
              <option value="unedited" className="dark:bg-[#1a1c23]">
                Original Reviews
              </option>
            </select>
          </div>

          {(selectedUserId !== "all" ||
            selectedProductId !== "all" ||
            selectedDateRange !== "all" ||
            selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedProductId("all");
                setSelectedDateRange("all");
                setSelectedStatus("all");
                setCustomStart("");
                setCustomEnd("");
              }}
              className="flex items-center gap-2 px-5 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-95 shrink-0 uppercase tracking-widest border border-transparent hover:border-red-500/20"
            >
              <FilterX size={16} strokeWidth={3} />
              Clear
            </button>
          )}
        </div>

        {selectedDateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                From
              </label>
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                To
              </label>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        )}
      </div>
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5 border-t border-slate-100 dark:border-white/5">
        {paginatedReviews.length === 0 ? (
          <div className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Filter size={24} className="opacity-50" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No reviews found.
            </p>
          </div>
        ) : (
          paginatedReviews.map((review) => {
            const product = getProductDetails(review.productId);
            return (
              <div
                key={review.id}
                className="p-6 space-y-5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all group/card relative"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white text-sm font-black shrink-0 border border-slate-200 dark:border-white/10 group-hover/card:border-purple-300 dark:group-hover/card:border-white/20 transition-all shadow-sm">
                      {review.userName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 dark:text-slate-100 text-[13px] truncate uppercase tracking-tight">
                        {review.userName}
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest whitespace-nowrap mt-0.5">
                        {review.date}
                      </div>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1c23] shadow-sm"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                {product && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/3 rounded-2xl border border-slate-100 dark:border-white/5 group/img">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 shadow-inner">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5 opacity-80 group-hover/img:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">
                        Product Reviewed
                      </div>
                      <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate tracking-tight uppercase">
                        {product.title}
                      </div>
                    </div>
                  </div>
                )}

                {isStoreReview && isAdminView && review.vendorId && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-500/20 shadow-sm">
                      <Store size={20} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">
                        Store Reviewed
                      </div>
                      <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate uppercase">
                        {getVendorStoreName(review.vendorId)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-1 opacity-80">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          strokeWidth={i < review.rating ? 0 : 2}
                          className={
                            i < review.rating
                              ? "fill-current drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]"
                              : "text-slate-200 dark:text-white/10"
                          }
                        />
                      ))}
                    </div>
                    {review.isEdited && (
                      <button
                        onClick={() =>
                          setExpandedEditId(
                            expandedEditId === review.id ? null : review.id,
                          )
                        }
                        className="text-[9px] uppercase tracking-widest text-blue-500 dark:text-blue-400 font-black bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 transition-all active:scale-95"
                      >
                        {expandedEditId === review.id
                          ? "Hide History"
                          : "Show Edited"}
                      </button>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-white/1 p-4 rounded-2xl border border-slate-100/50 dark:border-white/5 italic">
                    "{review.comment}"
                  </p>
                </div>

                {expandedEditId === review.id && review.previousReview && (
                  <div className="mt-3 p-4 bg-white dark:bg-white/2 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-3">
                      Original Version
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex text-amber-400 gap-1 opacity-60">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`prev-mob-${i}`}
                            size={10}
                            strokeWidth={
                              i < review.previousReview!.rating ? 0 : 2
                            }
                            className={
                              i < review.previousReview!.rating
                                ? "fill-current"
                                : "text-slate-200 dark:text-white/10"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                        {review.previousReview.date}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-500 italic leading-relaxed">
                      "{review.previousReview.comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                User
              </th>
              {!isStoreReview && (
                <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  Product
                </th>
              )}
              {isStoreReview && isAdminView && (
                <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  Store
                </th>
              )}
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                Rating
              </th>
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                Comment
              </th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                Date
              </th>
              {canDelete && (
                <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedReviews.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdminView ? 7 : 6}
                  className="px-10 py-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
                      <Filter size={32} className="opacity-30" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">
                      Zero Point Evaluation Results
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedReviews.map((review) => {
                const product = getProductDetails(review.productId);
                return (
                  <Fragment key={review.id}>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all group/row">
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-black border border-slate-200 dark:border-white/10 group-hover/row:border-blue-400 dark:group-hover/row:border-white/20 transition-all">
                            {review.userName?.[0]?.toUpperCase()}
                          </div>
                          <div className="font-black text-slate-900 dark:text-slate-100 text-[13px] uppercase tracking-tight">
                            {review.userName}
                          </div>
                        </div>
                      </td>
                      {!isStoreReview && (
                        <td className="px-6 py-5">
                          {product ? (
                            <div className="flex items-center gap-4 group/img">
                              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 shadow-inner">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-contain p-1.5 opacity-80 group-hover/img:opacity-100 transition-opacity"
                                />
                              </div>
                              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest truncate max-w-[120px]">
                                {product.title}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">
                              Unknown Product
                            </span>
                          )}
                        </td>
                      )}
                      {isStoreReview && isAdminView && (
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-sm">
                              <Store size={14} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest truncate max-w-[150px]">
                              {getVendorStoreName(review.vendorId)}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-5">
                        <div className="flex text-amber-400 gap-1 opacity-80">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              strokeWidth={i < review.rating ? 0 : 2}
                              className={
                                i < review.rating
                                  ? "fill-current drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]"
                                  : "text-slate-200 dark:text-white/10"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium italic line-clamp-2 max-w-[250px]">
                          "{review.comment}"
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest tabular-nums">
                            {review.date}
                          </span>
                          {review.isEdited && (
                            <button
                              onClick={() =>
                                setExpandedEditId(
                                  expandedEditId === review.id
                                    ? null
                                    : review.id,
                                )
                              }
                              className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 hover:bg-blue-500/20 transition-all w-max active:scale-95"
                            >
                              Edited
                            </button>
                          )}
                        </div>
                      </td>
                      {canDelete && (
                        <td className="px-10 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5 active:scale-95 shadow-sm"
                              title="Delete Review"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandedEditId === review.id && review.previousReview && (
                      <tr className="bg-slate-50/50 dark:bg-white/1">
                        <td
                          colSpan={isAdminView ? 7 : 6}
                          className="px-10 py-8"
                        >
                          <div className="flex flex-col gap-4 p-6 bg-white dark:bg-white/2 rounded-4xl border border-dashed border-slate-200 dark:border-white/10 ml-12 animate-in fade-in slide-in-from-top-2 shadow-inner">
                            <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
                              Original Version Before Edit
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex text-amber-400 gap-1 opacity-60">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={`prev-${i}`}
                                    size={12}
                                    strokeWidth={
                                      i < review.previousReview!.rating ? 0 : 2
                                    }
                                    className={
                                      i < review.previousReview!.rating
                                        ? "fill-current"
                                        : "text-slate-200 dark:text-white/10"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest tabular-nums">
                                {review.previousReview.date}
                              </span>
                            </div>
                            <p className="text-[13px] text-slate-500 dark:text-slate-500 italic bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 leading-relaxed">
                              "{review.previousReview.comment}"
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 gap-6">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-1.5 mx-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageToShow = page;
                  if (page <= 3) pageToShow = i + 1;
                  else if (page >= totalPages - 2)
                    pageToShow = totalPages - 4 + i;
                  else pageToShow = page - 2 + i;

                  if (pageToShow <= 0 || pageToShow > totalPages) return null;

                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setPage(pageToShow)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all active:scale-90 ${
                        page === pageToShow
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
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                Next
              </button>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1 order-1 sm:order-2">
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
                Logic Evaluation Page
              </span>
              <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">
                {page}{" "}
                <span className="text-slate-300 dark:text-slate-700 mx-2">
                  /
                </span>{" "}
                {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
