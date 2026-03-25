"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  deleteItem,
  syncCart,
} from "@/redux/slices/cartSlice";
import { ChevronRight, ChevronDown } from "lucide-react";
import db from "@data/db.json";
import Loading from "@/components/ui/Loading";
import AuthPromptModal from "@/components/(auth)/auth/AuthPromptModal";
import Toast from "@/components/(store)/products/Toast";
import PageHeader from "@/components/ui/PageHeader";

const cartData = db.cart;

type CartItemType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const totalAmount = cartItems.reduce(
    (acc: number, item: CartItemType) =>
      acc + item.price * (item.quantity || 1),
    0,
  );
  const [isClient, setIsClient] = useState(false);
  const [productsCache, setProductsCache] = useState<any[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const validateCart = async () => {
      if (cartItems.length === 0) return;

      const productIds = cartItems.map((item: CartItemType) => item.id);
      try {
        const response = await fetch("/api/public/validate-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        });

        if (response.ok) {
          const validProducts = await response.json();
          setProductsCache(validProducts);
          let stockAdjusted = false;
          const outOfStockItems: string[] = [];
          const limitedStockItems: string[] = [];

          for (const cartItem of cartItems) {
            const dbRef = validProducts.find(
              (vp: any) => String(vp.id) === String(cartItem.id),
            );

            if (!dbRef || dbRef.stockQuantity <= 0) {
              outOfStockItems.push(cartItem.name);
              stockAdjusted = true;
            } else if (dbRef.stockQuantity < cartItem.quantity) {
              limitedStockItems.push(cartItem.name);
              stockAdjusted = true;
            }
          }

          if (stockAdjusted) {
            let msg = "";
            if (outOfStockItems.length > 0) {
              msg += `"${outOfStockItems.join(", ")}" is out of stock and has been removed. `;
            }
            if (limitedStockItems.length > 0) {
              msg += `Quantity for "${limitedStockItems.join(", ")}" was adjusted based on available stock.`;
            }

            setToast({
              show: true,
              message: msg.trim(),
              type: "remove",
            });
            setTimeout(
              () => setToast((prev) => ({ ...prev, show: false })),
              6000,
            );
          }

          dispatch(syncCart(validProducts));
        }
      } catch (error) {
        console.error("Failed to validate cart:", error);
      }
    };

    if (isClient && cartItems.length > 0) {
      validateCart();
      const interval = setInterval(validateCart, 30000);
      return () => clearInterval(interval);
    }
  }, [isClient, dispatch]);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center dark:bg-slate-950">
        <Loading />
      </div>
    );
  }

  const groupedCartItems = cartItems.reduce((acc: any, item: CartItemType) => {
    const product = productsCache.find((p) => String(p.id) === String(item.id));
    const storeName = product?.vendorStoreName || "Verified Store";
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          redirectUrl="/checkout"
        />
      )}
      <PageHeader
        title={cartData.breadcrumbs.current}
        breadcrumb={cartData.breadcrumbs.current}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-16 px-4 lg:px-8 pb-32">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-8">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {cartData.columns.product}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {cartData.columns.total}
                  </span>
                </div>
                <div>
                  {Object.entries(groupedCartItems).map(([storeName, items]: [string, any]) => (
                    <div key={storeName} className="mb-12 last:mb-0">
                      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-black text-xs">
                            {storeName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          Sold by <span className="text-purple-600 dark:text-purple-400">{storeName}</span>
                        </h3>
                      </div>
                      <div className="space-y-12">
                        {items.map((item: CartItemType) => {
                          const product = productsCache.find((p) => String(p.id) === String(item.id));
                          return <CartItem key={item.id} item={item} product={product} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4">
                <CartSummary
                  totalAmount={totalAmount}
                  onCheckout={handleCheckoutClick}
                />
              </div>
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

function EmptyCart() {
  return (
    <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
      <h2 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-6">
        {cartData.emptyState.message}
      </h2>
      <Link
        href={cartData.emptyState.redirectUrl}
        className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95"
      >
        {cartData.emptyState.buttonText}
      </Link>
    </div>
  );
}

function CartItem({ item, product }: { item: CartItemType, product?: any }) {
  const dispatch = useDispatch();
  const subTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="group">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="relative w-32 h-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-sm transition-colors">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900">
              {cartData.placeholders.noImageText}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">
                {product?.category}
              </h3>
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-1 transition-colors">
                {item.name}
              </p>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm block mb-3">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg sm:hidden">
              ${subTotal}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-lg hidden sm:block transition-colors line-clamp-2">
            {product?.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-auto">
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded overflow-hidden w-28 bg-white dark:bg-slate-900 transition-colors">
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg transition-colors border-r border-slate-200 dark:border-slate-700"
              >
                -
              </button>
              <span className="flex-1 text-center font-semibold text-slate-700 dark:text-slate-200 text-sm py-1">
                {item.quantity}
              </span>
              <button
                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg transition-colors border-l border-slate-200 dark:border-slate-700"
              >
                +
              </button>
            </div>
            <button
              onClick={() => dispatch(deleteItem(item.id))}
              className="text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-300 dark:border-slate-700 pb-0.5 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-400 transition-all"
            >
              Remove all item
            </button>
          </div>
        </div>
        <div className="hidden sm:block text-right min-w-20 pt-1">
          <span className="font-bold text-slate-900 dark:text-white text-lg transition-colors">
            ${subTotal}
          </span>
        </div>
      </div>
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mt-10 transition-colors"></div>
    </div>
  );
}
function CartSummary({
  totalAmount,
  onCheckout,
}: {
  totalAmount: number;
  onCheckout: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="bg-white dark:bg-transparent pl-0 lg:pl-8 transition-colors">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        {cartData.summary.title}
      </h3>
      <div className="mb-10">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 transition-colors">
          {cartData.summary.couponLabel}
        </label>
        <div className="relative border-b border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
          <select className="w-full appearance-none bg-transparent py-3 pr-8 text-slate-500 dark:text-slate-400 focus:outline-none cursor-pointer text-sm font-medium">
            <option className="bg-white dark:bg-slate-900">
              {cartData.summary.couponPlaceholder}
            </option>
            {cartData.summary.coupons.map((coupon) => (
              <option
                key={coupon.code}
                value={coupon.code}
                className="bg-white dark:bg-slate-900"
              >
                {coupon.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-0 top-3 text-slate-400 dark:text-slate-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          {cartData.summary.totalLabel}
        </span>
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          ${totalAmount.toFixed(2)}
        </span>
      </div>
      <Link
        href={cartData.summary.checkoutUrl}
        onClick={onCheckout}
        className="block w-full text-center py-4 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white font-bold text-lg shadow-lg shadow-purple-200 dark:shadow-purple-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        {cartData.summary.checkoutButtonText}
      </Link>
    </div>
  );
}
