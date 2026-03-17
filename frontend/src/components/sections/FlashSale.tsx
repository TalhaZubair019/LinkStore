"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Mock Flash Sale Data
const flashProducts = [
  { id: 1, title: "Wireless Earbuds", price: "$12.00", oldPrice: "$45.00", discount: "-73%", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" },
  { id: 2, title: "Smart Watch", price: "$25.00", oldPrice: "$80.00", discount: "-69%", image: "https://images.unsplash.com/photo-1544117518-2b44c8ad2183?w=200&h=200&fit=crop" },
  { id: 3, title: "Gaming Mouse", price: "$15.00", oldPrice: "$35.00", discount: "-57%", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop" },
  { id: 4, title: "Mini Projector", price: "$85.00", oldPrice: "$250.00", discount: "-66%", image: "https://images.unsplash.com/photo-1535016120720-40c646bebbfc?w=200&h=200&fit=crop" },
  { id: 5, title: "Keyboard", price: "$40.00", oldPrice: "$90.00", discount: "-55%", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop" },
  { id: 6, title: "Action Camera", price: "$120.00", oldPrice: "$300.00", discount: "-60%", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" },
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-sm shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-darazOrange font-bold text-lg">Flash Sale</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#424242] dark:text-slate-300">On Sale Now</span>
              <div className="flex gap-1.5 items-center">
                <span className="bg-darazOrange text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-darazOrange font-bold">:</span>
                <span className="bg-darazOrange text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-darazOrange font-bold">:</span>
                <span className="bg-darazOrange text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <Link href="#" className="text-darazOrange border border-darazOrange px-3 py-1 text-sm font-bold uppercase rounded-sm hover:bg-darazOrange hover:text-white transition-colors">
            Shop All Products
          </Link>
        </div>

        {/* Products Grid */}
        <div className="flex overflow-x-auto scrollbar-hide p-4 gap-4">
          {flashProducts.map((p) => (
            <div key={p.id} className="min-w-[180px] w-[180px] group cursor-pointer">
              <div className="relative h-[180px] bg-[#f5f5f5] dark:bg-slate-800 rounded-sm overflow-hidden mb-2">
                <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-0 right-0 bg-darazOrange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-sm">
                  {p.discount}
                </div>
              </div>
              <p className="text-[14px] text-[#212121] dark:text-slate-200 line-clamp-2 mb-1 group-hover:text-darazOrange transition-colors">{p.title}</p>
              <div className="flex flex-col">
                <span className="text-darazOrange font-bold text-lg">{p.price}</span>
                <span className="text-[#9e9e9e] text-[12px] line-through">{p.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
