"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

interface CartTabProps {
  cartItems: any[];
}

const CartTab: React.FC<CartTabProps> = ({ cartItems }) => {
  return (
    <div className="bg-white dark:bg-[#0d0f14] p-6 sm:p-8 md:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-200 dark:border-white/5 transition-colors">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 transition-colors tracking-tight">
        Items in Cart
      </h3>
      {cartItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 transition-colors">
          <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
          <p>Your cart is empty.</p>
          <Link
            href="/shop"
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline mt-2 inline-block transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border border-slate-200 dark:border-white/5 mb-4 hover:border-purple-200 dark:hover:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-white/2 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-50 dark:bg-white/5 rounded-xl relative overflow-hidden border border-slate-200 dark:border-white/10 transition-colors shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    {item.quantity} x ${item.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-white/5 sm:border-0">
                <span className="font-bold text-purple-600 dark:text-purple-400 text-lg transition-colors">
                  ${item.totalPrice}
                </span>
              </div>
            </div>
          ))}
          <div className="pt-6 border-t border-slate-200 dark:border-white/5 text-right transition-colors">
            <Link
              href="/cart"
              className="inline-block w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 text-center"
            >
              Go to Cart Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTab;
