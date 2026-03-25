"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";

interface Product {
  id: string | number;
  title: string;
  price: string | number;
  oldPrice?: string | number | null;
  image: string;
  badge?: string | null;
  badges?: string[];
  stockQuantity?: number;
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
  const isOutOfStock =
    product.stockQuantity !== undefined && product.stockQuantity <= 0;

  return (
    <div className="group w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-transparent hover:border-purple-200 dark:hover:border-purple-900/40 flex flex-col h-full">
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist();
        }}
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          showFilled
            ? "bg-red-500 text-white"
            : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
        }`}
        title={showFilled ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={showFilled ? "currentColor" : "none"} />
      </button>

      {/* Quick View Button */}
      {onQuickView && (
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
      )}

      {/* Image Section */}
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

        {/* Hover Overlay */}
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

      {/* Info Section */}
      <div className="p-6 text-center bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 transition-colors flex-1 flex flex-col justify-center">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {(product.badges || (product.badge ? [product.badge] : [])).map(
            (badge: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-slate-100 dark:border-slate-800"
              >
                {badge}
              </span>
            ),
          )}
        </div>
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
