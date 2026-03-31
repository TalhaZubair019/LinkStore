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
  Search,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import db from "@data/db.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import { toggleWishlist, clearWishlist } from "@/redux/slices/wishlistSlice";
import { logout } from "@/redux/slices/authSlice";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/user") ||
    pathname === "/apply-vendor"
  ) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
          scrolled
            ? "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-md py-2 sm:py-3"
            : "bg-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 pt-4 sm:pt-6 pb-3 flex items-center justify-between gap-4 lg:gap-8 relative w-full">
          <Link href="/" className="shrink-0 relative z-10">
            <Image
              src={navbarData.assets.logo.src}
              alt={navbarData.assets.logo.alt}
              width={navbarData.assets.logo.width}
              height={navbarData.assets.logo.height}
              className="h-8 sm:h-10 w-auto object-contain transition-all brightness-0 dark:invert"
              priority
            />
          </Link>

          <div className="hidden min-[830px]:flex flex-1 items-center gap-6 lg:gap-12 px-4 justify-between">
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-md relative group"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder={
                  navbarData.search?.placeholder || "Search products..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all dark:text-white"
              />
            </form>

            <nav>
              <ul className="flex flex-wrap items-center justify-center gap-2 min-[830px]:gap-3 lg:gap-8 xl:gap-10">
                {navbarData.navigation.map(
                  (item: (typeof navbarData.navigation)[0], index: number) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`text-[15px] lg:text-[16px] xl:text-[18px] font-bold transition-colors duration-200 whitespace-nowrap ${
                          pathname === item.href
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-[#333333] dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
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
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {mounted && totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
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
                        className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-lg shadow-purple-500/10"
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
                  href={user?.isAdmin ? "/admin/dashboard" : "/user"}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
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
                        href="/user"
                        className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      >
                        User Dashboard
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/user"
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
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm"
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
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                    {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
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
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 focus:outline-none"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <Link
              href="/cart"
              className="relative w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[8px] font-bold min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
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
      </header>

      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-110 bg-white dark:bg-slate-950 h-[80px] flex items-center shadow-xl border-b border-slate-200 dark:border-slate-800"
          >
            <div className="container mx-auto px-6 flex items-center gap-4">
              <form
                onSubmit={handleSearch}
                className="flex-1 relative flex items-center"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600">
                  <Search size={20} />
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-purple-500/20 focus:border-purple-500 rounded-2xl text-[16px] font-bold outline-none transition-all dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-200 min-[830px]:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] sm:w-[350px] bg-white dark:bg-slate-900 z-201 flex flex-col min-[830px]:hidden shadow-2xl overflow-hidden border-l border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-6 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800">
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

              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all dark:text-white"
                  />
                </form>
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
                          className={`block py-3 px-4 text-base font-semibold rounded-xl transition-all ${
                            pathname === item.href
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                              : "text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          }`}
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
                        href={user?.isAdmin ? "/admin/dashboard" : "/user"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-1 items-center gap-4 min-w-0"
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 overflow-hidden border-2 border-white dark:border-slate-800">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-[12px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
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
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                            {wishlistItems.length > 99
                              ? "99+"
                              : wishlistItems.length}
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
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-purple-700 hover:shadow-purple-500/20 transition-all"
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
    </>
  );
}

export default Navbar;
