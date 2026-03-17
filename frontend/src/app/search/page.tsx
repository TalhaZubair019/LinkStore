'use client';

import { useSearchParams } from 'next/navigation';
import { ShoppingCart, User, Star } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/layout/SearchBar';

const dummySearchResults = [
  { _id: '1', title: 'Modern Ceramic Vase', price: 45.00, images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '2', title: 'Minimalist Coffee Mug - Ceramic', price: 22.00, images: ['https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '3', title: 'Ceramic Serving Bowl Set', price: 65.00, images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's4', name: 'Home Essentials', slug: 'home-essentials' } },
  { _id: '4', title: 'Decorative Art Pitcher', price: 38.00, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* 1. Reusable Top Bar */}
      <div className="bg-gray-100 text-[11px] text-gray-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-indigo-600 hover:underline">SAVE MORE ON APP</Link>
            <Link href="/seller/dashboard" className="text-indigo-600 font-bold hover:underline">SELL ON LINKSTORE</Link>
            <Link href="#" className="hover:text-indigo-600 hover:underline">CUSTOMER CARE</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-indigo-600 hover:underline">LOGIN</Link>
            <Link href="/signup" className="hover:text-indigo-600 hover:underline">SIGNUP</Link>
          </div>
        </div>
      </div>

      {/* 2. Reusable Header */}
      <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center gap-6 lg:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
             <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200">L</div>
             <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">LinkStore</span>
          </Link>

          {/* Search Bar component */}
          <SearchBar />

          {/* Cart Element */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
               <ShoppingCart className="w-7 h-7" />
               <span className="absolute 0 right-0 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                 2
               </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-20">
        <div className="mb-4 text-sm text-gray-500">
          Home &gt; {category !== 'All' ? `${category} > ` : ''} <span className="text-indigo-600 font-medium">"{query || 'All items'}"</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Filter (Faceted Filtering) */}
          <div className="w-full lg:w-64 shrink-0 bg-white border border-gray-100 p-4 rounded-xl self-start sticky top-28">
            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="accent-indigo-500" /> Home & Kitchen</label></li>
                <li><label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="accent-indigo-500" /> Dining & Serving</label></li>
                <li><label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="accent-indigo-500" /> Decor</label></li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-hidden focus:border-indigo-500" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-hidden focus:border-indigo-500" />
              </div>
              <button className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2 rounded-sm transition-colors">Apply</button>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Rating</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {[5, 4, 3, 2, 1].map((rating) => (
                   <li key={rating}>
                     <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                       <input type="checkbox" className="accent-indigo-500" /> 
                       <div className="flex gap-0.5">
                         {Array.from({length: 5}).map((_, i) => (
                           <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                         ))}
                       </div>
                       {rating < 5 && <span className="text-xs">& Up</span>}
                     </label>
                   </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 bg-white border border-gray-100 p-4 rounded-xl min-h-[500px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-base text-gray-600">
                <span className="font-bold text-gray-900">{dummySearchResults.length} items found</span> for "{query || 'All'}"
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select className="border border-gray-200 rounded px-2 py-1 outline-hidden focus:border-indigo-500">
                  <option>Best Match</option>
                  <option>Price Low to High</option>
                  <option>Price High to Low</option>
                  <option>Top Reviews</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {dummySearchResults.map((p) => (
                <div key={p._id} className="transition-transform hover:-translate-y-1">
                   <ProductCard product={p as any} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
