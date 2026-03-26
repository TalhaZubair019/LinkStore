"use client";
import React, { useEffect, useState } from "react";
import AdminReviewList from "@/components/(admin)/admin/tables/AdminReviewList";

export default function AdminReviewsPage() {
  const [data, setData] = useState<{ reviews: any[]; products: any[] } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const stats = await res.json();
        setData({
          reviews: stats.reviews || [],
          products: stats.products || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 flex justify-center items-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Reviews Management
        </h1>
      </div>
      <AdminReviewList
        reviews={data.reviews}
        products={data.products}
        onReviewDeleted={fetchReviews}
        page={0}
        setPage={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
        itemsPerPage={0}
        searchTerm={""}
      />
    </div>
  );
}
