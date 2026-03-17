"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Electronic Devices", icon: "📱", sub: ["Smartphones", "Laptops", "Tablets"] },
  { name: "Electronic Accessories", icon: "🎧", sub: ["Headphones", "Power Banks", "Memory Cards"] },
  { name: "TV & Home Appliances", icon: "📺", sub: ["TVs", "Refrigerators", "Washing Machines"] },
  { name: "Health & Beauty", icon: "🧴", sub: ["Skincare", "Makeup", "Fragrances"] },
  { name: "Babies & Toys", icon: "🧸", sub: ["Diapers", "Baby Clothing", "Educational Toys"] },
  { name: "Groceries & Pets", icon: "🍎", sub: ["Fresh Food", "Beverages", "Pet Supplies"] },
  { name: "Home & Lifestyle", icon: "🏠", sub: ["Furniture", "Bedding", "Kitchenware"] },
  { name: "Women's Fashion", icon: "👗", sub: ["Clothing", "Shoes", "Bags"] },
  { name: "Men's Fashion", icon: "👕", sub: ["Clothing", "Shoes", "Watches"] },
  { name: "Watches, Bags & Jewelry", icon: "⌚", sub: ["Backpacks", "Necklaces", "Earrings"] },
  { name: "Sports & Outdoor", icon: "⚽", sub: ["Fitness Gear", "Camping Equipment", "Cycling"] },
  { name: "Automotive & Motorbike", icon: "🚗", sub: ["Car Electronics", "Motorcycle Gear", "Tools"] },
];

const banners = [
  { id: 1, src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200&h=400", alt: "Big Sale 1" },
  { id: 2, src: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=1200&h=400", alt: "Tech Fest" },
  { id: 3, src: "https://images.unsplash.com/photo-1544117518-2b44c8ad2183?auto=format&fit=crop&q=80&w=1200&h=400", alt: "Beauty Week" },
];

export default function HeroCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#f5f5f5] dark:bg-slate-950 py-4">
      <div className="max-w-[1200px] mx-auto px-4 flex gap-4 h-[400px]">
        {/* Sidebar Categories */}
        <div className="hidden lg:block w-[220px] bg-white dark:bg-slate-900 shadow-sm rounded-sm relative z-20">
          <ul className="py-2">
            {categories.map((cat, idx) => (
              <li 
                key={idx}
                onMouseEnter={() => setActiveCategory(idx)}
                onMouseLeave={() => setActiveCategory(null)}
                className="group px-3 py-1.5 flex items-center justify-between text-[13px] text-[#424242] dark:text-slate-300 hover:bg-[#f5f5f5] dark:hover:bg-slate-800 hover:text-darazOrange cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="truncate max-w-[140px]">{cat.name}</span>
                </div>
                <ChevronRight size={14} className="text-[#9e9e9e] group-hover:text-darazOrange" />
                
                {/* Multi-level Submenu */}
                {activeCategory === idx && (
                  <div className="absolute top-0 left-full w-[260px] h-full bg-white dark:bg-slate-800 shadow-lg border-l border-slate-100 dark:border-slate-700 py-4 px-6">
                    <h3 className="font-bold text-darazOrange mb-4 border-b pb-2">{cat.name}</h3>
                    <ul className="space-y-3">
                      {cat.sub.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <Link href="#" className="text-[13px] text-[#424242] dark:text-slate-300 hover:text-darazOrange transition-colors">
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel Banner */}
        <div className="flex-1 relative overflow-hidden rounded-sm group min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={banners[currentBanner].src}
                alt={banners[currentBanner].alt}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentBanner ? "bg-darazOrange w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
