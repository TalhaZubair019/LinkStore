"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, MapPin, Calendar, Star, Info, Package, ArrowLeft, Search, CheckCircle, Filter, ArrowDownUp } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface VendorStore {
  id: string;
  name: string;
  storeName: string;
  storeDescription: string;
  logo: string;
  banner: string;
  joinedDate: string;
  averageRating: number;
  totalReviews: number;
  recentReviews: any[];
}

export default function VendorStorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [store, setStore] = useState<VendorStore | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/stores/${storeSlug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Store not found");
          } else {
            setError("Failed to load store data");
          }
          return;
        }
        const data = await res.json();
        setStore(data.store);
        setProducts(data.products);
      } catch (err) {
        console.error("Fetch store error:", err);
        setError("An error occurred while fetching store data");
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug) {
      fetchStoreData();
    }
  }, [storeSlug]);

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const parsePrice = (price: any) => typeof price === "string" ? parseFloat(price.replace(/[^0-9.]/g, "")) : (price || 0);
      if (sortBy === "price-asc") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-desc") return parsePrice(b.price) - parsePrice(a.price);
      return 0; // maintain newest default from backend
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="h-64 md:h-80 bg-slate-200 dark:bg-slate-900 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
              <div className="w-32 h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 4, 8].map(i => (
              <div key={i} className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <Store size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{error || "Store Not Found"}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            The store you're looking for might have been closed, renamed, or doesn't exist.
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <ArrowLeft size={18} /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans pb-20">
      {/* Store Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        {store.banner ? (
          <Image 
            src={store.banner} 
            alt={store.storeName} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-900" />
        )}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10">
        {/* Store Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-4xl p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Logo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 group">
              <div className="absolute -inset-2 bg-linear-to-r from-blue-500 to-cyan-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-full h-full rounded-3xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-xl">
                {store.logo ? (
                  <Image src={store.logo} alt={store.storeName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <Store size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {store.storeName}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                    <span className="text-blue-500 font-bold">@{storeSlug}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span>Owner: {store.name}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-black border border-amber-100 dark:border-amber-800/30">
                    <Star size={16} fill="currentColor" />
                    {store.averageRating || "0.0"} ({store.totalReviews || 0} Reviews)
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-2">
                    <CheckCircle size={16} /> Verified Store
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {store.storeDescription || "This vendor hasn't provided a store description yet. Welcome to their official marketplace storefront!"}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-sm font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Calendar size={16} className="text-slate-400" />
                      <span>Joined {new Date(store.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Package size={16} className="text-slate-400" />
                      <span>{products.length} Products</span>
                    </div>
                  </div>
                </div>

                {store.recentReviews && store.recentReviews.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Recent Seller Feedback</h3>
                    <div className="space-y-3">
                      {store.recentReviews.map((review, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"} />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{review.date}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 italic">"{review.comment}"</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-black">
                              {review.userName?.charAt(0) || "U"}
                            </div>
                            <span className="text-[10px] font-black text-slate-500">{review.userName || "Verified Buyer"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Products */}
        <div className="mt-16 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Store Collection
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {filteredProducts.length}
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative w-full sm:w-auto min-w-[160px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm font-semibold appearance-none cursor-pointer"
                >
                  {categories.map((cat: any) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs text-[9px]">▼</div>
              </div>

              {/* Sorting Filter */}
              <div className="relative w-full sm:w-auto min-w-[180px]">
                <ArrowDownUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm font-semibold appearance-none cursor-pointer"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs text-[9px]">▼</div>
              </div>

              {/* Search */}
              <div className="relative group w-full sm:w-auto min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search this store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layoutId={product.id.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-center"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => {}}
                      onToggleWishlist={() => {}}
                      onQuickView={() => {}}
                      onCompare={() => {}}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query or check back later.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
