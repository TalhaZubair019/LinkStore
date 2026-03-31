import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
} from "lucide-react";

function QuickViewModal({ product, onClose, onAddToCart }: any) {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const isOutOfStock = product
    ? !product.stockQuantity || product.stockQuantity === 0
    : false;

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    setAddingToCart(true);
    onAddToCart(product, quantity);
    setTimeout(() => {
      setAddingToCart(false);
      onClose();
    }, 800);
  };

  const modalContent = (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-10000 pointer-events-none">
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md pointer-events-auto cursor-pointer"
          />

          {}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] lg:w-[600px] bg-white dark:bg-slate-950 shadow-[-20px_0_60px_rgba(0,0,0,0.3)] pointer-events-auto flex flex-col"
          >
            {}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Quick Preview
                </span>
              </div>
              <button
                onClick={onClose}
                className="group flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-all border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 hover:border-purple-500/30"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:pr-1 transition-all">
                  Close
                </span>
                <X
                  size={16}
                  className="group-hover:rotate-90 transition-all duration-300"
                />
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
              {}
              <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-12 overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-slate-100 dark:text-slate-800/20 select-none pointer-events-none uppercase tracking-tighter opacity-10 leading-none">
                  LinkStore
                </div>

                <div className="relative w-full h-full scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className={`object-contain transition-all duration-700 ${isOutOfStock ? "grayscale opacity-30" : "mix-blend-multiply dark:mix-blend-normal"}`}
                    priority
                  />
                </div>

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-6 py-3 bg-slate-950 text-white font-black text-[10px] tracking-[0.4em] rounded-full shadow-2xl border border-white/10 uppercase">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 md:p-12 space-y-10">
                {}
                <div>
                  <p className="text-purple-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                    Premium Collection
                  </p>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-6">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {product.price}
                    </p>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        Available Now
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-2">
                    <ShieldCheck size={18} className="text-purple-600" />
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Authenticity
                    </span>
                    <span className="text-xs font-bold dark:text-slate-300 tracking-tight leading-none">
                      100% Genuine
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-2">
                    <Zap size={18} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Shipping
                    </span>
                    <span className="text-xs font-bold dark:text-slate-300 tracking-tight leading-none">
                      Priority Tracked
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Overview
                    </h3>
                    <Info size={14} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {product.description ||
                      "Crafted for excellence. This premium selection represents the pinnacle of luxury design, balancing timeless aesthetics with modern functionality for a truly elevated experience."}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    One-tap support
                  </span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>

            {}
            <div className="p-8 md:p-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Quantity Selection
                </span>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 gap-2 shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="font-black text-slate-900 dark:text-white min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl ${
                  isOutOfStock
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 dark:bg-purple-600 text-white hover:bg-slate-800 dark:hover:bg-purple-500 shadow-purple-500/20"
                }`}
              >
                {addingToCart ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add To Bag</span>
                    <ChevronRight size={16} className="opacity-40" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default QuickViewModal;
