"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Store, Package, ArrowLeft, Search, Eye, Info } from "lucide-react";

interface VendorStore {
  id: string;
  name: string;
  storeName: string;
  storeDescription: string;
  logo: string;
  banner: string;
  joinedDate: string;
}

export default function AdminStoreViewPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;

  const [store, setStore] = useState<VendorStore | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/stores/${storeSlug}`);
        if (!res.ok) {
          setError("Store not found or failed to load data");
          return;
        }
        const data = await res.json();
        setStore(data.store);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Fetch store error:", err);
        setError("An error occurred while fetching store data");
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug) {
      fetchStoreData();
    }
  }, [storeSlug]);

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">
          Loading Admin Preview...
        </p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <Store size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {error || "Store Not Found"}
          </h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl transition-all"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans pb-20 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                <Eye size={12} />
                Admin View Only
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                Store Preview: {store.storeName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <Info size={18} className="text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
              Reviewing vendor catalog and shop details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 relative shadow-inner border border-slate-100 dark:border-slate-800">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.storeName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Store size={32} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {store.storeName}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  @{storeSlug}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Shop Description
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {store.storeDescription || "No description provided."}
                </p>
              </div>
              <div className="flex items-center justify-between py-2 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                <span className="text-xs font-bold text-slate-500">
                  Products
                </span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                  {products.length} Items
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package size={20} className="text-blue-500" />
                Product Catalog
              </h2>
              <div className="relative group min-w-[200px] md:min-w-[300px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Quick search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!p.stockQuantity || p.stockQuantity <= 0 ? (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center p-2">
                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md rotate-12 shadow-lg ring-1 ring-white/20">
                          SOLD OUT
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[60%]">
                        {p.category || "General"}
                      </span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {p.price}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <Search size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">
                    No products found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
