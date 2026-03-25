"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ShoppingBag, Heart, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/(store)/products/Toast";
import PageHeader from "@/components/ui/PageHeader";
import FilterSidebar from "@/components/(store)/shop/FilterSidebar";

interface Category {
  id: string | number;
  title: string;
  image: string;
  link: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  badges?: string[];
  badge?: string | null;
  printText?: string;
  oldPrice?: string | null;
  category?: string;
  vendorId?: string;
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
            const pPrice = parseFloat(p.price.replace(/[^0-9.]/g, ""));
            const singularPCat = pCat.replace(/s$/, "");

            // Initial Category Match
            const isCategoryMatch =
              pCat === lowerTitle ||
              singularPCat === singularTitle ||
              pCat.replace(/\s+/g, "-") === slug ||
              pCat.replace(/\s+/g, "-") === slugFromTitle ||
              pTitle.includes(singularTitle) ||
              pTitle.includes(slug.replace(/-/g, " ").replace(/s$/, ""));

            if (!isCategoryMatch) return false;

            // Extra Sidebar Filters
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
    const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ""));

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
    const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ""));

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
          {/* Sidebar */}
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

          {/* Background Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
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
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...categoryProducts]
                .sort((a: any, b: any) => {
                  const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
                  const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
                  if (sortBy === "Price: Low to High") return priceA - priceB;
                  if (sortBy === "Price: High to Low") return priceB - priceA;
                  if (sortBy === "Newest First")
                    return (b.id || 0) - (a.id || 0);
                  if (sortBy === "Popularity")
                    return (b.salesCount || 0) - (a.salesCount || 0);
                  return (a.id || 0) - (b.id || 0);
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
function SimpleProductCard({
  product,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  onAddToCart: () => void;
  isInCart: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const [addingToCart, setAddingToCart] = useState(false);
  const isOutOfStock = (product as any).stockQuantity <= 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setAddingToCart(true);
    onAddToCart();
    setTimeout(() => setAddingToCart(false), 700);
  };

  return (
    <div className="group bg-white dark:bg-slate-950 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300 relative border border-slate-100 dark:border-slate-800/50">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {(product.badges || (product.badge ? [product.badge] : [])).map(
          (badge: string, idx: number) => (
            <span
              key={idx}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm ${
                badge === "New" ? "bg-blue-500" : "bg-red-500"
              }`}
            >
              {badge}
            </span>
          ),
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist();
        }}
        className={`absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 ${
          isWishlisted
            ? "bg-red-500 text-white"
            : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-red-500 hover:text-white"
        }`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <Link
        href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
        className="flex relative h-64 bg-slate-50 dark:bg-slate-900/50 items-center justify-center p-6 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-colors overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-contain p-2 ${isOutOfStock ? "grayscale opacity-60" : "group-hover:scale-110"} transition-transform duration-500`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            No Image
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded text-[10px] uppercase tracking-tighter rotate-12">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/5 dark:bg-black/20">
          <button
            onClick={handleCartClick}
            disabled={addingToCart || isOutOfStock}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer font-bold text-sm ${
              isOutOfStock
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed grayscale"
                : "bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white"
            }`}
          >
            {addingToCart ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag
                size={16}
                fill={isOutOfStock ? "none" : "currentColor"}
              />
            )}
            {isOutOfStock
              ? "NOT AVAILABLE"
              : addingToCart
                ? "Adding..."
                : "Add to cart"}
          </button>
        </div>
      </Link>

      <div className="p-5 text-center bg-white dark:bg-slate-950 transition-colors">
        <Link
          href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-slate-400 dark:text-slate-600 line-through transition-colors">
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
