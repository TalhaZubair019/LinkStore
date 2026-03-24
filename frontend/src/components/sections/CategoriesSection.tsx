"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/public/content?section=categories");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="min-w-[100px] h-[120px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-950 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Shop by Category
          </h2>
          <Link href="/shop" className="text-blue-600 hover:underline font-medium text-sm">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={category.link}
                className="flex flex-col items-center group"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center mb-2 transition-all group-hover:shadow-lg group-hover:border-blue-500/50 group-hover:-translate-y-1">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={80}
                    height={80}
                    className="object-contain p-2 transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
