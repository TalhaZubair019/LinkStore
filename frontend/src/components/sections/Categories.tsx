"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface CategoriesData {
  sectionLabel: string;
  headingMain: string;
  headingHighlight: string;
  description: string;
  btnText: string;
  btnLink: string;
  categories: Category[];
}

function Categories() {
  const router = useRouter();
  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/public/content?section=categories");
        const data = await response.json();
        setCategoriesData(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-white overflow-hidden min-h-[800px]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (!categoriesData || !Array.isArray(categoriesData.categories)) {
    return null;
  }
  return (
    <section
      id="services"
      className="py-16 sm:py-20 lg:py-28 scroll-mt-24 bg-white dark:bg-slate-950 px-4 sm:px-8 lg:px-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-medium text-blue-900 dark:text-blue-400 uppercase tracking-widest mb-4"
            >
              {categoriesData.sectionLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black dark:text-white leading-tight"
            >
              {categoriesData.headingMain} <br />
              <span className="relative inline-block text-[#FF7F7F] pb-2">
                {categoriesData.headingHighlight}
                <span className="absolute left-0 bottom-0 w-full h-1.5 bg-[#FF7F7F] rounded-full"></span>
              </span>
            </motion.h2>
          </div>
          <div className="max-w-md flex flex-col items-start gap-6">
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-black dark:text-slate-300 text-base sm:text-lg lg:text-xl font-light"
            >
              {categoriesData.description}
            </motion.p>
            <motion.button
              onClick={() => router.push(categoriesData.btnLink)}
              className="relative group cursor-pointer outline-none border-none bg-transparent p-0"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent translate-x-1.5 translate-y-1.5 transition-transform duration-200 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 [background:linear-gradient(white,white)_padding-box,linear-gradient(to_right,#7f22fe,#26C6DA)_border-box] mask[linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] mask-exclude"
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
                {categoriesData.btnText}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoriesData.categories.map(
            (category: Category, index: number) => (
              <Link
                key={category.id}
                href={`/category/${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center"
              >
                <div className="relative w-full h-100 group-hover:h-110 rounded-4xl overflow-hidden shadow-sm transition-all duration-500 ease-in-out group-hover:shadow-2xl group-hover:shadow-blue-900/20 bg-white dark:bg-slate-950">
                  <BlindsImage
                    src={category.image}
                    alt={category.title}
                    delay={index * 0.15}
                    className="w-full h-full"
                    imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                  />

                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                </div>
                <div className="relative z-10 w-full flex justify-center mt-6 transition-all duration-500 ease-out group-hover:-translate-y-24">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-8 py-3 w-[80%] text-center rounded-full group-hover:scale-105 transition-all duration-300 hover:bg-linear-to-r from-blue-500 to-cyan-400 text-slate-800 dark:text-slate-200 hover:text-white">
                    <span className="text-lg font-bold px-4 py-2">
                      {category.title}
                    </span>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default Categories;
