import HeroCarousel from "@/components/sections/HeroCarousel";
import FeatureBar from "@/components/sections/FeatureBar";
import FlashSale from "@/components/sections/FlashSale";
import CategoryGrid from "@/components/sections/CategoryGrid";
import Products from "@/components/sections/Products";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] dark:bg-slate-950 transition-colors duration-300 pb-12">
      {/* 1. Hero Section (Carousel + Categories) */}
      <HeroCarousel />

      {/* 2. Feature/Trust Bar */}
      <FeatureBar />

      {/* 3. Flash Sale Section */}
      <FlashSale />

      {/* 4. Categories Grid */}
      <CategoryGrid />

      {/* 5. "Just For You" Section (Dense Product Grid) */}
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-[#424242] dark:text-slate-200 font-bold text-lg mb-4">Just For You</h2>
        {/* We reuse the Products component but we'll ensure it supports the dense grid layout */}
        <Products />
      </div>
    </main>
  );
}
