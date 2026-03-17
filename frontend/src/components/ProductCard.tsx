'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Store } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/CartSlice';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    storeId: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      productId: product._id,
      storeId: product.storeId._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0]
    }));
  };

  return (
    <div className="bg-white rounded-[24px] p-2 border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col h-full relative">
      <Link href={`/product/${product._id}`} className="block relative h-64 overflow-hidden bg-gray-50 rounded-[16px]">
        {product.images[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-xs flex items-center gap-1">
             <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.8
           </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2 uppercase tracking-wide">
          <Store className="w-3 h-3" />
          <Link href={`/shop/${product.storeId.slug}`} className="hover:text-indigo-600 transition-colors truncate">
            {product.storeId.name}
          </Link>
        </div>

        <Link href={`/product/${product._id}`} className="block mb-4">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors text-sm leading-relaxed">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <span className="text-lg font-black text-gray-900 tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
