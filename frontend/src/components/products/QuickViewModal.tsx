"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";

function QuickViewModal({ product, onClose, onAddToCart }: any) {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;
  const stock = product.stockQuantity || 0;
  const threshold = product.lowStockThreshold || 5;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] flex flex-col lg:flex-row relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out z-10 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all group"
        >
          <X
            size={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
        <div className="w-full lg:w-[55%] bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center relative p-8 lg:p-16 overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px]" />
          </div>
          <div className="relative w-full aspect-square max-h-[400px] lg:max-h-[500px] group transition-transform duration-700 hover:scale-105">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-500 ${isOutOfStock ? "grayscale opacity-40" : ""}`}
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white font-black px-8 py-4 rounded-2xl rotate-12 shadow-2xl border-4 border-white/20 text-xl lg:text-2xl tracking-tighter animate-in zoom-in-50 duration-500">
                  SOLD OUT
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[45%] p-8 lg:p-14 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar transition-colors">
          <div className="mb-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest rounded-full">
                Featured Product
              </span>
              {stock <= threshold && !isOutOfStock && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest rounded-full animate-pulse">
                  Rare Stock
                </span>
              )}
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-[1.1] tracking-tight">
              {product.title}
            </h2>
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-3xl lg:text-4xl font-extrabold text-indigo-600">
                {product.price}
              </p>
              <p className="text-slate-400 dark:text-slate-500 line-through text-lg font-medium opacity-60">
                $98.00
              </p>
            </div>
            <div className="space-y-6 mb-10">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                  Availability
                </span>
                {stock <= 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-full ring-1 ring-red-500/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                    Out of Stock
                  </span>
                ) : stock <= threshold ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full ring-1 ring-amber-500/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                    Low Stock ({stock} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full ring-1 ring-emerald-500/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    In Stock
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  Description
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  Elevate your lifestyle with this masterfully designed piece.
                  Crafted using only the finest premium materials, it offers a
                  harmonious blend of form and functionality that lasts a
                  lifetime. Perfect for discerning individuals who value quality
                  above all else.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 transition-colors">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-1 shrink-0 ${isOutOfStock ? "opacity-40 grayscale pointer-events-none" : ""}`}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="font-extrabold text-slate-900 dark:text-white w-10 text-center text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  setAddingToCart(true);
                  onAddToCart(product, quantity);
                  setTimeout(() => {
                    setAddingToCart(false);
                    onClose();
                  }, 700);
                }}
                disabled={addingToCart || isOutOfStock}
                className={`flex-1 h-14 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  isOutOfStock
                    ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none"
                    : "bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 shadow-slate-200 dark:shadow-none"
                }`}
              >
                {addingToCart ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {isOutOfStock
                  ? "NOT AVAILABLE"
                  : addingToCart
                    ? "ADDING TO BAG..."
                    : "ADD TO BAG"}
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest py-2">
              Free Shipping & Returns on all orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
