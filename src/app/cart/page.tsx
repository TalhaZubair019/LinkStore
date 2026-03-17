"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { removeFromCart, updateQuantity } from "@/redux/slices/CartSlice";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Store,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to checkout");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/checkout",
        {
          items: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-8 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Shopping Cart
            </h1>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {items.length} Items
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white p-12 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8 max-w-xs">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/"
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-2 py-0.5 rounded-full mb-1">
                        <Store className="w-3 h-3" />
                        {item.storeId} {/* Ideally should show Store Name */}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-medium">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: Math.max(1, item.quantity - 1),
                                }),
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-bold border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.productId))
                          }
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 tracking-tighter">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-widest">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-lg font-black text-gray-900 tracking-tighter">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Payment split logic: 90% goes to vendors, 10% platform
                commission. Secure payments powered by Stripe.
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Checkout Now{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
              {/* Stripe Logo placeholder */}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Secured by Stripe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
