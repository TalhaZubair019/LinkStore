"use client";
import { useState } from "react";
import Image from "next/image";
import {
  X,
  Settings,
  ShoppingCart,
  Printer,
  Share2,
  Plus as PlusIcon,
  Maximize2,
  Trash2,
} from "lucide-react";

function CartButton({
  item,
  onAddToCart,
}: {
  item: any;
  onAddToCart: (item: any, qty: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const handleClick = () => {
    setAdding(true);
    onAddToCart(item, 1);
    setTimeout(() => setAdding(false), 700);
  };
  return (
    <button
      onClick={handleClick}
      disabled={adding}
      className="px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full shadow-lg text-sm flex gap-2 items-center disabled:opacity-80 disabled:cursor-not-allowed"
    >
      {adding ? (
        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <ShoppingCart size={14} />
      )}
      {adding ? "Adding..." : "Add to cart"}
    </button>
  );
}

function CompareDrawer({
  isOpen,
  compareItems,
  allProducts,
  onClose,
  onRemoveItem,
  onAddItem,
  onAddToCart,
  Maximize2,
}: any) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-all duration-500 flex justify-end">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div className="relative w-full sm:w-[500px] lg:w-[600px] bg-white dark:bg-slate-900 h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 ease-out transition-colors">
        <div className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                Comparison
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
                <span>{compareItems.length} Products</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Max 3</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white group"
          >
            <X
              size={24}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
        <div className="grow overflow-y-auto custom-scrollbar p-6 space-y-8 bg-slate-50/20 dark:bg-slate-950/20 transition-colors">
          {compareItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-10 opacity-60">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                <Maximize2 size={40} />
              </div>
              <p className="font-medium text-slate-500 dark:text-slate-400">
                No products to compare.
                <br />
                Add products to see the details side by side.
              </p>
              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {compareItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800/50 rounded-4xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative group transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                >
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all shadow-sm z-10"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 shrink-0 shadow-inner group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/20 transition-colors">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl mb-3">
                        {item.price}
                      </p>
                      <CartButton item={item} onAddToCart={onAddToCart} />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                          Status
                        </span>
                        <span className="inline-flex items-center gap-2 text-emerald-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          In Stock
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                          Category
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Premium Original
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                        Details
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Exquisitely crafted with premium materials. This product
                        features a sophisticated design that stands out in any
                        setting.
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {compareItems.length < 3 && (
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all gap-3 bg-white/40 dark:bg-slate-900/40 group active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 transition-colors">
                    <PlusIcon size={24} />
                  </div>
                  <span className="font-bold text-sm">Add Another Product</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 transition-colors">
          <div className="flex gap-4">
            <button className="flex-1 h-14 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none">
              Print Specification
            </button>
            <button
              onClick={() =>
                compareItems.forEach((item: any) => onRemoveItem(item.id))
              }
              className="w-14 h-14 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all active:scale-95"
              title="Clear All"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </div>
      {isPickerOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsPickerOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">
                Select Product
              </h3>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {allProducts
                .filter(
                  (p: any) => !compareItems.find((c: any) => c.id === p.id),
                )
                .map((product: any) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onAddItem(product);
                      setIsPickerOpen(false);
                    }}
                    className="w-full p-4 flex items-center gap-6 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-4xl transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-2 shrink-0 relative shadow-sm group-hover:shadow-md transition-all">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base mb-0.5">
                        {product.title}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                        {product.price}
                      </p>
                    </div>
                    <div className="ml-auto w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all shadow-inner">
                      <PlusIcon size={20} />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareDrawer;
