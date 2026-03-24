"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface WishlistTabProps {
  wishlistItems: any[];
  setQuickViewProduct: (product: any) => void;
}

const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlistItems,
  setQuickViewProduct,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
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
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:shadow-md transition-all group"
            >
              <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-lg relative overflow-hidden shrink-0 transition-colors">
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
                <p className="text-purple-600 dark:text-purple-400 font-medium text-sm transition-colors">
                  {item.price}
                </p>
              </div>
              <button
                onClick={() => setQuickViewProduct(item)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-sm"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
