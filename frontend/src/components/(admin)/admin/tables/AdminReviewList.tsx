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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isStoreReview
                ? "Seller Feedback Management"
                : "Product Review Management"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isStoreReview
                ? "Manage and filter seller-level feedback"
                : "Manage and filter product-specific feedback"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100 dark:ring-purple-800/50">
              {filteredReviews.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
              {reviews.length} Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isStoreReview && (
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={16} />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 dark:text-slate-100 font-medium"
              >
                <option value="all">All Users</option>
                {(users.length > 0 ? users : uniqueUsersInReviews).map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-slate-800">
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
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Package size={16} />
              </div>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 dark:text-slate-100 font-medium"
              >
                <option value="all">All Products</option>
                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id.toString()}
                    className="dark:bg-slate-800"
                  >
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isStoreReview && (
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={16} />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 dark:text-slate-100 font-medium"
              >
                <option value="all">All Customers</option>
                {(users.length > 0 ? users : uniqueUsersInReviews).map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-slate-800">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar size={16} />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 dark:text-slate-100 font-medium"
            >
              <option value="all" className="dark:bg-slate-800">
                Total Timeline
              </option>
              <option value="week" className="dark:bg-slate-800">
                Last 7 Days
              </option>
              <option value="month" className="dark:bg-slate-800">
                Last 30 Days
              </option>
              <option value="current-month" className="dark:bg-slate-800">
                Current Month
              </option>
              <option value="custom" className="dark:bg-slate-800">
                Custom Range
              </option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter size={16} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 dark:text-slate-100 font-medium"
            >
              <option value="all" className="dark:bg-slate-800">
                Any Status
              </option>
              <option value="edited" className="dark:bg-slate-800">
                Edited Reviews
              </option>
              <option value="unedited" className="dark:bg-slate-800">
                Unedited Reviews
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
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
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
        {paginatedReviews.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 italic">
            No reviews found.
          </div>
        ) : (
          paginatedReviews.map((review) => {
            const product = getProductDetails(review.productId);
            return (
              <div
                key={review.id}
                className="p-4 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white text-sm font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                      {review.userName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {review.userName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {review.date}
                      </div>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {product && (
                  <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-50 dark:border-slate-800">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                        Product Reviewed
                      </div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                        {product.title}
                      </div>
                    </div>
                  </div>
                )}

                {isStoreReview && isAdminView && review.vendorId && (
                  <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-100 dark:border-purple-800/50">
                      <Store size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                        Store Reviewed
                      </div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                        {getVendorStoreName(review.vendorId)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-current"
                              : "text-slate-200 dark:text-slate-700"
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
                        className="text-[9px] uppercase text-blue-500 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800"
                      >
                        {expandedEditId === review.id
                          ? "Close Edit Hist."
                          : "Show Edited"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100/50 dark:border-slate-700/50">
                    "{review.comment}"
                  </p>
                </div>

                {expandedEditId === review.id && review.previousReview && (
                  <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1">
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Original Version
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`prev-mob-${i}`}
                            size={10}
                            className={
                              i < review.previousReview!.rating
                                ? "fill-current"
                                : "text-slate-200 dark:text-slate-700"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {review.previousReview.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      "{review.previousReview.comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">User</th>
              {!isStoreReview && (
                <th className="px-6 py-4 font-bold">Product</th>
              )}
              {isStoreReview && isAdminView && (
                <th className="px-6 py-4 font-bold">Store</th>
              )}
              <th className="px-6 py-4 font-bold">Rating</th>
              <th className="px-6 py-4 font-bold">Comment</th>
              <th className="px-6 py-4 font-bold">Date</th>
              {canDelete && (
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedReviews.map((review) => {
              const product = getProductDetails(review.productId);
              return (
                <Fragment key={review.id}>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold">
                          {review.userName?.[0]?.toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {review.userName}
                        </div>
                      </div>
                    </td>
                    {!isStoreReview && (
                      <td className="px-6 py-4">
                        {product ? (
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                              {product.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">
                            Unknown Product
                          </span>
                        )}
                      </td>
                    )}
                    {isStoreReview && isAdminView && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                            <Store size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {getVendorStoreName(review.vendorId)}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-slate-200 dark:text-slate-700"
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-[200px]">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {review.date}
                      {review.isEdited && (
                        <button
                          onClick={() =>
                            setExpandedEditId(
                              expandedEditId === review.id ? null : review.id,
                            )
                          }
                          className="block mt-1 text-[10px] uppercase text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors w-max px-1.5 py-0.5 rounded cursor-pointer"
                          title="View previous version"
                        >
                          Edited
                        </button>
                      )}
                    </td>
                    {canDelete && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {expandedEditId === review.id && review.previousReview && (
                    <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 ml-12 animate-in fade-in slide-in-from-top-1">
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Original Version Before Edit
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex text-amber-400 gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={`prev-${i}`}
                                  size={12}
                                  className={
                                    i < review.previousReview!.rating
                                      ? "fill-current"
                                      : "text-slate-200 dark:text-slate-700"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              {review.previousReview.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            "{review.previousReview.comment}"
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-4">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No reviews found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              No reviews match your current filter selection. Try adjusting your
              filters.
            </p>
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedProductId("all");
                setSelectedDateRange("all");
                setCustomStart("");
                setCustomEnd("");
              }}
              className="mt-6 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-6 border-t dark:border-gray-800 bg-slate-50/30 dark:bg-slate-900/30">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {(page - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(page * itemsPerPage, filteredReviews.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {filteredReviews.length}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-bold bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
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
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        page === pageToShow
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                          : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700"
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
                className="px-4 py-2 text-sm font-bold bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
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
