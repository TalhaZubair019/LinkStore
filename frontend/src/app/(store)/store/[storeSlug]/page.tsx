"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Star,
  ArrowLeft,
  Search,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/Store";
import SimpleProductCard from "@/components/(store)/products/SimpleProductCard";
import Toast from "@/components/(store)/products/Toast";
import QuickViewModal from "@/components/(store)/products/QuickViewModal";
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function VendorStorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const [store, setStore] = useState<VendorStore | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price || 0;
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceVal,
        image: product.image,
        quantity,
      }),
    );
    showToast(`Added ${quantity} x "${product.title}" to cart!`, "add");
  };

  const handleToggleWishlist = (product: any) => {
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price || 0;
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: priceVal,
        image: product.image,
      }),
    );
    showToast(
      isWishlisted
        ? `Removed "${product.title}" from wishlist`
        : `Added "${product.title}" to wishlist`,
      isWishlisted ? "remove" : "add",
    );
  };

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/stores/${storeSlug}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (res.status === 404) setError("Store not found");
          else setError("Failed to load store data");
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

    if (storeSlug) fetchStoreData();
  }, [storeSlug]);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const parsePrice = (price: any) => {
        if (typeof price === "number") return price;
        if (typeof price !== "string") return 0;
        const parsed = parseFloat(price.replace(/[^0-9.]/g, ""));
        return isNaN(parsed) ? 0 : parsed;
      };

      if (sortBy === "price-asc") {
        const diff = parsePrice(a.price) - parsePrice(b.price);
        if (diff !== 0) return diff;
      }
      if (sortBy === "price-desc") {
        const diff = parsePrice(b.price) - parsePrice(a.price);
        if (diff !== 0) return diff;
      }
      if (sortBy === "newest") {
        const diff = (b.id || 0) - (a.id || 0);
        if (diff !== 0) return diff;
      }
      if (sortBy === "oldest") {
        const diff = (a.id || 0) - (b.id || 0);
        if (diff !== 0) return diff;
      }
      // Stable sort fallback
      return String(a.id).localeCompare(String(b.id));
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F2] dark:bg-[#110F17] transition-colors pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 space-y-12">
          <div className="w-full h-64 rounded-4xl bg-[#E8E4DC] dark:bg-[#1A1725] animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[350px] bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCF9F2] dark:bg-[#110F17] p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-4xl p-12 shadow-xl border border-slate-200 dark:border-white/10 text-center max-w-md">
          <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-[#1E2749] mx-auto mb-8 border border-slate-200 dark:border-white/10">
            <Store size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-[#1E2749] dark:text-white mb-3">
            {error || "Store Not Found"}
          </h1>
          <p className="text-[#5B6B8F] dark:text-[#9BA1B0] mb-10 font-medium">
            The requested store profile is currently unavailable or does not
            exist.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#1E2749]text-white font-bold rounded-xl transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const {
    storeName,
    storeDescription,
    logo,
    banner,
    joinedDate,
    averageRating,
    name: ownerName,
  } = store;

  return (
    <div className="min-h-screen bg-[#FCF9F2] dark:bg-[#110F17] transition-colors font-sans pb-32 selection:bg-[#1E2749] selection:text-[#FCF9F2] dark:selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 relative z-20">
        <div className="gap-12 xl:gap-24">
          <div className="shrink-0">
            <div className="xl:sticky top-32 flex flex-col items-start text-left">
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.85] uppercase break-word mb-8">
                {storeName}
              </h1>
              <div className="w-full h-px bg-slate-950 dark:bg-white mb-8" />
              <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-medium leading-snug tracking-tight mb-8 max-w-lg">
                {storeDescription ||
                  "A curated selection of premium goods by a verified professional vendor."}
              </p>

              <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-slate-950 dark:border-white">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">
                    Owner
                  </span>
                  <span className="text-lg font-bold text-slate-950 dark:text-white">
                    {ownerName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">
                    Rating
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-slate-950 dark:text-white leading-none">
                      {averageRating || "0.0"}
                    </span>
                    <Star
                      className="fill-slate-950 text-slate-950 dark:fill-white dark:text-white"
                      size={14}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">
                    Status
                  </span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck
                      size={16}
                      className="text-slate-950 dark:text-white"
                    />
                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">
                    Established
                  </span>
                  <span className="text-sm font-bold text-slate-950 dark:text-white">
                    {joinedDate
                      ? new Date(joinedDate).getFullYear()
                      : new Date().getFullYear()}
                  </span>
                </div>
              </div>
              {logo && (
                <div className="mt-12 relative w-24 h-24 grayscale contrast-125">
                  <Image
                    src={logo}
                    alt={storeName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grow min-w-0">
            <div className="mb-8 pt-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Filters
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white"
                  >
                    <option value="newest">Sorted By Latest</option>
                    <option value="oldest">Sorted By Oldest</option>
                    <option value="price-asc">Price: Low To High</option>
                    <option value="price-desc">Price: High - Low</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                <div className="relative grow w-full group">
                  <Search
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-0 py-3 bg-transparent border-b-2 border-slate-900 dark:border-white outline-none transition-all text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block w-64 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Categories
                </h2>
                <ul className="space-y-2">
                  {categories.map((cat: any) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                          selectedCategory === cat
                            ? "bg-slate-900 text-white dark:bg-zinc-800 dark:text-white"
                            : "text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
                <div className="grow">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="h-full">
                          <SimpleProductCard
                            product={product}
                            isWishlisted={wishlistItems.some(
                              (item) => item.id === product.id,
                            )}
                            isInCart={cartItems.some(
                              (item: any) => item.id === product.id,
                            )}
                            onAddToCart={(p: any) => handleAddToCart(p)}
                            onToggleWishlist={() =>
                              handleToggleWishlist(product)
                            }
                            onQuickView={() => setQuickViewProduct(product)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-white dark:bg-zinc-900 rounded-4xl border border-slate-200 dark:border-white/10">
                      <Search
                        size={40}
                        className="mx-auto mb-4 text-slate-300 dark:text-zinc-700"
                      />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        No items found
                      </h3>
                      <p className="text-slate-500 dark:text-zinc-400">
                        Try adjusting your search or filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                        }}
                        className="mt-6 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </div>
  );
}
