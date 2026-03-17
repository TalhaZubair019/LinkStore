'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const flashSaleProducts = [
  { id: 1, title: 'Men Premium Watch', price: 12.99, originalPrice: 45.00, discount: 71, sold: 85, image: 'https://images.unsplash.com/photo-1524592094714-a152eb0bc80a?q=80&w=300&auto=format&fit=crop' },
  { id: 2, title: 'Wireless Earbuds 2024', price: 8.50, originalPrice: 20.00, discount: 58, sold: 92, image: 'https://images.unsplash.com/photo-1572569533902-4c2564aaa21b?q=80&w=300&auto=format&fit=crop' },
  { id: 3, title: 'Sports Sneakers', price: 25.00, originalPrice: 80.00, discount: 69, sold: 45, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop' },
  { id: 4, title: 'Mechanical Keyboard', price: 34.99, originalPrice: 65.00, discount: 46, sold: 78, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=300&auto=format&fit=crop' },
  { id: 5, title: 'Smart Fitness Band', price: 15.00, originalPrice: 50.00, discount: 70, sold: 98, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=300&auto=format&fit=crop' },
  { id: 6, title: 'Ceramic Coffee Mug', price: 4.99, originalPrice: 15.00, discount: 67, sold: 32, image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=300&auto=format&fit=crop' },
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="bg-white rounded-xl overflow-hidden mb-6 border border-gray-100 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-black text-indigo-500 italic">Flash Sale</h2>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="text-gray-500">Ending in</span>
            <div className="flex gap-1">
               <span className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-md">{formatTime(hours)}</span>
               <span className="text-indigo-500 flex items-center">:</span>
               <span className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-md">{formatTime(minutes)}</span>
               <span className="text-indigo-500 flex items-center">:</span>
               <span className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-md">{formatTime(seconds)}</span>
            </div>
          </div>
        </div>
        <Link href="#" className="text-sm font-bold text-indigo-500 border border-indigo-500 px-4 py-1.5 rounded-sm hover:bg-indigo-50 transition-colors uppercase tracking-tight">
          Shop More
        </Link>
      </div>

      {/* Product List */}
      <div className="p-4 flex gap-4 overflow-x-auto snap-x hide-scrollbar">
        {flashSaleProducts.map((product) => (
          <Link href="#" key={product.id} className="min-w-[160px] max-w-[160px] snap-start group relative">
            <div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden mb-2">
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute top-0 right-0 bg-yellow-400 text-indigo-900 text-[10px] font-black px-2 py-1 rounded-bl-lg z-10">
                -{product.discount}%
              </div>
            </div>
            
            <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-indigo-500 h-10">{product.title}</h3>
            
            <div className="flex flex-col">
               <span className="text-lg font-black text-indigo-500">${product.price.toFixed(2)}</span>
               <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-2 w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
               <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${product.sold}%` }}></div>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 block">{product.sold} Sold</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
