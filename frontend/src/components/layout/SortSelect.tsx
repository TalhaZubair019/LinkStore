"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Sort By</span>
      <select 
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500/10 outline-hidden cursor-pointer"
      >
        <option value="newest">Latest Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
