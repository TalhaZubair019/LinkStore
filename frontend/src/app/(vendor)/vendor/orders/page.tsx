"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderFulfillmentModal from "@/components/(vendor)/vendor/OrderFulfillmentModal";

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  vendorId: string;
}

interface VendorStatus {
  vendorId: string;
  status: string;
}

interface Order {
  id: string;
  userId: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  customer: any;
  vendorStatuses: VendorStatus[];
}

export default function VendorOrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vendor/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateVendorSubtotal = (orderItems: OrderItem[]) => {
    return orderItems
      .filter(item => item.vendorId === user?.id)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getVendorStatus = (order: Order) => {
    return order.vendorStatuses?.find(vs => vs.vendorId === user?.id)?.status || "Pending";
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      "Pending": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      "Processing": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "Shipped": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "Delivered": "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      "Cancelled": "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
    };

    const icons: Record<string, any> = {
      "Pending": Clock,
      "Processing": Package,
      "Shipped": Truck,
      "Delivered": CheckCircle2,
      "Cancelled": AlertCircle
    };

    const Icon = icons[status] || Clock;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-current/10 ${styles[status]}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order Fulfillment</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and ship your marketplace orders</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500/50 transition-all w-full md:w-80 text-sm font-medium"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Order Details</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Your Revenue</th>
                <th className="px-8 py-5">Fulfillment</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <ShoppingBag size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No orders found</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm">When customers buy your products, they'll appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-900 dark:text-white block">#{order.id}</span>
                      <span className="text-xs text-slate-400 font-medium">{order.date}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{order.customer?.city}, {order.customer?.postcode}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        ${calculateVendorSubtotal(order.items).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={getVendorStatus(order)} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <OrderFulfillmentModal 
          order={selectedOrder} 
          onClose={() => setIsModalOpen(false)} 
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
}
