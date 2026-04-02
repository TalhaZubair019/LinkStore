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
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] lg:w-[800px] bg-white dark:bg-[#0d0f14] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_60px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col border-l border-slate-200 dark:border-white/5"
          >
            {}
            <div className="shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Quick Preview
                </span>
              </div>
              <button
                onClick={onClose}
                className="group flex items-center gap-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all border border-slate-200 dark:border-white/10 rounded-full px-4 py-1.5 hover:border-purple-500/30 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-white/5"
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
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth flex flex-col lg:flex-row">
              {}
              <div className="relative w-full lg:w-[45%] h-56 lg:h-auto shrink-0 bg-slate-50 dark:bg-white/5 flex items-center justify-center p-8 overflow-hidden group border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:-rotate-90 text-[80px] font-black text-slate-100 dark:text-slate-800/20 select-none pointer-events-none uppercase tracking-tighter opacity-10 leading-none">
                  Store
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
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center space-y-8">
                {}
                <div>
                  <p className="text-purple-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Premium Collection
                  </p>
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-6">
                    <p className="text-xl font-black text-slate-900 dark:text-white">
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
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-2 hover:border-purple-500/30 transition-colors">
                    <ShieldCheck
                      size={18}
                      className="text-purple-600 dark:text-purple-400"
                    />
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Authenticity
                    </span>
                    <span className="text-xs font-bold dark:text-slate-300 tracking-tight leading-none">
                      100% Genuine
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-2 hover:border-purple-500/30 transition-colors">
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
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Overview
                    </h3>
                    <Info size={14} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-3 lg:line-clamp-3">
                    {product.description ||
                      "No description available for this product."}
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="shrink-0 p-4 md:p-6 bg-white dark:bg-[#0d0f14] border-t border-slate-200 dark:border-white/10 flex flex-col gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.02)] dark:shadow-none relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Quantity Selection
                </span>
                <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-1 gap-1 shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="font-black text-slate-900 dark:text-white min-w-[20px] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg ${
                  isOutOfStock
                    ? "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    : "bg-slate-900 dark:bg-purple-600 text-white hover:bg-slate-800 dark:hover:bg-purple-500 shadow-purple-500/20 hover:scale-[1.02]"
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
