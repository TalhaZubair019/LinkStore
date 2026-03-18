import MarketplaceHero from "@/components/sections/MarketplaceHero";
import CategoriesSection from "@/components/sections/CategoriesSection";
import JustForYou from "@/components/sections/JustForYou";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section with Slider */}
      <MarketplaceHero />

      {/* Database-driven Categories Grid */}
      <CategoriesSection />

      {/* High-density "Just For You" Product Feed */}
      <JustForYou />
    </main>
  );
}
