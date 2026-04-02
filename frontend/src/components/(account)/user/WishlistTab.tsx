"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, RefreshCw } from "lucide-react";

interface WishlistTabProps {
  wishlistItems: any[];
  setQuickViewProduct: (product: any) => void;
}

const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlistItems,
  setQuickViewProduct,
}) => {
  const [liveItems, setLiveItems] = useState<any[]>(wishlistItems);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (wishlistItems.length === 0) {
      setLiveItems([]);
      return;
    }

    const fetchLiveProducts = async () => {
      setIsUpdating(true);
      try {
        const response = await fetch("/api/public/content?section=products", { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const allProducts = data.products || [];
          
          const updatedItems = wishlistItems.map((item) => {
            const liveProduct = allProducts.find((p: any) => p.id === item.id);
            return liveProduct ? { ...item, ...liveProduct } : item;
          });
          setLiveItems(updatedItems);
        } else {
          setLiveItems(wishlistItems);
        }
      } catch (error) {
        console.error("Failed to sync wishlist with live data", error);
        setLiveItems(wishlistItems);
      } finally {
        setIsUpdating(false);
      }
    };

    fetchLiveProducts();
  }, [wishlistItems]);

  return (
    <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-8 md:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors tracking-tight">
          My Wishlist
        </h3>
        {isUpdating && <RefreshCw size={16} className="text-slate-400 animate-spin" />}
      </div>
      {liveItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 transition-colors">
          <Heart size={48} className="mx-auto mb-3 opacity-20" />
          <p>No items in wishlist yet.</p>
          <Link
            href="/shop"
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline mt-2 inline-block transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-purple-200 dark:hover:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-white/2 transition-all group"
            >
              <div className="h-16 w-16 bg-slate-50 dark:bg-white/5 rounded-xl relative overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 transition-colors self-start sm:self-auto">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-sm transition-colors">
                    {item.price}
                  </p>
                  {(item.inStock === false || item.stock === 0 || item.quantity === 0) && (
                    <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-[0.2em] rounded border border-rose-200 dark:border-rose-500/20">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setQuickViewProduct(item)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 text-[10px] uppercase tracking-[0.2em] font-black text-white bg-slate-900 hover:bg-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white rounded-xl border border-transparent dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500/50 shadow-lg dark:shadow-none hover:shadow-purple-500/20 transition-all active:scale-95 group mt-2 sm:mt-0"
              >
                <Eye size={14} className="opacity-70 group-hover:opacity-100 group-hover:text-purple-400 transition-colors" />
                <span>View</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
