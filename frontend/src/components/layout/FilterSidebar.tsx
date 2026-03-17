"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          Categories <ChevronDown size={14} className="text-gray-400" />
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.name === 'All Categories' ? 'all' : cat.name })}
              className={`block w-full text-left text-sm py-2 px-3 rounded-xl transition-all ${
                currentCategory === (cat.name === 'All Categories' ? 'all' : cat.name)
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          Price Range <SlidersHorizontal size={14} className="text-gray-400" />
        </h3>
        <div className="flex gap-2 items-center mb-4">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onBlur={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden"
          />
          <span className="text-gray-300">-</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onBlur={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden"
          />
        </div>
      </div>

      {/* Sorting (Mobile Only or additional) */}
      <div className="md:hidden">
         <select 
           value={currentSort}
           onChange={(e) => updateFilters({ sort: e.target.value })}
           className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 shadow-sm"
         >
           <option value="newest">Latest Arrivals</option>
           <option value="price-asc">Price: Low to High</option>
           <option value="price-desc">Price: High to Low</option>
         </select>
      </div>
    </aside>
  );
}
