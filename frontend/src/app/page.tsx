'use client';

import ProductCard from '@/components/ProductCard';
import { ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import CategoryMenu from '@/components/home/CategoryMenu';
import HeroCarousel from '@/components/home/HeroCarousel';
import FlashSale from '@/components/home/FlashSale';
import SearchBar from '@/components/layout/SearchBar';

const dummyProducts = [
  { _id: '1', title: 'Modern Ceramic Vase', price: 45.00, images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '2', title: 'Leather Mini Backpack', price: 89.99, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's2', name: 'Urban Goods', slug: 'urban-goods' } },
  { _id: '3', title: 'Gold Hoop Earrings', price: 24.50, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's1', name: 'PrintNest Artistry', slug: 'printnest-artistry' } },
  { _id: '4', title: 'Wireless Charging Dock', price: 55.00, images: ['https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's3', name: 'TechHaven', slug: 'tech-haven' } },
  { _id: '5', title: 'Minimalist Desk Lamp', price: 35.00, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's4', name: 'Home Essentials', slug: 'home-essentials' } },
  { _id: '6', title: 'Noise Cancelling Headphones', price: 199.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's3', name: 'TechHaven', slug: 'tech-haven' } },
  { _id: '7', title: 'Organic Cotton T-Shirt', price: 18.50, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's5', name: 'Basic Threads', slug: 'basic-threads' } },
  { _id: '8', title: 'Stainless Steel Water Bottle', price: 22.00, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's6', name: 'EcoLife', slug: 'ecolife' } },
  { _id: '9', title: 'Yoga Mat with Alignment Lines', price: 29.99, images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's7', name: 'FitGear', slug: 'fitgear' } },
  { _id: '10', title: 'Smart Home Security Camera', price: 85.00, images: ['https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's3', name: 'TechHaven', slug: 'tech-haven' } },
  { _id: '11', title: 'Aromatherapy Essential Oil Diffuser', price: 32.50, images: ['https://images.unsplash.com/photo-1608514145964-6729a6ce4af5?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's4', name: 'Home Essentials', slug: 'home-essentials' } },
  { _id: '12', title: 'Vintage Style Sunglasses', price: 15.00, images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop'], storeId: { _id: 's2', name: 'Urban Goods', slug: 'urban-goods' } },
];

const quickLinks = [
  { id: 1, name: 'Mart', icon: '🛒', bgColor: 'bg-green-100', color: 'text-green-600' },
  { id: 2, name: 'Fashion', icon: '👗', bgColor: 'bg-pink-100', color: 'text-pink-600' },
  { id: 3, name: 'Beauty', icon: '💄', bgColor: 'bg-purple-100', color: 'text-purple-600' },
  { id: 4, name: 'Free Delivery', icon: '🚚', bgColor: 'bg-blue-100', color: 'text-blue-600' },
  { id: 5, name: 'Vouchers', icon: '🎟️', bgColor: 'bg-indigo-100', color: 'text-indigo-600' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* 1. Top Bar (Save more on App, Sell on Daraz) */}
      <div className="bg-gray-100 text-[11px] text-gray-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-indigo-500 hover:underline">SAVE MORE ON APP</Link>
            <Link href="/seller/dashboard" className="text-indigo-500 font-bold hover:underline">SELL ON LINKSTORE</Link>
            <Link href="#" className="hover:text-indigo-500 hover:underline">CUSTOMER CARE</Link>
            <Link href="#" className="hover:text-indigo-500 hover:underline">TRACK MY ORDER</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-indigo-500 hover:underline">LOGIN</Link>
            <Link href="/signup" className="hover:text-indigo-500 hover:underline">SIGNUP</Link>
            <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-500">
              Change Language
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Search Header */}
      <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center gap-6 lg:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
             <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200">L</div>
             <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">LinkStore</span>
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Cart Element */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-500 transition-colors">
               <ShoppingCart className="w-7 h-7" />
               <span className="absolute 0 right-0 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                 2
               </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 cursor-pointer group">
               <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                 <User className="w-5 h-5" />
               </div>
            </div>
          </div>
        </div>
      </header>

      <CategoryMenu />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-20">
        
        {/* 3. Hero Section (Full Width Cinematic) */}
        <section className="mb-6">
          <HeroCarousel />
        </section>


        {/* 4. Quick Links / Icons Nav List */}
        <section className="bg-white rounded-xl p-4 lg:p-6 shadow-xs border border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex justify-between items-center min-w-[600px] gap-4">
             {quickLinks.map((link) => (
               <Link href="#" key={link.id} className="flex items-center gap-3 w-48 group">
                 <div className={`w-12 h-12 rounded-full ${link.bgColor} ${link.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {link.icon}
                 </div>
                 <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-500 transition-colors">
                    {link.name}
                 </span>
               </Link>
             ))}
          </div>
        </section>

        {/* 5. Flash Sale Component */}
        <FlashSale />

        {/* 6. Just For You Feed */}
        <section className="mt-8">
           <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6">Just For You</h2>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
              {dummyProducts.map((p) => (
                <div key={p._id} className="transition-transform hover:-translate-y-1">
                   <ProductCard product={p as any} />
                </div>
              ))}
           </div>
           
           <div className="mt-12 flex justify-center">
             <button className="border-2 border-indigo-500 text-indigo-500 px-12 py-3 lg:px-32 lg:py-4 font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-colors">
               Load More
             </button>
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto pt-16 pb-8 border-t border-gray-200 text-sm">
         <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
               <h3 className="font-black text-gray-900 uppercase tracking-tight text-base mb-4">Customer Care</h3>
               <ul className="space-y-2 text-gray-500">
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">How to Buy</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Corporate & Bulk Purchasing</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Returns & Refunds</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Contact Us</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <h3 className="font-black text-gray-900 uppercase tracking-tight text-base mb-4">LinkStore</h3>
               <ul className="space-y-2 text-gray-500">
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">About LinkStore</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Digital Payments</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">LinkStore Care</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Terms & Conditions</Link></li>
                  <li><Link href="#" className="hover:text-indigo-500 hover:underline">Privacy Policy</Link></li>
               </ul>
            </div>
            <div className="md:col-span-2">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">L</div>
                 <div>
                   <h3 className="font-black text-indigo-500 text-lg uppercase tracking-tight">Happy Shopping</h3>
                   <p className="text-gray-500 text-xs">Download App</p>
                 </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-32 h-10 bg-black rounded-lg cursor-pointer"></div>
                  <div className="w-32 h-10 bg-black rounded-lg cursor-pointer"></div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
