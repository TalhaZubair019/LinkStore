"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Store, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Vendor {
  id: string;
  name: string;
  logo?: string;
  productCount?: number;
}

const ShopByStores = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/public/vendors");
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading && vendors.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (vendors.length === 0) return null;

  return (
    <section className="bg-white dark:bg-slate-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Shop by Stores
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Explore All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/shop?vendor=${vendor.id}`}
                className="group flex flex-col items-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {vendor.logo ? (
                      <img
                        src={vendor.logo}
                        alt={vendor.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Store className="text-blue-600 w-10 h-10" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {vendor.name}
                </h3>
                
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                  {vendor.productCount || 0} Products
                </span>
                
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit Store <ChevronRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStores;
