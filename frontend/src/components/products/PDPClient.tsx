"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Image from "next/image";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
} from "lucide-react";

interface PDPClientProps {
  product: any;
}

export default function PDPClient({ product }: PDPClientProps) {
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        storeId: product.storeId?._id || "unknown",
        title: product.title,
        price: product.price,
        quantity,
        image: product.images[0],
      }),
    );
    // You could replace this alert with a toast notification later
    alert("Added to cart successfully!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      {/* Left Column: Image Gallery */}
      <div className="space-y-6">
        <div className="relative aspect-square bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group">
          {product.images?.[activeImage] ? (
            <Image
              src={product.images[activeImage]}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {product.images?.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                activeImage === idx 
                  ? "border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "border-transparent bg-white hover:border-gray-200"
              }`}
            >
              <Image src={img} alt="Thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Product Details */}
      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm mb-6">
             <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100/50">
               <Star className="w-4 h-4 fill-yellow-500 mr-1.5" />
               <span className="font-bold">4.8</span>
               <span className="text-gray-400 ml-1.5">(1.2k Reviews)</span>
             </div>
             <div className="text-gray-400 font-medium">|</div>
             <div className="text-gray-500 font-semibold">
               <span className="text-gray-900">3.5k+</span> Sold
             </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-black text-indigo-600 tracking-tighter">
              ${product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through decoration-red-500/50">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-lg mb-8 max-w-xl">
             {product.description || "No description available for this product."}
          </p>
        </div>

        {/* Actions Section */}
        <div className="mt-auto space-y-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Select Quantity
            </span>
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner border border-gray-200/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-16 text-center font-black text-gray-900 text-xl">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-rose-500 transition-all hover:shadow-md">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all hover:shadow-md">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 text-lg leading-none uppercase tracking-widest"
          >
            <ShoppingCart className="w-6 h-6" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
