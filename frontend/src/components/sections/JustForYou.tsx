"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/products/Toast";

interface Product {
  id: number;
  title: string;
  price: string | number;
  image: string;
  rating?: number;
  sales?: number;
  category?: string;
  discount?: number;
}

export default function JustForYou() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "add" | "remove" }>({
    show: false,
    message: "",
    type: "add",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: Product) => {
    const priceNumber = typeof product.price === "string" 
      ? parseFloat(product.price.replace(/[^0-9.]/g, "")) 
      : product.price;
    
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: priceNumber,
      image: product.image,
      quantity: 1,
    }));
    showToast(`Added ${product.title} to cart!`, "add");
  };

  const handleToggleWishlist = (product: Product) => {
    const wasInWishlist = wishlistItems.some((item) => item.id === product.id);
    const priceNumber = typeof product.price === "string" 
      ? parseFloat(product.price.replace(/[^0-9.]/g, "")) 
      : product.price;

    dispatch(toggleWishlist({
      id: product.id,
      title: product.title,
      price: priceNumber,
      image: product.image,
    }));

    if (wasInWishlist) {
      showToast(`${product.title} removed from wishlist`, "remove");
    } else {
      showToast(`${product.title} added to wishlist!`, "add");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-3/4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Just For You
            </h2>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {products.length} Items Found
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.slice(0, visibleCount).map((product, idx) => (
            <motion.div
              key={`${product.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 6) * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:-translate-y-2 hover:border-blue-500/30"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                <Link href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
                <button 
                  onClick={() => handleToggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-slate-400 hover:text-rose-500 transition-all z-10 shadow-lg"
                >
                  <Heart size={18} fill={wishlistItems.some(i => i.id === product.id) ? "currentColor" : "none"} className={wishlistItems.some(i => i.id === product.id) ? "text-rose-500 scale-110" : ""} />
                </button>
                {product.discount && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] text-slate-500 font-bold tracking-tight">4.8 (120)</span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-relaxed">
                  <Link href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>{product.title}</Link>
                </h3>
                
                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 whitespace-nowrap tracking-tighter">
                      Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-inner group/btn"
                    >
                      <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < products.length && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="group flex items-center gap-3 px-10 py-4 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all duration-500 hover:border-slate-950 dark:hover:border-white shadow-xl"
            >
              Load More Collections <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}
