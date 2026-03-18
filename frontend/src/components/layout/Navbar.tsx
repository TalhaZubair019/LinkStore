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
  Trash2,
  X,
  LogOut,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import db from "@data/db.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { removeFromCart, clearCart } from "@/redux/CartSlice";
import { toggleWishlist, clearWishlist } from "@/redux/WishListSlice";
import { logout } from "@/redux/AuthSlice";

function Navbar() {
  const navbarData = db.navbar;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems, totalQuantity } = useSelector(
    (state: RootState) => state.cart,
  );
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist,
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartState");
        localStorage.removeItem("wishlistItems");
      }
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/account") ||
    pathname === "/apply-vendor"
  ) {
    return null;
  }

  return (
    <header className="absolute top-0 left-0 w-full z-50 font-sans bg-transparent dark:bg-transparent">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 pt-4 sm:pt-6 pb-3 flex items-center justify-between gap-4 lg:gap-8 relative w-full">
        <Link href="/" className="shrink-0 relative z-10">
          <Image
            src={navbarData.assets.logo.src}
            alt={navbarData.assets.logo.alt}
            width={navbarData.assets.logo.width}
            height={navbarData.assets.logo.height}
            className="h-8 sm:h-10 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            priority
          />
        </Link>

        <div className="hidden min-[830px]:flex flex-1 justify-center px-4">
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-2 min-[830px]:gap-3 lg:gap-8 xl:gap-10">
              {navbarData.navigation.map(
                (item: (typeof navbarData.navigation)[0], index: number) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-[15px] lg:text-[18px] text-[#333333] dark:text-slate-200 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="hidden min-[830px]:flex items-center gap-2 lg:gap-3 relative">
          <ThemeToggle />
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link
              href="/cart"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      My Cart ({mounted ? totalQuantity : 0})
                    </span>
                  </div>
                  {cartItems.length === 0 ? (
                    <p className="text-center text-slate-400 py-6 text-sm">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 items-center group"
                        >
                          <div className="relative w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md overflow-hidden shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold">
                              {item.quantity} x ${item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <Link
                      href="/cart"
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-lg"
                    >
                      View Cart & Checkout
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {mounted && isAuthenticated ? (
            <div className="relative group">
              <Link
                href={user?.isAdmin ? "/admin/dashboard" : "/account"}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 mb-1">
                  Signed in as <br />
                  <span className="text-slate-800 dark:text-slate-100 text-sm">
                    {user?.name}
                  </span>
                </div>
                {user?.isAdmin ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      User Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    My Account
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors mt-1"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          <div
            className="relative"
            onMouseEnter={() => setIsWishlistOpen(true)}
            onMouseLeave={() => setIsWishlistOpen(false)}
          >
            <Link
              href="/wishlist"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {isWishlistOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Wishlist ({mounted ? wishlistItems.length : 0})
                    </span>
                  </div>
                  {wishlistItems.length === 0 ? (
                    <p className="text-center text-slate-400 py-6 text-sm">
                      No favorites yet
                    </p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 items-center group"
                        >
                          <div className="relative w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(toggleWishlist(item))}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex min-[830px]:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300"
          >
            <ShoppingCart className="w-4 h-4" />
            {mounted && totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-100 min-[830px]:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] sm:w-[350px] bg-white dark:bg-slate-900 z-101 flex flex-col min-[830px]:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src={navbarData.assets.logo.src}
                    alt={navbarData.assets.logo.alt}
                    width={navbarData.assets.logo.width}
                    height={navbarData.assets.logo.height}
                    className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                <ul className="space-y-1">
                  {navbarData.navigation.map(
                    (
                      item: (typeof navbarData.navigation)[0],
                      index: number,
                    ) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 px-4 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>

              <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-6 bg-slate-50/50 dark:bg-slate-800/50">
                {mounted && isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-4 py-4 bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[24px] shadow-sm">
                      <Link
                        href={user?.isAdmin ? "/admin/dashboard" : "/account"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-1 items-center gap-4 min-w-0"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-[12px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                            {user?.isAdmin ? "Admin Panel" : "Customer Panel"}
                          </p>
                        </div>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-red-200 dark:hover:border-red-900/30 transition-all relative"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        Wishlist
                        {wishlistItems.length > 0 && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 py-4 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-700 hover:shadow-blue-500/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
