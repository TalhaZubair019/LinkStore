'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const sliders = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2015&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-3xl group bg-gray-100 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)]">
      <div 
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliders.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative block">
            <Image 
              src={slide.image} 
              alt={`Banner ${slide.id}`} 
              fill
              className="object-cover"
              priority={slide.id === 1}
            />
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent lg:bg-linear-to-r lg:from-gray-900/90 lg:via-gray-900/40 lg:to-transparent flex items-center z-10">

              <div className="px-8 md:px-16 lg:px-24 w-full md:w-2/3 lg:w-1/2 text-white space-y-4 md:space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black capitalize tracking-tighter leading-[1.1] drop-shadow-xl">
                  Elevate Your <span className="text-indigo-400">Lifestyle</span>
                </h2>
                <p className="text-sm md:text-lg text-gray-200 font-medium max-w-lg drop-shadow-md leading-relaxed">
                  Discover premium products across electronics, fashion, and home essentials. 
                  Experience the new standard of online shopping.
                </p>
                <div className="pt-2 md:pt-6">
                  <Link href={slide.link} className="inline-block bg-white text-gray-900 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
