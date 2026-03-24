"use client";

import React from "react";
import Link from "next/link";
import { Store, ChevronRight } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  logo?: string;
  productCount?: number;
}

const ShopByStores = () => {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  if (loading && vendors.length === 0) return null;

  return (
    <section className="py-32 bg-[#0B0F1A] transition-all overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-900/50 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-in fade-in slide-in-from-left-4 duration-700">
              Curated Alliances
            </h2>
            <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] animate-in fade-in slide-in-from-left-6 duration-1000">
              Shop by <br /> <span className="text-blue-600">Stores</span>
            </h3>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs max-w-md animate-in fade-in slide-in-from-left-8 duration-1000">
              Explore the pinnacle of commerce through our exclusive network of authorized merchants.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all duration-700 animate-in fade-in slide-in-from-right-4"
          >
            All Collections <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-10">
          {vendors.map((vendor, index) => (
            <Link
              key={vendor.id}
              href={`/shop?vendor=${vendor.id}`}
              className="group relative p-10 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all duration-700 flex flex-col items-center text-center overflow-hidden hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-blue-500/10 animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-4xl bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out border border-white/5 shadow-inner">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-14 h-14 object-contain opacity-80 group-hover:opacity-100 transition-all duration-500 translate-z-10"
                    />
                  ) : (
                    <Store className="text-blue-600 w-12 h-12" />
                  )}
                </div>
                <div className="absolute -inset-2 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <div className="relative space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                  Merchant Identity
                </p>
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:scale-105 transition-transform duration-500">
                  {vendor.name}
                </h3>
                <div className="pt-4">
                  <span className="px-5 py-2.5 bg-slate-950 rounded-full text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-500 shadow-inner">
                    {vendor.productCount || 0} Assets listed
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStores;
