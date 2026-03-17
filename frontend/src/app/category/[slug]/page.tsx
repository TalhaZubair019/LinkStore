"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronDown, ShoppingBag, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/products/Toast";
import db from "@data/db.json";
import PageHeader from "@/components/ui/PageHeader";

interface Category {
  id: number;
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
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Default Sorting");

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [catRes, productsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/public/content?section=products"),
        ]);

        let allProducts: Product[] = [];
        if (productsRes.ok) {
          const productData = await productsRes.json();
          allProducts = productData.products || [];
        }

        const filterForCategory = (catTitle: string) => {
          const lowerTitle = catTitle.toLowerCase();
          const singularTitle = lowerTitle.replace(/s$/, "");
          const slugFromTitle = lowerTitle.replace(/\s+/g, "-");

          return allProducts.filter((p) => {
            const pTitle = p.title.toLowerCase();
            const pCat = p.category?.toLowerCase() || "";
            const singularPCat = pCat.replace(/s$/, "");

            const isDirectMatch =
              pCat === lowerTitle ||
              singularPCat === singularTitle ||
              pCat.replace(/\s+/g, "-") === slug ||
              pCat.replace(/\s+/g, "-") === slugFromTitle;

            const isKeywordMatch =
              pTitle.includes(singularTitle) ||
              pTitle.includes(slug.replace(/-/g, " ").replace(/s$/, ""));

            return isDirectMatch || isKeywordMatch;
          });
        };

        if (catRes.ok) {
          const catData = await catRes.json();
          const dbCategories: Category[] = catData.categories || [];

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
            const staticCat = db.categories.categories.find(
              (cat: Category) =>
                cat.title.toLowerCase().replace(/\s+/g, "-") === slug,
            );
            if (staticCat) {
              setCategory(staticCat);
              setCategoryProducts(filterForCategory(staticCat.title));
            } else {
              setCategory(null);
            }
          }
        } else {
          const staticCat = db.categories.categories.find(
            (cat: Category) =>
              cat.title.toLowerCase().replace(/\s+/g, "-") === slug,
          );
          if (staticCat) {
            setCategory(staticCat);
            setCategoryProducts(filterForCategory(staticCat.title));
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
  }, [slug]);

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
        <div className="text-slate-400 dark:text-slate-500">Loading...</div>
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
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-8 py-4 mt-8 mb-12 shadow-sm transition-colors">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-2 sm:mb-0 transition-colors">
            Showing {categoryProducts.length} Results
          </p>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-full text-sm font-semibold focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option>Default Sorting</option>
              <option>Popularity</option>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-3 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...categoryProducts]
            .sort((a: any, b: any) => {
              const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
              const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
              if (sortBy === "Price: Low to High") return priceA - priceB;
              if (sortBy === "Price: High to Low") return priceB - priceA;
              if (sortBy === "Newest First") return (b.id || 0) - (a.id || 0);
              if (sortBy === "Popularity")
                return (b.salesCount || 0) - (a.salesCount || 0);
              return (a.id || 0) - (b.id || 0);
            })
            .map((product) => (
              <SimpleProductCard
                key={product.id}
                product={product}
                isInCart={cartItems.some((item: any) => item.id === product.id)}
                onAddToCart={() => handleAddToCart(product)}
                isWishlisted={wishlistItems.some(
                  (item) => item.id === product.id,
                )}
                onToggleWishlist={() => handleToggleWishlist(product)}
              />
            ))}

          {categoryProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 transition-colors">
              <p className="text-lg">No products found for {category.title}.</p>
            </div>
          )}
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
