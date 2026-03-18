import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Heart, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onCompare,
  onAddToCart,
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
    <Link href={`/product/${encodeURIComponent(slug)}`}>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="relative min-w-70 md:min-w-75 bg-white dark:bg-slate-900 hover:bg-[#F9FAFF] dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-4xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group overflow-hidden"
      >
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-100 lg:opacity-0 translate-x-0 lg:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-75">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompare(product);
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-400 dark:text-slate-500 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
          >
            <Maximize2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-400 dark:text-slate-500 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
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
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white"
            }`}
          >
            <Heart size={18} fill={activeWishlist ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mb-4">
          <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">
            {product.title}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
            {product.printText}
          </p>
          {product.vendorStoreName && (
            <div className="mt-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Sold by: </span>
              {product.vendorStoreSlug ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/store/${product.vendorStoreSlug}`;
                  }}
                  className="text-[10px] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline transition-all cursor-pointer inline-block"
                >
                  {product.vendorStoreName}
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{product.vendorStoreName}</span>
              )}
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
        <div
          className={`absolute bottom-0 left-0 w-full h-20 ${isOutOfStock ? "translate-y-0" : "translate-y-0 lg:translate-y-full group-hover:translate-y-0"} transition-transform duration-300 ease-in-out z-10`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (addingToCart || isOutOfStock) return;
              setAddingToCart(true);
              onAddToCart(product, 1);
              setTimeout(() => setAddingToCart(false), 700);
            }}
            disabled={addingToCart || isOutOfStock}
            className={`w-full h-full text-white font-bold text-lg flex items-center justify-between px-8 transition-colors ${
              isOutOfStock
                ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                : "bg-linear-to-r from-[#6366F1] to-[#22D3EE] cursor-pointer"
            }`}
          >
            <span>
              {isOutOfStock
                ? "Out of Stock"
                : addingToCart
                  ? "Adding..."
                  : "Add to cart"}
            </span>
            {!isOutOfStock &&
              (addingToCart ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-6 h-6" />
              ))}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;
