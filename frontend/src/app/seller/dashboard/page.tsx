'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ArrowRight,
  Loader2,
  PackageCheck
} from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    conversion: 3.2
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/vendor/my-orders`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/vendor/my-products`)
        ]);
        
        if (ordersRes.ok && productsRes.ok) {
          const ordersData = await ordersRes.json();
          const productsData = await productsRes.json();
          
          const totalRevenue = ordersData.reduce((acc: number, order: any) => 
            acc + order.items.reduce((iAcc: number, item: any) => iAcc + (item.price * item.quantity), 0), 0
          );

          setStats({
            revenue: totalRevenue,
            orders: ordersData.length,
            products: productsData.length,
            conversion: 3.2
          });
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%", trendUp: true },
    { label: "Total Sales", value: stats.orders.toString(), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", trend: "+5%", trendUp: true },
    { label: "Active Products", value: stats.products.toString(), icon: Package, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Stable", trendUp: true },
    { label: "Store Reach", value: "1.2k", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50", trend: "-2%", trendUp: false },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Store Analytics</h1>
            <p className="text-sm text-gray-500 font-medium">Real-time overview of your store's performance and growth</p>
         </div>
         <div className="flex items-center gap-3">
            <Link href="/seller/products" className="px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
               Inventory
            </Link>
            <Link href="/seller/products" className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all">
               Add Product
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
             <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                   <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {stat.trend} {stat.trendUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] leading-none mb-1.5">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sales Overview Chart (Visual Placeholder) */}
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Trends</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Daily store earnings</p>
               </div>
               <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-hidden">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-4 pt-10 px-4">
               {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4">
                     <div 
                        className="w-full bg-indigo-50 rounded-full relative group/bar" 
                        style={{ height: `${h}%` }}
                     >
                        <div className="absolute inset-0 bg-indigo-600 rounded-full scale-y-0 group-hover/bar:scale-y-100 transition-transform origin-bottom duration-500"></div>
                     </div>
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Day {i+1}</span>
                  </div>
               ))}
            </div>
            
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp size={120} className="text-indigo-600" />
            </div>
         </div>

         {/* Recent Orders Side Panel */}
         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Clock className="text-indigo-600" size={20} /> Latest Sales
               </h3>
               <Link href="/seller/orders" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 group">
                  Full List <ArrowRight size={12} className="group-hover:translate-x-1 transition-all" />
               </Link>
            </div>

            <div className="space-y-6">
               {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                 <div key={order._id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs border border-gray-100 group-hover:bg-indigo-50 transition-colors">
                          {order._id.slice(-2).toUpperCase()}
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900 text-sm">${order.totalAmount.toFixed(2)}</p>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                          {order.status}
                       </span>
                    </div>
                 </div>
               )) : (
                  <div className="py-10 text-center flex flex-col items-center gap-4">
                     <PackageCheck size={48} className="text-gray-100" />
                     <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No recent sales</p>
                  </div>
               )}
            </div>
            
            <Link href="/seller/products" className="mt-10 block w-full py-5 bg-gray-900 text-white rounded-[24px] text-center font-black uppercase tracking-widest text-xs hover:bg-indigo-600 shadow-xl shadow-gray-200 hover:shadow-indigo-200 transition-all">
               Analyze Inventory
            </Link>
         </div>
      </div>
    </div>
  );
}
