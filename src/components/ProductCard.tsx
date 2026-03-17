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
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
      <Link href={`/product/${product._id}`} className="block relative h-64 overflow-hidden">
        {product.images[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-900 border border-white/50 flex items-center gap-1 shadow-sm">
             <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.8
           </span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mb-2 bg-indigo-50 w-fit px-2 py-0.5 rounded-full">
          <Store className="w-3 h-3" />
          <Link href={`/shop/${product.storeId.slug}`} className="hover:underline">
            Sold by: {product.storeId.name}
          </Link>
        </div>

        <Link href={`/product/${product._id}`} className="block">
          <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900 tracking-tighter">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all hover:scale-110 active:scale-95 shadow-lg shadow-gray-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
