import MarketplaceHero from "@/components/sections/MarketplaceHero";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ShopByStores from "@/components/sections/ShopByStores";
import JustForYou from "@/components/sections/JustForYou";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300">
      <MarketplaceHero />
      <CategoriesSection />
      <ShopByStores />
      <JustForYou />
    </main>
  );
}
