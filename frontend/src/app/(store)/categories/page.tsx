"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "/api/public/content?section=categories&all=true",
        );
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title="All Categories"
        breadcrumbs={[{ label: "All Categories" }]}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="aspect-square bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={category.link}
                  className="flex flex-col items-center group"
                >
                  <div className="relative w-full aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center mb-3 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:border-blue-500/50 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={80}
                        height={80}
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <span className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {category.title}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No categories found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
