'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  User,
  ArrowRight,
  Loader2,
  Package
} from 'lucide-react';
import Image from 'next/image';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/vendor/my-orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="mb-10">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-tight">Sales & Fulfillment</h1>
         <p className="text-sm text-gray-500 font-medium">Manage your store's orders and track customer shipments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
               <ShoppingBag size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">New Orders</p>
               <p className="text-2xl font-black text-gray-900 leading-none">{orders.filter((o: any) => o.status === 'pending').length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
               <Truck size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Processing</p>
               <p className="text-2xl font-black text-gray-900 leading-none">{orders.filter((o: any) => o.status === 'processing').length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Completed</p>
               <p className="text-2xl font-black text-gray-900 leading-none">{orders.filter((o: any) => o.status === 'delivered').length}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
         {/* Filters */}
         <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl w-full md:w-96 focus-within:border-indigo-500 shadow-xs">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search orders by ID or customer..." className="bg-transparent border-none outline-hidden text-sm w-full font-bold text-gray-800 placeholder:text-gray-400" />
            </div>
         </div>

         {/* Orders List */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
               <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-gray-100">
                  <tr>
                     <th className="px-8 py-5">Order ID</th>
                     <th className="px-8 py-5">Customer</th>
                     <th className="px-8 py-5">Items Sold</th>
                     <th className="px-8 py-5">Total Earned</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [1, 2, 3].map(i => (
                       <tr key={i} className="animate-pulse">
                          <td className="px-8 py-8"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                          <td className="px-8 py-8"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                          <td className="px-8 py-8"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                          <td className="px-8 py-8"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                          <td className="px-8 py-8"><div className="h-6 bg-gray-100 rounded-full w-24"></div></td>
                          <td className="px-8 py-8"><div className="h-8 bg-gray-100 rounded w-16 float-right"></div></td>
                       </tr>
                    ))
                  ) : orders.length > 0 ? (
                    orders.map((order: any) => (
                       <tr key={order._id} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                          <td className="px-8 py-8">
                             <span className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">#{order._id.slice(-8).toUpperCase()}</span>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                   <User size={18} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-black text-gray-900">{order.customerId?.name || 'Guest'}</span>
                                   <span className="text-[10px] font-bold text-gray-400">{order.customerId?.email}</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex -space-x-3 overflow-hidden">
                                {order.items.slice(0, 3).map((item: any, idx: number) => (
                                   <div key={idx} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase overflow-hidden">
                                      {item.productId?.images?.[0] ? (
                                         <Image src={item.productId.images[0]} alt="p" fill className="object-cover" />
                                      ) : <Package size={14} />}
                                   </div>
                                ))}
                                {order.items.length > 3 && (
                                   <div className="flex items-center justify-center h-10 w-10 rounded-xl ring-4 ring-white bg-indigo-600 text-white text-[10px] font-black">
                                      +{order.items.length - 3}
                                   </div>
                                )}
                             </div>
                          </td>
                          <td className="px-8 py-8 font-black text-gray-900">
                             ${order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toFixed(2)}
                          </td>
                          <td className="px-8 py-8">
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                             }`}>
                                {order.status === 'delivered' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                {order.status}
                             </span>
                          </td>
                          <td className="px-8 py-8 text-right">
                             <button className="text-gray-400 hover:text-indigo-600 p-2.5 bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 shadow-xs transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest ml-auto">
                                <Eye size={14} /> Details <ArrowRight size={12} />
                             </button>
                          </td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={6} className="py-20 text-center">
                          <div className="flex flex-col items-center">
                             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                                <ShoppingBag size={40} />
                             </div>
                             <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No sales yet</p>
                             <p className="text-sm text-gray-400 font-medium">Your store's sales will appear here.</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
