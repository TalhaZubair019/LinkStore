"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ShoppingBag, Heart, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/(store)/products/Toast";
import PageHeader from "@/components/ui/PageHeader";
import FilterSidebar from "@/components/(store)/shop/FilterSidebar";
import SimpleProductCard from "@/components/(store)/products/SimpleProductCard";

interface Category {
  id: string | number;
  title: string;
  image: string;
  link: string;
}

interface Product {
  id: string | number;
  title: string;
  price: string | number;
  image: string;
  badges?: string[];
  badge?: string | null;
  printText?: string;
  oldPrice?: string | number | null;
  category?: string;
  vendorId?: string;
  stockQuantity?: number;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Default Sorting");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams.toString());

        const [catRes, productsRes, vendorsRes] = await Promise.all([
          fetch("/api/public/content?section=categories"),
          fetch(`/api/public/content?section=products&${params.toString()}`),
          fetch("/api/public/stores/list/all").catch(() => null),
        ]);

        let allProducts: Product[] = [];
        if (productsRes.ok) {
          const productData = await productsRes.json();
          allProducts = productData.products || [];
        }

        if (vendorsRes && vendorsRes.ok) {
          const vData = await vendorsRes.json();
          setVendors(vData.vendors || []);
        }

        const filterForCategory = (catTitle: string) => {
          const lowerTitle = catTitle.toLowerCase();
          const singularTitle = lowerTitle.replace(/s$/, "");
          const slugFromTitle = lowerTitle.replace(/\s+/g, "-");

          const search = searchParams.get("search")?.toLowerCase() || "";
          const minPrice = parseFloat(searchParams.get("minPrice") || "0");
          const maxPrice = parseFloat(
            searchParams.get("maxPrice") || "Infinity",
          );
          const vendorId = searchParams.get("vendorId");

          return allProducts.filter((p) => {
            const pTitle = p.title.toLowerCase();
            const pCat = p.category?.toLowerCase() || "";
            const pPrice =
              typeof p.price === "string"
                ? parseFloat(p.price.replace(/[^0-9.]/g, ""))
                : p.price || 0;
            const singularPCat = pCat.replace(/s$/, "");

            const isCategoryMatch =
              pCat === lowerTitle ||
              singularPCat === singularTitle ||
              pCat.replace(/\s+/g, "-") === slug ||
              pCat.replace(/\s+/g, "-") === slugFromTitle ||
              pTitle.includes(singularTitle) ||
              pTitle.includes(slug.replace(/-/g, " ").replace(/s$/, ""));

            if (!isCategoryMatch) return false;

            if (search && !pTitle.includes(search)) return false;
            if (pPrice < minPrice || pPrice > maxPrice) return false;
            if (vendorId && p.vendorId !== vendorId) return false;

            return true;
          });
        };

        if (catRes.ok) {
          const catData = await catRes.json();
          const dbCategories: Category[] = catData.categories || [];
          setAllCategories(dbCategories);

          const foundCategory = dbCategories.find(
            (cat: any) =>
              (cat.name || cat.title || "")
                .toLowerCase()
                .replace(/\s+/g, "-") === slug || (cat as any).slug === slug,
          );

          if (foundCategory) {
            const currentCatName =
              (foundCategory as any).name || foundCategory.title;
            setCategory({
              ...foundCategory,
              title: currentCatName,
            });
            setCategoryProducts(filterForCategory(currentCatName));
          } else {
            setCategory(null);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug, searchParams]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: Product) => {
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
        quantity: 1,
      }),
    );
    showToast(`Added "${product.title}" to cart!`, "add");
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
        description: product.description,
        stockQuantity: product.stockQuantity,
      }),
    );
    showToast(
      isWishlisted
        ? `Removed "${product.title}" from wishlist`
        : `Added "${product.title}" to wishlist`,
      isWishlisted ? "remove" : "add",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="text-slate-800 dark:text-slate-200 font-bold text-xl">
          Category not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 pb-32 transition-colors duration-300">
      <PageHeader
        title={`Category: ${category.title}`}
        breadcrumbs={[
          { label: "Shop", href: "/shop" },
          { label: category.title },
        ]}
      />
      <div className="max-w-8xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:block transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
          >
            <FilterSidebar
              categories={allCategories}
              vendors={vendors}
              onClose={() => setIsSidebarOpen(false)}
              activeCategoryName={category.title}
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
                  Showing {categoryProducts.length} Results for "
                  {category.title}"
                </p>
              </div>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white"
                >
                  <option>Default Sorting</option>
                  <option>Popularity</option>
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {[...categoryProducts]
                .sort((a: any, b: any) => {
                  const parsePrice = (price: any) => {
                    if (typeof price === "number") return price;
                    if (typeof price !== "string") return 0;
                    const parsed = parseFloat(price.replace(/[^0-9.]/g, ""));
                    return isNaN(parsed) ? 0 : parsed;
                  };
                  const priceA = parsePrice(a.price);
                  const priceB = parsePrice(b.price);

                  if (sortBy === "Price: Low to High") {
                    const diff = priceA - priceB;
                    if (diff !== 0) return diff;
                  }
                  if (sortBy === "Price: High to Low") {
                    const diff = priceB - priceA;
                    if (diff !== 0) return diff;
                  }
                  if (sortBy === "Newest First") {
                    const diff = (b.id || 0) - (a.id || 0);
                    if (diff !== 0) return diff;
                  }
                  if (sortBy === "Oldest First") {
                    const diff = (a.id || 0) - (b.id || 0);
                    if (diff !== 0) return diff;
                  }
                  if (sortBy === "Popularity") {
                    const diff = (b.salesCount || 0) - (a.salesCount || 0);
                    if (diff !== 0) return diff;
                  }
                  return String(a.id).localeCompare(String(b.id));
                })
                .map((product) => (
                  <SimpleProductCard
                    key={product.id}
                    product={product}
                    isInCart={cartItems.some(
                      (item: any) => item.id === product.id,
                    )}
                    onAddToCart={() => handleAddToCart(product)}
                    isWishlisted={wishlistItems.some(
                      (item) => item.id === product.id,
                    )}
                    onToggleWishlist={() => handleToggleWishlist(product)}
                  />
                ))}

              {categoryProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <ShoppingBag size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    No products found
                  </h3>
                  <p className="text-slate-500 mt-2">
                    No products currently available for "{category.title}"
                  </p>
                </div>
              )}
            </div>
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
