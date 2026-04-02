"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/Store";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Toast from "@/components/(store)/products/Toast";
import QuickViewModal from "@/components/(store)/products/QuickViewModal";
import PageHeader from "@/components/ui/PageHeader";
import FilterSidebar from "@/components/(store)/shop/FilterSidebar";
import SimpleProductCard from "@/components/(store)/products/SimpleProductCard";

interface Product {
  id: string | number;
  title: string;
  price: string | number;
  oldPrice?: string | number | null;
  image: string;
  badges?: string[];
  category?: string;
  vendorId?: string;
  stockQuantity?: number;
}

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
        fetch(`/api/public/content?${params.toString()}`, {
          cache: "no-store",
        }),
        fetch("/api/public/content?section=categories&all=true", {
          cache: "no-store",
        }),
        fetch("/api/public/stores/list/all", { cache: "no-store" }).catch(
          () => null,
        ),
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
    const parsePrice = (price: any) => {
      if (typeof price === "number") return price;
      if (typeof price !== "string") return 0;
      const parsed = parseFloat(price.replace(/[^0-9.]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    };

    switch (sortBy) {
      case "Sort By Price: Low To High":
        return prods.sort((a, b) => {
          const diff = parsePrice(a.price) - parsePrice(b.price);
          return diff !== 0 ? diff : String(a.id).localeCompare(String(b.id));
        });
      case "Sort By Price: High To Low":
        return prods.sort((a, b) => {
          const diff = parsePrice(b.price) - parsePrice(a.price);
          return diff !== 0 ? diff : String(a.id).localeCompare(String(b.id));
        });
      case "Sort By Oldest":
        return prods.sort((a: any, b: any) => {
          const diff = (a.id || 0) - (b.id || 0);
          return diff !== 0 ? diff : String(a.id).localeCompare(String(b.id));
        });
      case "Sort By Latest":
        return prods.sort((a: any, b: any) => {
          const diff = (b.id || 0) - (a.id || 0);
          return diff !== 0 ? diff : String(a.id).localeCompare(String(b.id));
        });
      case "Sort By Popularity":
        return prods.sort((a: any, b: any) => {
          const diff = (b.salesCount || 0) - (a.salesCount || 0);
          return diff !== 0 ? diff : String(a.id).localeCompare(String(b.id));
        });
      default:
        return prods;
    }
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const currentPage = parseInt(page);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleAddToCart = (product: Product, quantity = 1) => {
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

  const handleToggleWishlist = (product: Product) => {
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

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "Default Sorting") params.delete("sort");
    else params.set("sort", sort);
    router.push(`?${params.toString()}`, { scroll: false });
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

      <div className="max-w-8xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:block transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
          >
            <FilterSidebar
              categories={categories}
              vendors={vendors}
              onClose={() => setIsSidebarOpen(false)}
            />
          </aside>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <main className="flex-1">
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
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)}{" "}
                  Of {sortedProducts.length} Results
                </p>
              </div>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => updateSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white"
                >
                  {[
                    "Default Sorting",
                    "Sort By Popularity",
                    "Sort By Latest",
                    "Sort By Oldest",
                    "Sort By Price: Low To High",
                    "Sort By Price: High To Low",
                  ].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-100 dark:bg-slate-900 rounded-3xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-8">
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

                {sortedProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Search size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      No products found
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                )}
              </>
            )}

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(
                          searchParams.toString(),
                        );
                        if (p === 1) params.delete("page");
                        else params.set("page", p.toString());
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
                  ),
                )}
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
