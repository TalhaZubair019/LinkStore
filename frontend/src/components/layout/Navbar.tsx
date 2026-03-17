"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import db from "@data/db.json";

function Navbar() {
  const navbarData = db.navbar;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#f5f5f5] dark:bg-slate-900 py-1 text-[12px] text-[#212121] dark:text-slate-400">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-darazOrange uppercase transition-colors">Save More on App</Link>
            <Link href="#" className="hover:text-darazOrange uppercase transition-colors">Sell on Daraz</Link>
            <Link href="#" className="hover:text-darazOrange uppercase transition-colors">Customer Care</Link>
            <Link href="#" className="hover:text-darazOrange uppercase transition-colors">Track my Order</Link>
          </div>
          <div className="flex gap-4 items-center">
            {mounted && isAuthenticated ? (
              <div className="flex gap-4">
                <span className="font-semibold">{user?.name}</span>
                <Link href="/account" className="hover:text-darazOrange uppercase transition-colors">My Profile</Link>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="hover:text-darazOrange uppercase transition-colors font-semibold italic text-darazOrange">Login</Link>
                <Link href="/signup" className="hover:text-darazOrange uppercase transition-colors">Sign Up</Link>
              </div>
            )}
            <span className="flex items-center gap-1 cursor-pointer hover:text-darazOrange uppercase font-semibold">Change Language <ChevronDown size={14} /></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-darazOrange py-4 pb-6">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="bg-white p-2 rounded-lg shadow-sm">
                <Image
                src={navbarData.assets.logo.src}
                alt={navbarData.assets.logo.alt}
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
                priority
                />
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[700px] relative flex h-11">
            <input
              type="text"
              placeholder="Search in PrintNest"
              className="w-full h-full bg-[#eff0f5] border-none focus:ring-0 px-4 text-sm text-[#212121] rounded-l-sm"
            />
            <button className="bg-[#f57224] hover:bg-[#d0611e] h-full px-5 rounded-r-sm flex items-center justify-center transition-colors">
              <Search className="text-white w-5 h-5" />
            </button>
          </div>

          {/* Icons/Actions */}
          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative group text-white">
              <ShoppingCart className="w-8 h-8" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-darazOrange text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border border-darazOrange">
                  {totalQuantity}
                </span>
              )}
            </Link>
            
            <Link href="/wishlist" className="hidden md:block relative group text-white">
              <Heart className="w-8 h-8" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-darazOrange text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border border-darazOrange">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-white p-1"
                aria-label="Open menu"
            >
                <Menu size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Links (Wait for next section) */}
      <div className="bg-white border-b border-slate-200 dark:bg-slate-900 shadow-sm hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex gap-6 text-sm text-[#212121] dark:text-slate-300 overflow-x-auto scrollbar-hide">
            {navbarData.navigation.map((item: any, index: number) => (
                <Link key={index} href={item.href} className="hover:text-darazOrange whitespace-nowrap transition-colors">
                    {item.label}
                </Link>
            ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-100 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-slate-900 z-101 shadow-2xl flex flex-col"
            >
              <div className="p-4 bg-darazOrange flex items-center justify-between">
                <span className="text-white font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                    <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!isAuthenticated && (
                    <div className="grid grid-cols-2 gap-2 pb-4 border-b">
                         <Link href="/login" className="text-center py-2 bg-darazOrange text-white rounded font-bold">Login</Link>
                         <Link href="/signup" className="text-center py-2 border border-darazOrange text-darazOrange rounded font-bold">Sign Up</Link>
                    </div>
                )}
                <nav className="space-y-2">
                    {navbarData.navigation.map((item: any, index: number) => (
                        <Link 
                            key={index} 
                            href={item.href} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-3 px-2 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
