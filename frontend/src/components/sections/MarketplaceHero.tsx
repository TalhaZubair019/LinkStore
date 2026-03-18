"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
    title: "Mega Sale Event",
    subtitle: "Up to 70% Off on Electronics & Gadgets",
    buttonText: "Shop Now",
    color: "from-blue-600 to-indigo-900",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    title: "Fashion Forward",
    subtitle: "New Arrivals: Spring Collection 2026",
    buttonText: "Explore Trends",
    color: "from-rose-500 to-purple-800",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop",
    title: "Home Essentials",
    subtitle: "Modern Furniture for Modern Living",
    buttonText: "View Collection",
    color: "from-emerald-500 to-teal-900",
  },
];

export default function MarketplaceHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <section className="relative w-full bg-white dark:bg-slate-950 pt-4 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={BANNERS[currentSlide].image}
                alt={BANNERS[currentSlide].title}
                fill
                priority
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-linear-to-r ${BANNERS[currentSlide].color} opacity-40 mix-blend-multiply`} />
              
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 text-white">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
                    {BANNERS[currentSlide].title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl font-medium mb-8 max-w-xl drop-shadow-md">
                    {BANNERS[currentSlide].subtitle}
                  </p>
                  <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-full text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                    {BANNERS[currentSlide].buttonText}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === idx ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
