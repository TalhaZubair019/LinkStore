"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";

interface Product {
  id: string | number;
  title: string;
  price: string | number;
  oldPrice?: string | number | null;
  image: string;
  badge?: string | null;
  badges?: string[];
  stockQuantity?: number;
  averageRating?: number;
  totalReviews?: number;
}

interface SimpleProductCardProps {
  product: Product;
  onAddToCart: (product: any) => void;
  isInCart?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist: () => void;
  onQuickView?: () => void;
}

export default function SimpleProductCard({
  product,
  onAddToCart,
  isInCart = false,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView,
}: SimpleProductCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slug = product.title.toLowerCase().replace(/\s+/g, "-");

  const handleCardClick = () => {
    router.push(`/product/${slug}`);
  };

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
  const isOutOfStock =
    product.stockQuantity !== undefined && product.stockQuantity <= 0;

  return (
    <div
      onClick={handleCardClick}
      className="group w-full bg-white dark:bg-slate-900 transition-all duration-500 relative flex flex-col h-full cursor-pointer"
    >
      {}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist();
        }}
        className={`absolute top-4 right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          showFilled
            ? "bg-red-500 text-white"
            : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
        }`}
        title={showFilled ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={14} className="sm:w-4.5 sm:h-4.5" fill={showFilled ? "currentColor" : "none"} />
      </button>

      {}
      {onQuickView && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className="absolute top-4 left-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100 translate-x-0 lg:translate-x-4 group-hover:translate-x-0"
          title="Quick View"
        >
          <Eye size={16} className="sm:w-4.5 sm:h-4.5" />
        </button>
      )}

      <div className="relative h-48 sm:h-80 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-4 sm:p-8 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500">
        <div className="relative w-full h-full block">
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
              <span className="bg-red-500 text-white font-black px-5 py-2.5 rounded-xl rotate-12 shadow-2xl border-none whitespace-nowrap text-[10px] tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-500 z-10 bg-black/5 dark:bg-white/5 ${
            isOutOfStock
              ? "opacity-100"
              : "opacity-100 lg:opacity-0 group-hover:opacity-100"
          }`}
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
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-black rounded-full shadow-2xl hover:shadow-white/10 hover:scale-105 transition-all active:scale-95 uppercase tracking-wider border border-slate-200 dark:border-slate-700"
              >
                Cart
              </Link>
            </>
          ) : (
            <button
              onClick={handleCartClick}
              disabled={addingToCart}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] sm:text-xs font-black rounded-full shadow-2xl hover:shadow-purple-500/40 hover:scale-110 transition-all disabled:opacity-80 active:scale-95 uppercase tracking-wider sm:tracking-widest"
            >
              {addingToCart ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
              )}
              {addingToCart ? "..." : <span className="inline">Add to cart</span>}
            </button>
          )}
        </div>
      </div>

      {}
      <div className="p-3 sm:p-6 text-center bg-white dark:bg-slate-900 transition-colors flex-1 flex flex-col justify-center">
        {}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          {(product.badges || (product.badge ? [product.badge] : [])).map(
            (badge: string, idx: number) => (
              <span
                key={idx}
                className="px-1.5 sm:px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-wider rounded-full border border-slate-100 dark:border-slate-800"
              >
                {badge}
              </span>
            ),
          )}
        </div>
        
        {}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2.5">
          <Star size={10} className={product.averageRating && product.averageRating > 0 ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"} />
          <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold tracking-tight">
            {product.averageRating && product.averageRating > 0 ? `${product.averageRating} (${product.totalReviews || 0})` : "No reviews"}
          </span>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-base mb-1 sm:mb-2 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
          {product.title}
        </h3>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-black text-purple-600 dark:text-purple-400">
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
