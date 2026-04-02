"use client";

import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f16] transition-colors font-sans pb-32">
      {/* Dynamic Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900">
        {banner ? (
          <Image
            src={banner}
            alt="Store Banner"
            fill
            className="object-cover opacity-80"
            unoptimized
          />
        ) : logo ? (
          <div className="absolute inset-0 opacity-30 blur-3xl scale-125">
            <Image
              src={logo}
              alt="Store Background"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-50 dark:from-[#0a0f16] to-transparent via-slate-50/40 dark:via-[#0a0f16]/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-40 z-20">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm transition-all mb-6 shadow-sm"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Go Back
        </button>

        {/* Floating Profile Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
            {logo ? (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-200 dark:border-white/10">
                <Image
                  src={logo}
                  alt={storeName}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-xl">
                <Store size={48} className="text-slate-400" />
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col items-start w-full">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.9] uppercase mb-4">
                {storeName}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-snug tracking-tight mb-8 max-w-2xl bg-white/50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-sm">
                {storeDescription ||
                  "A curated selection of premium goods by a verified professional vendor."}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 w-full pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">
                    Owner
                  </span>
                  <span className="text-sm font-bold text-slate-950 dark:text-white truncate">
                    {ownerName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">
                    Rating
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      {averageRating || "0.0"}
                    </span>
                    <Star
                      className="fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      size={14}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">
                    Status
                  </span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck
                      size={16}
                      className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">
                    Established
                  </span>
                  <span className="text-sm font-bold text-slate-950 dark:text-white">
                    {joinedDate
                      ? new Date(joinedDate).getFullYear()
                      : new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Filters & Search Row */}
        <div className="sticky top-20 z-40 bg-slate-50/90 dark:bg-[#0a0f16]/90 backdrop-blur-xl py-4 border-b border-slate-200 dark:border-white/10 mb-8 sm:mb-12 transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest hidden lg:block mr-4">
              Explore
            </h2>
            <div className="relative group w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3.5 pr-12 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 dark:text-slate-200 [&>option]:bg-white [&>option]:dark:bg-slate-900"
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
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500/50 dark:focus:border-purple-500/50 rounded-2xl text-[13px] font-bold outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Body */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
          {/* Categories Horizontal Scroll (Mobile) / Sidebar Sidebar (Desktop) */}
          <div className="w-full lg:w-48 xl:w-64 shrink-0 lg:sticky lg:top-48 z-30">
            <h2 className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 px-2">
              Categories
            </h2>
            <div className="overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
              <ul className="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0">
                {categories.map((cat: any) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 lg:px-4 lg:py-3 lg:w-full text-left rounded-xl transition-all font-bold text-[13px] border whitespace-nowrap lg:whitespace-normal ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white border-transparent dark:bg-white/10 dark:border-white/20 shadow-md"
                          : "bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grow min-w-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                      onToggleWishlist={() => handleToggleWishlist(product)}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  No items found
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                  Try adjusting your search query or switching categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[13px] uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}
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
