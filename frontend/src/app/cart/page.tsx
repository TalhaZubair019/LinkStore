"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { removeFromCart, updateQuantity } from "@/redux/slices/CartSlice";
import {
  ShoppingBag,
  Trash2,
  Store,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useMemo } from "react";

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  // Group items by storeId
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof items> = {};
    items.forEach(item => {
      // In a real app we'd map storeId to storeName, defaulting to storeName strings or "Unknown Store"
      const storeName = item.storeId.startsWith('s') ? `Verified Store (${item.storeId})` : item.storeId;
      if (!groups[storeName]) groups[storeName] = [];
      groups[storeName].push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* Reusable Header */}
      <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
             <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-200">L</div>
             <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase sm:block">LinkStore</span>
          </Link>
          <div className="font-bold text-gray-500">Shopping Cart</div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items (Grouped by Seller) */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">
              My Cart ({items.length})
            </h1>

            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">There are no items in this cart</h3>
                <Link href="/" className="px-8 py-3 mt-4 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-all shadow-sm">
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : (
              Object.entries(groupedItems).map(([storeName, storeItems]) => (
                <div key={storeName} className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden mb-6">
                   {/* Store Header */}
                   <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                     <Store className="w-5 h-5 text-indigo-600" />
                     <span className="font-bold text-gray-900">{storeName}</span>
                   </div>
                   
                   {/* Store Products */}
                   <div className="p-6 space-y-6">
                     {storeItems.map((item) => (
                       <div key={item.productId} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                         {/* Product Image */}
                         <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                            {item.image ? (
                               <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                               <ShoppingBag className="w-8 h-8 text-gray-300" />
                            )}
                         </div>

                         {/* Product Info */}
                         <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 leading-snug line-clamp-2 hover:text-orange-500 cursor-pointer">{item.title}</h3>
                            <p className="font-black text-orange-500 mt-2">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-4 mt-2">
                               <button onClick={() => dispatch(removeFromCart(item.productId))} className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors">
                                 <Trash2 className="w-4 h-4" /> Remove
                               </button>
                            </div>
                         </div>

                         {/* Quantity Modifier */}
                         <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden shrink-0">
                           <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))} className="w-8 h-8 bg-gray-50 hover:bg-gray-100 flex justify-center items-center text-gray-600 font-medium">-</button>
                           <input type="text" readOnly value={item.quantity} className="w-12 h-8 text-center text-sm font-medium border-x border-gray-300 outline-hidden" />
                           <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} className="w-8 h-8 bg-gray-50 hover:bg-gray-100 flex justify-center items-center text-gray-600 font-medium">+</button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout SummarySidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs sticky top-28">
              <h2 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Order Summary</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                   <input type="text" placeholder="Enter Voucher Code" className="w-full border border-gray-200 rounded-sm px-3 py-2 outline-hidden focus:border-orange-500" />
                   <button className="bg-gray-800 text-white px-4 rounded-sm font-bold text-xs hover:bg-black transition-colors">APPLY</button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-gray-900">Total</span>
                <div className="text-right">
                   <span className="text-2xl font-black text-orange-500">${total.toFixed(2)}</span>
                   <p className="text-[10px] text-gray-400">VAT included, where applicable</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg mb-6 flex items-start gap-2 border border-blue-100/50">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Proceeding to checkout triggers Daraz-style split payments between the multi-vendors in your cart.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full py-3.5 bg-orange-500 text-white rounded-sm font-bold text-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
