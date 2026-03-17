import Hero from "@/components/sections/Hero";
import Social from "@/components/sections/Social";
import About from "@/components/sections/About";
import Categories from "@/components/sections/Categories";
import Products from "@/components/sections/Products";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyUs from "@/components/sections/WhyUs";
import Packaging from "@/components/sections/Packaging";
import Price from "@/components/sections/Price";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300">
      <Hero />
      <Social />
      <About />
      <Categories />
      <HowItWorks />
      <Products />
      <WhyUs />
      <Packaging />
      <Price />
      <Testimonials />
      <Blog />
    </main>
  );
}
