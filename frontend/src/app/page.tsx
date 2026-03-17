import ProductCard from '@/components/ProductCard';
import { ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import CategoryMenu from '@/components/home/CategoryMenu';
import HeroCarousel from '@/components/home/HeroCarousel';
import FlashSale from '@/components/home/FlashSale';
import SearchBar from '@/components/layout/SearchBar';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/public/products`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

const quickLinks = [
  { id: 1, name: 'Mart', icon: '🛒', bgColor: 'bg-green-100', color: 'text-green-600' },
  { id: 2, name: 'Fashion', icon: '👗', bgColor: 'bg-pink-100', color: 'text-pink-600' },
  { id: 3, name: 'Beauty', icon: '💄', bgColor: 'bg-purple-100', color: 'text-purple-600' },
  { id: 4, name: 'Free Delivery', icon: '🚚', bgColor: 'bg-blue-100', color: 'text-blue-600' },
  { id: 5, name: 'Vouchers', icon: '🎟️', bgColor: 'bg-indigo-50', color: 'text-indigo-600' },
];

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* 2. Main Search Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50">
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
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
               <ShoppingCart className="w-7 h-7" />
               <span className="absolute 0 right-0 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                 2
               </span>
            </Link>
            <Link href="/login" className="hidden md:flex items-center gap-2 cursor-pointer group">
               <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                 <User className="w-5 h-5" />
               </div>
            </Link>
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
                 <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">
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
              {products.map((p: any) => (
                <div key={p._id} className="transition-transform hover:-translate-y-1">
                   <ProductCard product={p} />
                </div>
              ))}
           </div>
           
           <div className="mt-12 flex justify-center">
             <button className="border-2 border-indigo-500 text-indigo-600 px-12 py-3 lg:px-32 lg:py-4 font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-colors">
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
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">How to Buy</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Corporate & Bulk Purchasing</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Returns & Refunds</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Contact Us</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <h3 className="font-black text-gray-900 uppercase tracking-tight text-base mb-4">LinkStore</h3>
               <ul className="space-y-2 text-gray-500">
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">About LinkStore</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Digital Payments</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">LinkStore Care</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Terms & Conditions</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 hover:underline">Privacy Policy</Link></li>
               </ul>
            </div>
            <div className="md:col-span-2">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">L</div>
                 <div>
                   <h3 className="font-black text-indigo-600 text-lg uppercase tracking-tight">Happy Shopping</h3>
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
