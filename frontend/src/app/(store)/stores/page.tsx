"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";

interface Vendor {
  id: string;
  name: string;
  logo?: string;
  storeSlug: string;
  productCount?: number;
}

export default function StoresPage() {
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title="All Stores"
        breadcrumbs={[{ label: "All Stores" }]}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-6">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/store/${vendor.storeSlug}`}
                  className="group flex flex-col items-center p-2 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full text-center"
                >
                  <div className="relative mb-3 sm:mb-6">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {vendor.logo ? (
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                        />
                      ) : (
                        <Store className="text-blue-600 w-6 h-6 sm:w-10 sm:h-10" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-[10px] sm:text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {vendor.name}
                  </h3>

                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                    {vendor.productCount || 0} Products
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && vendors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No stores found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
