"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
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
        // Mimic high density by duplicating if needed or just using what's there
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
            <div key={i} className="aspect-3/4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-blue-600 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Just For You
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, visibleCount).map((product, idx) => (
            <motion.div
              key={`${product.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 6) * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100 dark:border-slate-800 flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button 
                  onClick={() => handleToggleWishlist(product)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 transition-colors z-10"
                >
                  <Heart size={18} fill={wishlistItems.some(i => i.id === product.id) ? "currentColor" : "none"} className={wishlistItems.some(i => i.id === product.id) ? "text-rose-500" : ""} />
                </button>
                {product.discount && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/product/${product.id}`}>{product.title}</Link>
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-slate-500 font-medium">4.8 (120)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < products.length && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-8 py-3 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:border-blue-500 hover:text-blue-600"
            >
              Load More
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
