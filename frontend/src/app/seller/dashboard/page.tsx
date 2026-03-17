'use client';

import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Seller Dashboard</h1>
         <Link href="/seller/products" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
           Manage Products
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
           <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
             <DollarSign className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
             <h3 className="text-2xl font-black text-gray-900">$12,450.00</h3>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
             <ShoppingCart className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Orders</p>
             <h3 className="text-2xl font-black text-gray-900">342</h3>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
             <Package className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Products</p>
             <h3 className="text-2xl font-black text-gray-900">45</h3>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
             <TrendingUp className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Conversion</p>
             <h3 className="text-2xl font-black text-gray-900">3.2%</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 h-96 flex flex-col items-center justify-center text-gray-400">
            [Sales Chart Placeholder]
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Recent Orders</h3>
            <div className="space-y-4">
               {[1, 2, 3, 4, 5].map((order) => (
                 <div key={order} className="flex items-center justify-between text-sm">
                   <div>
                     <p className="font-bold text-gray-900">#ORD-{Math.floor(Math.random() * 10000)}</p>
                     <p className="text-gray-500 text-xs">2 items</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-gray-900">$45.00</p>
                     <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-sm">Pending</span>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
