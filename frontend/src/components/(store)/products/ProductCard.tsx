import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  hideActions = false,
}: any) {
  const slug = product.title.toLowerCase().replace(/\s+/g, "-");
  const [isMounted, setIsMounted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const activeWishlist = isMounted && isWishlisted;
  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;

  return (
    <motion.div
      whileHover={hideActions ? {} : { y: -8, transition: { duration: 0.2 } }}
      className={`relative min-w-70 md:min-w-75 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-4xl p-6 shadow-lg transition-all duration-300 snap-center group overflow-hidden ${hideActions ? "" : "hover:bg-[#F9FAFF] dark:hover:bg-slate-800/50 hover:shadow-2xl"}`}
    >
      {/* 1. Side Action Buttons (Direct child of motion.div, not inside Link) */}
      {!hideActions && (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-3 opacity-100 lg:opacity-0 translate-x-0 lg:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-75">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-400 dark:text-slate-500 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-blue-500/20"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product.id, product.title);
            }}
            className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all ${
              activeWishlist
                ? "bg-red-500 text-white shadow-red-500/20"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white shadow-blue-500/20"
            }`}
          >
            <Heart size={18} fill={activeWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      )}

      {/* 2. Main Clickable Content (Wrapped in Link if not in preview mode) */}
      {hideActions ? (
        <div className="cursor-default">
          <div className="mb-4">
            <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">
              {product.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
              {product.printText}
            </p>
            <div className="mt-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                Sold by:{" "}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                {product.vendorStoreName}
              </span>
            </div>
          </div>
          <div className="relative h-48 w-full mb-8">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {product.price}
            </span>
          </div>
        </div>
      ) : (
        <Link href={`/product/${encodeURIComponent(slug)}`} className="block">
          <div className="mb-4">
            <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">
              {product.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
              {product.printText}
            </p>
            {product.vendorStoreName && (
              <div className="mt-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                  Sold by:{" "}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  {product.vendorStoreName}
                </span>
              </div>
            )}
          </div>
          <div className="relative h-48 w-full mb-8">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 ${isOutOfStock ? "grayscale opacity-60" : "group-hover:scale-105"}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-red-500/90 text-white font-bold px-4 py-2 rounded-lg rotate-12 backdrop-blur-sm shadow-xl border border-white/20 whitespace-nowrap">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {product.price}
            </span>
            <div className="flex flex-wrap gap-2">
              {(product.badges || (product.badge ? [product.badge] : [])).map(
                (badge: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-1 rounded-full border border-red-300 dark:border-red-900 text-red-500 dark:text-red-400 text-sm font-semibold bg-white dark:bg-slate-900 shadow-sm"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </Link>
      )}

      {/* 3. Bottom Add to Cart Button (Sibling to Link, z-indexed above it) */}
      {!isOutOfStock && !hideActions && (
        <div className="absolute bottom-0 left-0 w-full h-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (addingToCart) return;
              setAddingToCart(true);
              onAddToCart(product, 1);
              setTimeout(() => setAddingToCart(false), 700);
            }}
            disabled={addingToCart}
            className="w-full h-full text-white font-bold text-lg flex items-center justify-between px-8 bg-linear-to-r from-[#6366F1] to-[#22D3EE] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span>{addingToCart ? "Adding..." : "Add to cart"}</span>
            {addingToCart ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-6 h-6" />
            )}
          </button>
        </div>
      )}

      {/* Out of Stock overlay if needed for preview */}
      {isOutOfStock && !hideActions && (
        <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center z-20">
          Out of Stock
        </div>
      )}
    </motion.div>
  );
}

export default ProductCard;
