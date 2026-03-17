"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Store,
  MapPin,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Heart,
  Share2,
} from "lucide-react";
import SearchBar from "@/components/layout/SearchBar";
import ProductReviews from "@/components/products/ProductReviews";


// Dummy data for this single product experience
const dummyProduct = {
  _id: "1",
  title:
    "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Premium Silver Edition",
  price: 299.0,
  originalPrice: 399.0,
  rating: 4.8,
  reviewsCount: 1245,
  soldCount: 3500,
  images: [
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop", // Main
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop", // Variation 1
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop", // Variation 2
  ],
  store: {
    name: "TechHaven Official",
    slug: "techhaven",
    rating: "98% Positive Feedback",
  },
  options: {
    color: ["Silver", "Matte Black", "Midnight Blue"],
  },
  specs: [
    { label: "Brand", value: "Sony" },
    { label: "SKU", value: "SNY-WH1000XM5-SLV" },
    { label: "Connection", value: "Wireless Bluetooth 5.2" },
    { label: "Battery Life", value: "Up to 30 hours" },
    { label: "Warranty", value: "1 Year Local Manufacturer Warranty" },
  ],
  description:
    "The WH-1000XM5 headphones rewrite the rules for distraction-free listening. 2 processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.",
};

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    dummyProduct.options.color[0],
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: dummyProduct._id,
        storeId: "s3",
        title: `${dummyProduct.title} (${selectedColor})`,
        price: dummyProduct.price,
        quantity,
        image: dummyProduct.images[0],
      }),
    );
    alert("Added to cart successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* 1. Reusable Top Bar & Header */}
      <div className="bg-gray-100 text-[11px] text-gray-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-orange-500 hover:underline">
              SAVE MORE ON APP
            </Link>
            <Link
              href="/seller/dashboard"
              className="text-orange-500 font-bold hover:underline"
            >
              SELL ON LINKSTORE
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hover:text-orange-500 hover:underline"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="hover:text-orange-500 hover:underline"
            >
              SIGNUP
            </Link>
          </div>
        </div>
      </div>

      <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center gap-6 lg:gap-12">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">
              LinkStore
            </span>
          </Link>
          <SearchBar />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-20">
        <div className="mb-4 text-xs text-gray-500">
          <Link href="/" className="hover:underline hover:text-orange-500">
            Home
          </Link>{" "}
          &gt;
          <span className="mx-1">Audio</span> &gt;
          <span className="text-gray-900 truncate mx-1">
            {dummyProduct.title}
          </span>
        </div>

        {/* Product Inner Core Layout */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-100 mb-6 flex flex-col lg:flex-row gap-8">
          {/* Left: Gallery */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-3 cursor-crosshair">
              <Image
                src={dummyProduct.images[activeImage]}
                alt="Product Image"
                fill
                className="object-cover hover:scale-150 transition-transform duration-500 origin-center"
              />
            </div>
            {/* Thumbnail row */}
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
              {dummyProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveImage(idx)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 ${activeImage === idx ? "border-orange-500" : "border-transparent"}`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Main Product Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-medium text-gray-900 leading-tight mb-2">
              {dummyProduct.title}
            </h1>

            {/* Ratings & Sold Data */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" />
                <Star className="w-4 h-4 fill-yellow-500" opacity={0.5} />
                <span className="text-cyan-600 ml-2 hover:underline cursor-pointer">
                  {dummyProduct.reviewsCount} Ratings
                </span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-500">
                <span className="text-gray-900">{dummyProduct.soldCount}</span>{" "}
                Sold
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-gray-50/80 p-4 rounded-lg border border-orange-100 mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-black text-orange-500 tracking-tighter">
                  ${dummyProduct.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through mb-1">
                  ${dummyProduct.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-orange-900 bg-orange-200 px-1.5 py-0.5 rounded-sm mb-1.5 ml-1">
                  -25%
                </span>
              </div>
            </div>

            {/* Variations */}
            <div className="mb-6">
              <span className="text-sm text-gray-500 font-medium w-16 inline-block">
                Color_Family
              </span>
              <span className="text-sm font-bold text-gray-900 ml-2">
                {selectedColor}
              </span>
              <div className="flex flex-wrap gap-3 mt-3 ml-18">
                {dummyProduct.options.color.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-sm border ${selectedColor === c ? "border-orange-500 text-orange-500 bg-orange-50" : "border-gray-200 text-gray-700 hover:border-orange-300"} rounded-sm transition-colors`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-500 font-medium w-16">
                Quantity
              </span>
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 h-8 text-center border-x border-gray-300 text-sm outline-hidden font-medium"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 max-w-[200px] bg-orange-100 text-orange-600 hover:bg-orange-200 py-3.5 rounded-sm font-bold transition-colors">
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 max-w-[200px] bg-orange-500 text-white py-3.5 hover:bg-orange-600 rounded-sm font-bold transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Right: Delivery & Store Info */}
          <div className="w-full lg:w-[280px] shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100 self-start">
            <div className="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-4 mb-4">
              <h4 className="font-semibold text-gray-900 text-xs uppercase">
                Delivery
              </h4>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-gray-400" />
                <div>
                  <p>Standard Delivery, 3-5 Days</p>
                  <p className="font-bold text-gray-900 mt-1">$2.50</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="w-5 h-5 shrink-0 text-gray-400" />
                <p>Cash on Delivery Available</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-4 mb-4">
              <h4 className="font-semibold text-gray-900 text-xs uppercase">
                Return & Warranty
              </h4>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 text-gray-400" />
                <p>14 days free return</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-xs uppercase mb-3 border-b border-gray-200 pb-2">
                Sold By
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-5 h-5 text-indigo-600" />
                <Link
                  href={`/shop/${dummyProduct.store.slug}`}
                  className="font-bold text-gray-900 hover:text-orange-500 hover:underline"
                >
                  {dummyProduct.store.name}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center mt-4">
                <div className="bg-white border border-gray-200 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 mb-1">
                    Positive Rating
                  </p>
                  <p className="font-bold text-base text-gray-900">92%</p>
                </div>
                <div className="bg-white border border-gray-200 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 mb-1">Ship on Time</p>
                  <p className="font-bold text-base text-gray-900">99%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4 bg-gray-50 -mx-6 px-6 pt-2">
            Product Details
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {dummyProduct.description}
          </p>

          <h4 className="font-semibold text-gray-800 text-sm mb-3 border-b border-gray-100 pb-2 bg-gray-50 p-2 rounded-t-md">
            Specifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm pt-2">
            {dummyProduct.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex border-b border-gray-50 pb-2"
              >
                <span className="w-1/3 text-gray-500">{spec.label}</span>
                <span className="w-2/3 font-medium text-gray-900">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={id as string} />
      </main>
    </div>
  );
}

