'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const dummyOrders = [
  { id: 'ORD-58392', store: 'PrintNest Artistry', date: '15 Mar 2026', total: 45.00, status: 'To Ship', items: [{ title: 'Modern Ceramic Vase', qty: 1, image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=100&auto=format&fit=crop' }] },
  { id: 'ORD-12044', store: 'TechHaven Official', date: '10 Mar 2026', total: 299.00, status: 'To Receive', items: [{ title: 'Sony WH-1000XM5 Headphones - Silver', qty: 1, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=100&auto=format&fit=crop' }] },
  { id: 'ORD-99382', store: 'Urban Goods', date: '01 Mar 2026', total: 89.99, status: 'To Review', items: [{ title: 'Leather Mini Backpack', qty: 1, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=100&auto=format&fit=crop' }] },
];

export default function BuyerOrders() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'To Review'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <header className="bg-white shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-gray-900 tracking-tighter uppercase">LinkStore</Link>
          <div className="flex items-center gap-4 text-sm font-bold">
             <Link href="#" className="text-orange-500">My Orders</Link>
             <Link href="#" className="hover:text-orange-500 text-gray-500">My Account</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-6">My Orders</h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-xs mb-6 flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 min-w-[100px] text-center py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
             >
               {tab}
             </button>
          ))}
        </div>

        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
               <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <span className="font-bold text-gray-900">{order.store}</span>
                     <span className="text-gray-400 text-xs">{order.date}</span>
                  </div>
                  <span className={`text-sm font-bold uppercase tracking-widest ${
                    order.status === 'To Ship' ? 'text-orange-500' : 
                    order.status === 'To Receive' ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {order.status}
                  </span>
               </div>
               
               <div className="p-6">
                 {order.items.map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                         <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{item.title}</h3>
                         <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-orange-500">${order.total.toFixed(2)}</p>
                      </div>
                   </div>
                 ))}
               </div>

               <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 {order.status === 'To Ship' && <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-sm hover:bg-gray-100 transition-colors">Contact Seller</button>}
                 {order.status === 'To Receive' && <button className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-sm hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">Track Package</button>}
                 {order.status === 'To Review' && <button className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2"><Star className="w-4 h-4" /> Write Review</button>}
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
