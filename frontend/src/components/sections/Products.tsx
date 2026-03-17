"use client";
import { useState, useEffect } from "react";
import db from "@data/db.json";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/products/Toast";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";

function FeaturedProducts() {
  const productsData = db.products;
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);
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
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        if (response.ok) {
          const data = await response.json();
          const productsWithSku = (data.products || [])
            .filter((p: any) => p.sku && p.sku.trim() !== "")
            .sort((a: any, b: any) => a.id - b.id);

          setDynamicProducts(productsWithSku);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: any, qty: number = 1) => {
    const priceNumber = parseFloat(
      product.price.toString().replace(/[^0-9.]/g, ""),
    );
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceNumber,
        image: product.image,
        quantity: qty,
      }),
    );
    showToast(`Added ${qty} ${product.title} to cart!`, "add");
  };

  const handleToggleWishlist = (id: number, title: string) => {
    const product = dynamicProducts.find((p: any) => p.id === id);
    if (product) {
      const wasInWishlist = wishlistItems.some((item) => item.id === id);
      dispatch(
        toggleWishlist({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        }),
      );
      if (wasInWishlist) {
        showToast(`${title} removed from wishlist`, "remove");
      } else {
        showToast(`${title} added to wishlist!`, "add");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex gap-6 w-full items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-darazOrange border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 dark:text-slate-500 font-medium">Looking for best deals...</p>
      </div>
    );
  }

  return (
    <div id="products" className="py-2 transition-colors duration-300">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {dynamicProducts.map((product: any) => (
          <div key={product.id} className="h-full">
            <ProductCard
              product={product}
              isWishlisted={wishlistItems.some((item) => item.id === product.id)}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={(p: any) => setQuickViewProduct(p)}
              onCompare={() => {}}
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default FeaturedProducts;
