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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Items in Cart</h3>
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
              className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-md relative overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors">
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
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 transition-colors">{item.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    {item.quantity} x ${item.price}
                  </p>
                </div>
              </div>
              <span className="font-bold text-purple-600 dark:text-purple-400 transition-colors">
                ${item.totalPrice}
              </span>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50 text-right transition-colors">
            <Link
              href="/cart"
              className="inline-block px-6 py-2 bg-purple-600 dark:bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95"
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
