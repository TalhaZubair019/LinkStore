import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { 
  ShoppingBag, 
  ExternalLink,
  Calendar,
  Package,
  ArrowLeft
} from "lucide-react";

async function getOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 0 } // Don't cache orders page
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-sm text-gray-500 font-medium">Manage and track your LinkStore purchases</p>
           </div>
           <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" /> Back to Dashboard
           </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
               {/* Order Header */}
               <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-8">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                           <Calendar size={14} className="text-gray-400" />
                           {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-sm font-black text-gray-900">${order.totalAmount.toFixed(2)}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-sm font-bold text-indigo-600">#{order._id.slice(-8).toUpperCase()}</p>
                     </div>
                  </div>
                  <div>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                     }`}>
                        {order.status}
                     </span>
                  </div>
               </div>

               {/* Order Items */}
               <div className="p-8">
                  <div className="space-y-6">
                     {order.items.map((item: any) => (
                        <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 group">
                           <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                              {item.productId?.images?.[0] ? (
                                 <Image 
                                    src={item.productId.images[0]} 
                                    alt={item.productId.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                 />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={32} /></div>
                              )}
                           </div>
                           <div className="flex-1 text-center sm:text-left">
                              <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                 {item.productId?.title || "Product no longer available"}
                              </h3>
                              <p className="text-sm text-gray-500 font-medium mb-2">Quantity: {item.quantity}</p>
                              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                 <Link 
                                    href={item.productId?._id ? `/product/${item.productId._id}` : '#'} 
                                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                 >
                                    View Item <ExternalLink size={10} />
                                 </Link>
                                 <button className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                                    Write a Review
                                 </button>
                              </div>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-lg font-black text-gray-900">${item.price.toFixed(2)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-20 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <ShoppingBag size={48} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
              You haven't placed any orders yet. Start shopping and find the best deals on LinkStore!
           </p>
           <Link 
              href="/" 
              className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all"
           >
              Browse Products
           </Link>
        </div>
      )}
    </div>
  );
}
