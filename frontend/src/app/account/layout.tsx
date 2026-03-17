"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/AuthSlice";
import { 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ChevronRight
} from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    { title: "Dashboard", href: "/account", icon: LayoutDashboard },
    { title: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { title: "Wishlist", href: "/account/wishlist", icon: Heart },
    { title: "Profile Settings", href: "/account/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/auth/logout`, { method: "POST" });
      dispatch(logout());
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* 1. Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">
              LinkStore
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-all border border-transparent active:scale-95"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-10">
         <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0">
               <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm sticky top-28">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                     <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100/50 shadow-inner">
                        {user?.name ? user.name[0].toUpperCase() : "U"}
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Welcome back</p>
                        <h3 className="text-lg font-black text-gray-900 leading-none truncate max-w-[140px]">{user?.name || "Customer"}</h3>
                     </div>
                  </div>

                  <nav className="space-y-2">
                     {menuItems.map((item) => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between group px-4 py-3 rounded-2xl transition-all ${
                            pathname === item.href 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 animate-in fade-in" 
                              : "hover:bg-indigo-50/50"
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-indigo-600"} transition-colors`} />
                              <span className={`text-sm font-bold ${pathname === item.href ? "text-white" : "text-gray-600 group-hover:text-gray-900"} transition-colors`}>{item.title}</span>
                           </div>
                           <ChevronRight size={14} className={`${pathname === item.href ? "text-white/70" : "text-gray-300 group-hover:text-indigo-600"} transition-all group-hover:translate-x-1`} />
                        </Link>
                     ))}
                  </nav>
               </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1">
               {children}
            </div>
         </div>
      </main>
    </div>
  );
}
