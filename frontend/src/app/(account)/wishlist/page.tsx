"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist, WishlistItem } from "@/redux/slices/wishlistSlice";
import { ShoppingCart, Trash2 } from "lucide-react";
import Toast from "@/components/(store)/products/Toast";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";
const pageConfig = {
  breadcrumbs: {
    home: "Home",
    current: "Wishlist",
  },
  columns: {
    product: "Product Name",
    price: "Unit Price",
    status: "Stock Status",
    action: "Action",
  },
  emptyState: {
    message: "Your wishlist is currently empty.",
    buttonText: "Return to Shop",
    redirectUrl: "/shop",
  },
};

export default function WishlistPage() {
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <Loading />
      </div>
    );
  }

  const groupedWishlistItems = wishlistItems.reduce(
    (acc: any, item: WishlistItem) => {
      const product = products.find((p) => String(p.id) === String(item.id));
      const storeName = product?.vendorStoreName || "Verified Store";
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title={pageConfig.breadcrumbs.current}
        breadcrumb={pageConfig.breadcrumbs.current}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-16 px-4 lg:px-8 pb-32">
          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-1 gap-16 items-start">
              <div className="w-full">
                <div className="hidden md:flex justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 transition-colors">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-1/2">
                    {pageConfig.columns.product}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-1/6">
                    {pageConfig.columns.price}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-1/6">
                    {pageConfig.columns.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-1/6 text-right">
                    {pageConfig.columns.action}
                  </span>
                </div>
                <div>
                  {Object.entries(groupedWishlistItems).map(
                    ([storeName, items]: [string, any]) => (
                      <div key={storeName} className="mb-12 last:mb-0">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <span className="text-pink-600 dark:text-pink-400 font-black text-xs">
                              {storeName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            Favorited from{" "}
                            <span className="text-pink-600 dark:text-pink-400">
                              {storeName}
                            </span>
                          </h3>
                        </div>
                        <div className="space-y-12">
                          {items.map((item: WishlistItem) => {
                            const productData = products.find(
                              (p) => p.id === item.id,
                            );
                            return (
                              <WishlistItemComponent
                                key={item.id}
                                item={item}
                                productData={productData}
                                stockQuantity={productData?.stockQuantity}
                                onToast={showToast}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="text-center py-32 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
      <h2 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-6 transition-colors">
        {pageConfig.emptyState.message}
      </h2>
      <Link
        href={pageConfig.emptyState.redirectUrl}
        className="px-10 py-4 bg-blue-600 dark:bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
      >
        {pageConfig.emptyState.buttonText}
      </Link>
    </div>
  );
}

function AddToCartButton({
  onAdd,
  disabled,
}: {
  onAdd: () => void;
  disabled?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const handleClick = () => {
    if (disabled || adding) return;
    setAdding(true);
    onAdd();
    setTimeout(() => setAdding(false), 700);
  };
  return (
    <button
      onClick={handleClick}
      disabled={adding || disabled}
      className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-full shadow-md transition-all ${
        disabled
          ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
          : "bg-linear-to-r from-blue-500 to-cyan-400 hover:shadow-lg hover:scale-105"
      } disabled:opacity-80`}
    >
      {adding ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <ShoppingCart size={16} />
      )}
      <span className="hidden lg:inline">
        {disabled ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
      </span>
    </button>
  );
}

function WishlistItemComponent({
  item,
  productData,
  stockQuantity,
  onToast,
}: {
  item: WishlistItem;
  productData?: any;
  stockQuantity?: number;
  onToast: (msg: string, type: "add" | "remove") => void;
}) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const priceVal =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
        : item.price;

    dispatch(
      addToCart({
        id: item.id,
        name: item.title,
        price: priceVal,
        image: item.image,
        quantity: 1,
      }),
    );
    onToast(`Added "${item.title}" to cart successfully!`, "add");
  };

  const handleRemove = () => {
    dispatch(toggleWishlist(item));
    onToast(`Removed "${item.title}" from wishlist.`, "remove");
  };

  return (
    <div className="group">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-6 w-full md:w-1/2">
          <div className="relative w-24 h-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-sm transition-colors">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={`object-contain p-2 ${stockQuantity === 0 ? "grayscale opacity-60" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                No Img
              </div>
            )}
            {stockQuantity === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="bg-red-500/90 text-[8px] text-white font-bold px-1 py-0.5 rounded rotate-12">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 transition-colors">
              {productData?.category}
            </h3>
            <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors">
              {item.title}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/6 flex justify-between md:block">
          <span className="md:hidden text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Price:{" "}
          </span>
          <span className="text-slate-900 dark:text-white font-bold text-lg transition-colors">
            {typeof item.price === "number"
              ? `$${item.price.toFixed(2)}`
              : item.price.startsWith("$")
                ? item.price
                : `$${item.price}`}
          </span>
        </div>
        <div className="w-full md:w-1/6 flex justify-between md:block">
          <span className="md:hidden text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Status:{" "}
          </span>
          {stockQuantity === 0 ? (
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full uppercase tracking-wider transition-colors">
              Out Of Stock
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider transition-colors">
              In Stock
            </span>
          )}
        </div>
        <div className="w-full md:w-1/6 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
          <AddToCartButton
            onAdd={handleAddToCart}
            disabled={stockQuantity === 0}
          />

          <button
            onClick={handleRemove}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
            title="Remove from wishlist"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mt-8 transition-colors"></div>
    </div>
  );
}
