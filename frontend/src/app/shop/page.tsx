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

  const pageParam = searchParams.get("page");
  const catParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const qParam = searchParams.get("q");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1,
  );
  const [sortBy, setSortBy] = useState(sortParam || "Default Sorting");
  const [searchTerm, setSearchTerm] = useState(qParam || "");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    catParam || "All Categories",
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(pageParam ? parseInt(pageParam) : 1);
    setSelectedCategory(catParam || "All Categories");
    setSortBy(sortParam || "Default Sorting");
    setSearchTerm(qParam || "");
  }, [pageParam, catParam, sortParam, qParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/public/content?section=products"),
          fetch("/api/public/content?section=categories&all=true").catch(
            () => null,
          ),
        ]);

        if (productsResponse.ok) {
          const data = await productsResponse.json();
          setProducts(data.products || []);
        }

        if (categoriesResponse && categoriesResponse.ok) {
          const catData = await categoriesResponse.json();
          setCategories(catData.categories || []);
        } else {
          setCategories(db.categories.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "All Categories") {
      const activeCat = categories.find(
        (c: any) => c.title === selectedCategory || c.name === selectedCategory,
      );

      if (activeCat) {
        const catName = (activeCat.title || activeCat.name || "").toLowerCase();
        const catSlug = catName.replace(/\s+/g, "-");

        filtered = filtered.filter((p) => {
          const pCat = p.category?.toLowerCase() || "";
          return pCat === catName || pCat.replace(/\s+/g, "-") === catSlug;
        });
      }
    }

    return filtered;
  }, [products, selectedCategory, categories, searchTerm]);

  const sortedProducts = useMemo(() => {
    let prods = [...filteredProducts];

    switch (sortBy) {
      case "Default Sorting":
        return prods.sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
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
        return prods.sort(
          (a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0),
        );
      default:
        return prods;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price;

    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceVal,
        image: product.image,
        quantity: quantity,
      }),
    );
    showToast(`Added ${quantity} x "${product.title}" to cart!`, "add");
  };

  const handleToggleWishlist = (product: any) => {
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
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

  const updateURL = (
    page: number,
    category: string,
    sort: string,
    query: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) params.delete("page");
    else params.set("page", page.toString());

    if (category === "All Categories") params.delete("category");
    else params.set("category", category);

    if (sort === "Default Sorting") params.delete("sort");
    else params.set("sort", sort);

    if (!query.trim()) params.delete("q");
    else params.set("q", query);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateURL(page, selectedCategory, sortBy, searchTerm);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <PageHeader
        title={pageConfig.title}
        breadcrumbs={
          currentPage > 1
            ? [
                { label: "Shop", href: "/shop" },
                { label: `Page ${currentPage}` },
              ]
            : [{ label: "Shop" }]
        }
      />

      <div className="relative z-40">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 dark:text-slate-500 font-medium tracking-tight">
              Loading premium products...
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12 px-6 py-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-50 gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)}{" "}
                  Of {sortedProducts.length} Results
                </p>
                <div className="relative w-full sm:w-72 group">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                      updateURL(1, selectedCategory, sortBy, e.target.value);
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 dark:focus:border-purple-500 transition-all font-bold dark:text-white dark:placeholder-slate-500"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Search size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative w-full lg:w-auto justify-between lg:justify-end">
                {/* Mobile Filters */}
                <div className="flex items-center gap-3 lg:hidden w-full overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => {
                      setIsMobileCategoryOpen(!isMobileCategoryOpen);
                      setIsMobileSortOpen(false);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
                      isMobileCategoryOpen
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Filter size={14} />
                    <span>Categories</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isMobileCategoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileSortOpen(!isMobileSortOpen);
                      setIsMobileCategoryOpen(false);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
                      isMobileSortOpen
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Menu size={14} />
                    <span>Sort By</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isMobileSortOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <div className="hidden lg:flex items-center gap-6">
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setIsSortOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-4 py-2 border-r border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-slate-400 font-medium">
                        Category:
                      </span>{" "}
                      {selectedCategory}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isCategoryOpen && (
                      <div className="absolute left-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200">
                        {[
                          "All Categories",
                          ...categories.map((c: any) => c.title || c.name),
                        ].map((option: string) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedCategory(option);
                              setIsCategoryOpen(false);
                              setCurrentPage(1);
                              updateURL(1, option, sortBy, searchTerm);
                            }}
                            className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                              selectedCategory === option
                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsSortOpen(!isSortOpen);
                        setIsCategoryOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-4 py-2"
                    >
                      <span className="text-slate-400 font-medium">Sort:</span>{" "}
                      {sortBy}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isSortOpen && (
                      <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200">
                        {[
                          "Default Sorting",
                          "Sort By Popularity",
                          "Sort By Latest",
                          "Sort By Price: Low To High",
                          "Sort By Price: High To Low",
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsSortOpen(false);
                              setCurrentPage(1);
                              updateURL(
                                1,
                                selectedCategory,
                                option,
                                searchTerm,
                              );
                            }}
                            className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                              sortBy === option
                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {isMobileCategoryOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-100 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden text-center">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                        Select Category
                      </h3>
                      <button
                        onClick={() => setIsMobileCategoryOpen(false)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                      {[
                        "All Categories",
                        ...categories.map((c: any) => c.title || c.name),
                      ].map((option: string) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedCategory(option);
                            setCurrentPage(1);
                            updateURL(1, option, sortBy, searchTerm);
                            setIsMobileCategoryOpen(false);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === option
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isMobileSortOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-100 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                        Sort Products
                      </h3>
                      <button
                        onClick={() => setIsMobileSortOpen(false)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        "Default Sorting",
                        "Sort By Popularity",
                        "Sort By Latest",
                        "Sort By Price: Low To High",
                        "Sort By Price: High To Low",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setCurrentPage(1);
                            updateURL(1, selectedCategory, option, searchTerm);
                            setIsMobileSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                            sortBy === option
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 px-8"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {currentProducts.map((product: any) => (
                <SimpleProductCard
                  key={product.id}
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
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-purple-600 hover:text-white transition-all rotate-180 shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full font-black transition-all shadow-md ${
                        currentPage === page
                          ? "bg-purple-600 text-white scale-110"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            )}
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
