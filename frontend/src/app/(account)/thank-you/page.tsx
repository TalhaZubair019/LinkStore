"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";

export default function ThankYouPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.cart);
  const [isProcessing, setIsProcessing] = useState(true);

  const hasProcessed = React.useRef(false);
  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const processPendingOrder = async () => {
      try {
        const pendingDataStr = localStorage.getItem("pendingCheckoutData");

        if (pendingDataStr && cartItems.length > 0) {
          const customerData = JSON.parse(pendingDataStr);

          const subtotal = cartItems.reduce(
            (acc: number, item: any) => acc + item.price * (item.quantity || 1),
            0,
          );

          const response = await fetch("/api/public/place-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: customerData,
              items: cartItems,
              totalAmount: subtotal,
              paymentStatus: "Completed",
            }),
          });

          if (response.ok) {
            localStorage.removeItem("pendingCheckoutData");
            dispatch(clearCart());
          }
        }
      } catch (error) {
        console.error(
          "Error processing pending order on Thank You page",
          error,
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processPendingOrder();
  }, [cartItems, dispatch]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 mt-50 font-sans transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-xl dark:shadow-black/50 p-8 text-center border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-colors">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
            Finalizing Your Order...
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors">
            Please wait while we complete your purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 mt-50 font-sans transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-xl dark:shadow-black/50 p-8 text-center border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300 transition-colors">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 transition-colors">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
          Order Placed!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">
          Thank you for your purchase. We have received your order and sent a
          confirmation email to your inbox.
        </p>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-8 text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 transition-colors">
          <p>
            Your order is being processed. You will receive another email once
            it ships.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
          >
            Continue Shopping
          </Link>

          <button
            onClick={() => router.back()}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            href="/contact"
            className="block w-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium py-2 text-sm transition-colors"
          >
            Need help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
