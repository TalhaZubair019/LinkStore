"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: 1, name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop" },
  { id: 2, name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop" },
  { id: 3, name: "Home & Garden", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100&h=100&fit=crop" },
  { id: 4, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfaf41039a?w=100&h=100&fit=crop" },
  { id: 5, name: "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=100&h=100&fit=crop" },
  { id: 6, name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop" },
  { id: 7, name: "Automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=100&fit=crop" },
  { id: 8, name: "Books", image: "https://images.unsplash.com/photo-1544640805-3536cd2d2885?w=100&h=100&fit=crop" },
  { id: 9, name: "Health", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop" },
  { id: 10, name: "Pets", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=100&h=100&fit=crop" },
  { id: 11, name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop" },
  { id: 12, name: "Gifts", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=100&h=100&fit=crop" },
];

export default function CategoryGrid() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 mb-6">
      <h2 className="text-[#424242] dark:text-slate-200 font-bold text-lg mb-4">Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href="#" 
            className="flex flex-col items-center justify-center p-4 border-r border-b border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group"
          >
            <div className="relative w-16 h-16 mb-2 overflow-hidden">
               <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-[14px] text-[#212121] dark:text-slate-300 group-hover:text-darazOrange transition-colors text-center font-medium">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
