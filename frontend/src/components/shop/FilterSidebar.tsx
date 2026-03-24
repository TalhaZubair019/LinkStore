"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Filter, X, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
  vendors: any[];
  onClose?: () => void;
  activeCategoryName?: string;
}

export default function FilterSidebar({ categories, vendors, onClose, activeCategoryName }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryName || searchParams.get("category") || "All Categories");
  const [selectedVendor, setSelectedVendor] = useState(searchParams.get("vendorId") || "");

  useEffect(() => {
    if (activeCategoryName) setSelectedCategory(activeCategoryName);
  }, [activeCategoryName]);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All Categories") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page when filters change
    params.delete("page");
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("All Categories");
    setSelectedVendor("");
    router.push("/shop");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-full lg:w-80 transition-all duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearFilters}
            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Clear All"
          >
            <RotateCcw size={18} />
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
        {/* Search */}
        <section className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Search Products</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Store search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters({ search })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all font-bold dark:text-white"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Categories</label>
          <div className="flex flex-col gap-1">
            {["All Categories", ...categories.map(c => c.name || c.title)].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateFilters({ category: cat });
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat}
                {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />}
              </button>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Price Range (USD)</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-purple-400 transition-all font-bold"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-purple-400 transition-all font-bold"
            />
          </div>
          <button 
            onClick={() => updateFilters({ minPrice, maxPrice })}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Apply Price
          </button>
        </section>

        {/* Vendors */}
        {vendors.length > 0 && (
          <section className="space-y-4 pb-10">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Sellers</label>
            <select
              value={selectedVendor}
              onChange={(e) => {
                setSelectedVendor(e.target.value);
                updateFilters({ vendorId: e.target.value });
              }}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-purple-400 transition-all dark:text-white"
            >
              <option value="">All Sellers</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.vendorProfile?.storeName || v.name}</option>
              ))}
            </select>
          </section>
        )}
      </div>
    </div>
  );
}
