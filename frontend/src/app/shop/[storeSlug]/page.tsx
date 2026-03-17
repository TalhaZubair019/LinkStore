'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Store, MapPin, Star, Share2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Dummy Data
const dummyStore = {
  name: "PrintNest Artistry",
  description: "Boutique collection of hand-crafted ceramics and modern home accessories. Each piece is unique and made with love.",
  logoUrl: null,
  slug: "printnest-artistry",
  rating: 4.9,
  reviews: 128,
  location: "New York, USA"
};

const dummyProducts = [
  { _id: '1', title: 'Modern Ceramic Vase', price: 45.00, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '2', title: 'Minimalist Coffee Mug', price: 22.00, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '3', title: 'Abstract Wall Art', price: 120.00, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '4', title: 'Sculptural Candle', price: 35.00, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
];

export default function ShopProfile() {
  const { storeSlug } = useParams();

  return (
    <div className="min-h-screen bg-white">
      {/* Cover/Header */}
      <div className="h-48 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-[40px] relative mb-16">
        <div className="absolute -bottom-10 left-12 flex items-end gap-6">
          <div className="w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden p-2">
            <div className="w-full h-full bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
               <Store className="w-12 h-12" />
            </div>
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{dummyStore.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {dummyStore.location}</span>
              <span className="flex items-center gap-1 text-yellow-600"><Star className="w-4 h-4 fill-yellow-600" /> {dummyStore.rating} ({dummyStore.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-12 flex gap-3">
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="px-6 py-2.5 bg-orange-500 rounded-xl text-white font-bold hover:shadow-lg transition-all active:scale-95 shadow-orange-500/50">
            + Follow Store
          </button>
        </div>
      </div>

      {/* Vouchers Section */}
      <div className="max-w-7xl mx-auto px-8 mb-8">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {[1, 2, 3].map((v) => (
             <div key={v} className="min-w-[280px] bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between border-dashed shrink-0">
               <div>
                 <p className="text-xl font-black text-orange-600">10% OFF</p>
                 <p className="text-xs text-orange-800 font-medium">Min. Spend $50.00</p>
                 <p className="text-[10px] text-gray-500 mt-1">Valid till 30 Dec</p>
               </div>
               <button className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-700 shadow-sm">
                 Collect
               </button>
             </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-20">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">About</h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              {dummyStore.description}
            </p>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-2">Store Stats</h3>
             <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                   <span className="text-sm text-gray-500">Products</span>
                   <span className="text-sm font-bold">42</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-sm text-gray-500">Sales</span>
                   <span className="text-sm font-bold">1,240+</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-sm text-gray-500">Joined</span>
                   <span className="text-sm font-bold">Jan 2024</span>
                </div>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Listings</h2>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                 <button className="text-indigo-600 border-b-2 border-indigo-600 pb-1">All Products</button>
                 <button className="hover:text-gray-900 pb-1">Best Sellers</button>
                 <button className="hover:text-gray-900 pb-1">New Arrivals</button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {dummyProducts.map((p) => (
               <ProductCard key={p._id} product={p as any} />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
