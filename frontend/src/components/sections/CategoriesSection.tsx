"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="min-w-[120px] h-[140px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-950 py-16 transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-purple-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            All Categories{" "}
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {categories.slice(0, 8).map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              viewport={{ once: true }}
            >
              <Link
                href={category.link}
                className="flex flex-col items-center group"
              >
                <div className="relative w-full aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/10 group-hover:border-purple-500/50 group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={80}
                      height={80}
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
