"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
    title: "The Future of Electronics",
    subtitle:
      "Precision engineering meets unparalleled performance in our latest collection.",
    buttonText: "Experience Now",
    color: "from-purple-600 to-indigo-950",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    title: "Vanguard Fashion",
    subtitle:
      "Defining the next generation of aesthetic excellence for Spring 2026.",
    buttonText: "Explore Trends",
    color: "from-purple-600 to-black",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop",
    title: "Living Spaces Redefined",
    subtitle:
      "Curated furniture that transforms your home into a masterpiece of design.",
    buttonText: "View Collection",
    color: "from-emerald-600 to-slate-950",
  },
  {
    id: 4,
    image:
      "https://amazon-blogs-brightspot.s3.amazonaws.com/5b/41/cf9810ca4445aa14d4c71c672fd5/prime-day-2023-deals-you-can-only-get-in-stores-hero-v2.jpg",
    title: "The Zenith Selection",
    subtitle:
      "Exclusive invitations to the pinnacle of our most coveted alliances.",
    buttonText: "Join Nexus",
    color: "from-rose-600 to-amber-900",
  },
];

export default function MarketplaceHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <section className="relative w-full bg-white dark:bg-slate-950 pt-32 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={BANNERS[currentSlide].image}
                alt={BANNERS[currentSlide].title}
                fill
                priority
                className="object-cover"
              />
              <div
                className={`absolute inset-0 bg-linear-to-r ${BANNERS[currentSlide].color} opacity-60 mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40" />

              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 lg:px-32 text-white">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
                    {BANNERS[currentSlide].title}
                  </h2>
                  <p className="text-lg md:text-xl font-medium mb-12 max-w-xl drop-shadow-xl text-slate-200 leading-relaxed">
                    {BANNERS[currentSlide].subtitle}
                  </p>
                  <div className="flex gap-6">
                    <button className="group bg-purple-600 text-white hover:bg-purple-500 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3">
                      {BANNERS[currentSlide].buttonText}{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button className="hidden md:flex items-center gap-3 px-10 py-4 rounded-full border-2 border-white/30 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-slate-900 transition-all">
                      View Catalog
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/20"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/20"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-10 left-10 flex gap-3 z-30">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  currentSlide === idx
                    ? "bg-purple-500 w-12"
                    : "bg-white/30 w-4 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
