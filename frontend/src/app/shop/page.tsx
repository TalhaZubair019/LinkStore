"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import {
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Heart,
  Eye,
  Filter,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import db from "@data/db.json";
import Toast from "@/components/products/Toast";
import QuickViewModal from "@/components/products/QuickViewModal";
import PageHeader from "@/components/ui/PageHeader";
import FilterSidebar from "@/components/shop/FilterSidebar";

const pageConfig = {
  title: "Shop",
};

const ITEMS_PER_PAGE = 16;

export default function ShopPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") || "1";
  const category = searchParams.get("category") || "All Categories";
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const vendorId = searchParams.get("vendorId") || "";
  const sortBy = searchParams.get("sort") || "Default Sorting";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("section")) params.set("section", "products");

      const [productsRes, categoriesRes, vendorsRes] = await Promise.all([
        fetch(`/api/public/content?${params.toString()}`),
        fetch("/api/public/content?section=categories&all=true"),
        fetch("/api/public/stores/list/all").catch(() => null), // I'll need to create this or handle it
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }
      if (vendorsRes && vendorsRes.ok) {
        const data = await vendorsRes.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error("Failed to fetch shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [searchParams]);

  const sortedProducts = useMemo(() => {
    let prods = [...products];
    switch (sortBy) {
      case "Sort By Price: Low To High":
        return prods.sort((a, b) => {
          const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceA - priceB;
        });
      case "Sort By Price: High To Low":
        return prods.sort((a, b) => {
          const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceB - priceA;
        });
      case "Sort By Latest":
        return prods.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
      case "Sort By Popularity":
        return prods.sort((a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0));
      default:
        return prods;
    }
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const currentPage = parseInt(page);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal = typeof product.price === "string" ? parseFloat(product.price.replace(/[^0-9.]/g, "")) : product.price;
    dispatch(addToCart({ id: product.id, name: product.title, price: priceVal, image: product.image, quantity }));
    showToast(`Added ${quantity} x "${product.title}" to cart!`, "add");
  };

  const handleToggleWishlist = (product: any) => {
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    dispatch(toggleWishlist({ id: product.id, title: product.title, price: product.price, image: product.image }));
    showToast(isWishlisted ? `Removed "${product.title}" from wishlist` : `Added "${product.title}" to wishlist`, isWishlisted ? "remove" : "add");
  };

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "Default Sorting") params.delete("sort");
    else params.set("sort", sort);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
      
      <PageHeader
        title={pageConfig.title}
        breadcrumbs={currentPage > 1 ? [{ label: "Shop", href: "/shop" }, { label: `Page ${currentPage}` }] : [{ label: "Shop" }]}
      />

      <div className="max-w-8xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:block transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <FilterSidebar categories={categories} vendors={vendors} onClose={() => setIsSidebarOpen(false)} />
          </aside>

          {/* Background Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black shadow-sm"
                >
                  <Filter size={18} />
                  Filters
                </button>
                <p className="text-sm font-bold text-slate-500 hidden sm:block">
                  Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)} Of {sortedProducts.length} Results
                </p>
              </div>

              <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={(e) => updateSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white"
                >
                  {["Default Sorting", "Sort By Popularity", "Sort By Latest", "Sort By Price: Low To High", "Sort By Price: High To Low"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-3xl h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {currentProducts.map((product: any) => (
                    <SimpleProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistItems.some((item) => item.id === product.id)}
                      isInCart={cartItems.some((item: any) => item.id === product.id)}
                      onAddToCart={(p: any) => handleAddToCart(p)}
                      onToggleWishlist={() => handleToggleWishlist(product)}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Search size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">No products found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or search term</p>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (p === 1) params.delete("page"); else params.set("page", p.toString());
                      router.push(`?${params.toString()}`, { scroll: true });
                    }}
                    className={`w-12 h-12 rounded-2xl font-black transition-all ${
                      currentPage === p 
                        ? "bg-purple-600 text-white shadow-xl shadow-purple-500/20 scale-110" 
                        : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
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

function SimpleProductCard({
  product,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCartClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (addingToCart || isOutOfStock) return;
    setAddingToCart(true);
    onAddToCart(product);
    setTimeout(() => setAddingToCart(false), 700);
  };

  const showFilled = mounted && isWishlisted;
  const showInCart = mounted && isInCart;
  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-transparent hover:border-purple-200 dark:hover:border-purple-900/40">
      <button
        onClick={onToggleWishlist}
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          showFilled
            ? "bg-red-500 text-white"
            : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
        }`}
        title={showFilled ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={showFilled ? "currentColor" : "none"} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuickView();
        }}
        className="absolute top-16 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100 translate-x-0 lg:translate-x-4 group-hover:translate-x-0"
        title="Quick View"
      >
        <Eye size={18} />
      </button>

      <div className="relative h-80 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-8 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500">
        <Link
          href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
          className="relative w-full h-full block"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-contain p-2 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ${
              isOutOfStock ? "grayscale opacity-40" : "group-hover:scale-110"
            }`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="bg-red-500/90 text-white font-black px-5 py-2.5 rounded-xl rotate-12 backdrop-blur-sm shadow-2xl border border-white/20 whitespace-nowrap text-[10px] tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </Link>
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-500 z-10 bg-black/5 dark:bg-white/5 ${isOutOfStock ? "opacity-100" : "opacity-100 lg:opacity-0 group-hover:opacity-100"}`}
        >
          {isOutOfStock ? (
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-400 text-white text-xs font-black rounded-full shadow-2xl cursor-not-allowed uppercase tracking-wider backdrop-blur-md">
              <span>Notify Me</span>
            </div>
          ) : showInCart ? (
            <>
              <button
                onClick={handleCartClick}
                disabled={addingToCart}
                className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-full shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all disabled:opacity-80 active:scale-95 uppercase tracking-wider"
              >
                {addingToCart ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingBag size={14} fill="currentColor" />
                )}
                {addingToCart ? "Adding..." : "Add Again"}
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-black rounded-full shadow-2xl hover:shadow-white/10 hover:scale-105 transition-all active:scale-95 uppercase tracking-wider border border-slate-200 dark:border-slate-700"
              >
                Cart
              </Link>
            </>
          ) : (
            <button
              onClick={handleCartClick}
              disabled={addingToCart}
              className="flex items-center gap-3 px-8 py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-full shadow-2xl hover:shadow-purple-500/40 hover:scale-110 transition-all disabled:opacity-80 active:scale-95 uppercase tracking-widest"
            >
              {addingToCart ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={16} fill="currentColor" />
              )}
              {addingToCart ? "Adding..." : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 text-center bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 transition-colors">
        <Link
          href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-black text-purple-600 dark:text-purple-400">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
