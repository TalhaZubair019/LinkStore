'use client';

import ProductCard from '@/components/ProductCard';
import { ShoppingBag, Star, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const dummyProducts = [
  { _id: '1', title: 'Modern Ceramic Vase', price: 45.00, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '2', title: 'Leather Mini Backpack', price: 89.99, images: [], storeId: { _id: 's2', name: 'Urban Goods', slug: 'urban-goods' } },
  { _id: '3', title: 'Gold Hoop Earrings', price: 24.50, images: [], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '4', title: 'Wireless Charging Dock', price: 55.00, images: [], storeId: { _id: 's3', name: 'TechHaven', slug: 'tech-haven' } },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="h-20 border-b border-gray-50 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-lg z-50">
         <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-1 shadow-lg shadow-indigo-200">L</div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">LinkStore</span>
         </Link>
         
         <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <Link href="/" className="text-gray-900">Explore</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Categories</Link>
            <Link href="/seller/dashboard" className="text-indigo-600 hover:text-indigo-700 transition-colors">Sell on LinkStore</Link>
         </div>

         <div className="flex items-center gap-6">
            <Link href="/cart" className="relative p-2 text-gray-900 hover:scale-110 transition-transform">
               <ShoppingBag className="w-6 h-6" />
               <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                 0
               </span>
            </Link>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
         <div className="bg-gray-900 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>
            
            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-indigo-500/20">
              The Multi-Vendor Marketplace
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-none">
              CURATED BY <br/> <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 italic font-serif lowercase px-2">independent</span> CREATORS
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 font-medium">
              Discover unique products from hundreds of verified sellers. <br/>
              Support creators directly with our split-payment system.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
               <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95">
                  Browse Collections
               </button>
               <Link href="/seller/dashboard" className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md active:scale-95">
                  Become a Vendor
               </Link>
            </div>
         </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gray-50/50 py-12">
         <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 group">
               <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-tighter">Fast Onboarding</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Start selling in minutes with Stripe Express.</p>
               </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 group">
               <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-tighter">Secure Checkout</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Multi-vendor split payments powered by Stripe.</p>
               </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 group">
               <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-tighter">Verified Sellers</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Curated products from top independent vendors.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Editor's Picks</h2>
               <div className="h-1.5 w-20 bg-indigo-600 rounded-full"></div>
            </div>
            <button className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
               View All
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dummyProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-20 px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
            <div className="md:col-span-2 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center font-black">L</div>
                  <span className="text-xl font-black tracking-tighter uppercase">LinkStore</span>
               </div>
               <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                  The future of independent commerce. We provide the infrastructure for creators to build their brand and for shoppers to discover quality.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-gray-500 uppercase tracking-widest text-xs">Marketplace</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Categories</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Success Stories</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-gray-500 uppercase tracking-widest text-xs">For Sellers</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li><Link href="/seller/dashboard" className="hover:text-indigo-400 transition-colors">Sell on LinkStore</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Vendor Guidelines</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pricing & Fees</Link></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}
