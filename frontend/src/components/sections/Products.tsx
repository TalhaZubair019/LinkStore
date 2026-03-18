"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import db from "@data/db.json";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import { motion } from "framer-motion";
import Toast from "@/components/products/Toast";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import CompareDrawer from "@/components/products/CompareDrawer";

const BlindsImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
}) => {
  const bars = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className={`relative overflow-hidden h-full w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className={imgClassName}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 flex flex-col z-20 pointer-events-none">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 w-full bg-slate-200 dark:bg-slate-800 border-b border-white/50 dark:border-slate-700/50"
            initial={{ opacity: 1, scaleY: 1 }}
            whileInView={{ opacity: 0, scaleY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.1,
              delay: delay + i * 0.1,
              ease: "linear",
            }}
            style={{ originY: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

function FeaturedProducts() {
  const router = useRouter();
  const productsData = db.products;
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
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

  // 👇 Updated fetch logic to only show products with a valid SKU 👇
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        if (response.ok) {
          const data = await response.json();
          const productsWithSku = (data.products || [])
            .filter((p: any) => p.sku && p.sku.trim() !== "")
            .sort((a: any, b: any) => a.id - b.id);

          setDynamicProducts(productsWithSku.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
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

  const addToCompare = (product: any) => {
    if (compareItems.find((item) => item.id === product.id)) {
      setIsCompareOpen(true);
      return;
    }
    if (compareItems.length >= 3) {
      showToast("You can only compare 3 items", "remove");
      setIsCompareOpen(true);
      return;
    }
    setCompareItems([...compareItems, product]);
    setIsCompareOpen(true);
  };

  const removeFromCompare = (id: number) => {
    const newItems = compareItems.filter((item) => item.id !== id);
    setCompareItems(newItems);
    if (newItems.length === 0) setIsCompareOpen(false);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress =
        maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;
    if (container) {
      const card = container.querySelector(".snap-center");
      const cardWidth = card ? card.clientWidth : 320;
      const gap = 24;
      const amount = cardWidth + gap;

      container.scrollBy({
        left: direction === "next" ? amount : -amount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section
      id="products"
      className="scroll-mt-24 py-16 sm:py-20 mx-4 sm:mx-8 lg:mx-20 lg:py-28 bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col min-[500px]:flex-row justify-between items-center min-[500px]:items-end mb-12 gap-8 text-center min-[500px]:text-left">
          <div className="flex flex-col items-center min-[500px]:items-start">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-base text-blue-800 dark:text-blue-400 uppercase mb-3"
            >
              {productsData.sectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-medium text-slate-900 dark:text-white leading-tight"
            >
              {productsData.headingMain} <br />
              <span className="text-[#FF7F7F] border-b-4 border-[#FF7F7F] pb-1">
                {productsData.headingHighlight}
              </span>
            </motion.h2>
          </div>
          <div className="max-w-md flex flex-col items-center min-[500px]:items-start gap-6">
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-black dark:text-slate-300 font-light"
            >
              {productsData.description}
            </motion.p>

            <motion.button
              onClick={() => router.push(productsData.headerBtnLink)}
              className="relative group cursor-pointer outline-none border-none bg-transparent p-0"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent translate-x-1.5 translate-y-1.5 transition-transform duration-200 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 [background:linear-gradient(white,white)_padding-box,linear-gradient(to_right,#7f22fe,#26C6DA)_border-box] dark:[background:linear-gradient(#020617,#020617)_padding-box,linear-gradient(to_right,#7f22fe,#26C6DA)_border-box] mask[linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] mask-exclude"
                style={{
                  background:
                    "linear-gradient(to right, #7f22fe, #26C6DA) border-box",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                }}
                aria-hidden="true"
              />
              <span className="relative block px-10 py-4 rounded-full bg-linear-to-r from-[#7f22fe] to-[#26C6DA] text-lg font-bold text-white transition-transform duration-200 ease-in-out group-active:scale-95">
                {productsData.headerBtnText}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col min-[500px]:flex-row gap-8 items-center min-[500px]:items-start relative z-10">
          <div className="w-[236px] min-[500px]:w-[320px] lg:w-[400px] h-[340px] min-[500px]:h-[400px] lg:h-[600px] relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl group shrink-0 z-0 mx-auto min-[500px]:mx-0 transition-all duration-300">
            <BlindsImage
              src={productsData.featuredImage}
              alt="Featured"
              delay={0}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>

          <div className="w-full min-[500px]:flex-1 flex flex-col justify-between h-full min-h-[450px] sm:min-h-[550px] relative z-20 min-[500px]:w-0">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x pt-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading ? (
                <div className="flex gap-6 w-full items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    Loading products...
                  </p>
                </div>
              ) : (
                dynamicProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistItems.some(
                      (item) => item.id === product.id,
                    )}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={(p: any) => {
                      setQuickViewProduct(p);
                      document.body.style.overflow = "hidden";
                    }}
                    onCompare={addToCompare}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-center min-[500px]:justify-start gap-4 mt-2 relative z-50">
              <div className="flex gap-2 shrink-0 relative z-50">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll("prev");
                  }}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all bg-white dark:bg-slate-900 shadow-sm group cursor-pointer active:scale-90 touch-manipulation relative z-50"
                  aria-label="Previous products"
                >
                  <ChevronsLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform pointer-events-none" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll("next");
                  }}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all bg-white dark:bg-slate-900 shadow-sm group cursor-pointer active:scale-90 touch-manipulation relative z-50"
                  aria-label="Next products"
                >
                  <ChevronsRight className="w-5 h-5 group-hover:translate-x-1 transition-transform pointer-events-none" />
                </button>
              </div>

              <div className="grow h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                  style={{ width: `${Math.max(10, scrollProgress)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => {
          setQuickViewProduct(null);
          document.body.style.overflow = "auto";
        }}
        onAddToCart={handleAddToCart}
      />

      <CompareDrawer
        isOpen={isCompareOpen}
        compareItems={compareItems}
        allProducts={dynamicProducts}
        onClose={() => {
          setIsCompareOpen(false);
          document.body.style.overflow = "auto";
        }}
        onRemoveItem={removeFromCompare}
        onAddItem={addToCompare}
        onAddToCart={handleAddToCart}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}

export default FeaturedProducts;
