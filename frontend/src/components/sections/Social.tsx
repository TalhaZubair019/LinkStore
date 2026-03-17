"use client";

import Image from "next/image";
import db from "@data/db.json";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function Social() {
  const socialData = db.social;
  const { title, logos } = socialData;

  return (
    <section className="py-16 bg-white dark:bg-slate-950 w-full flex justify-center">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
        </div>

        <div className="relative flex items-center justify-center mb-10 w-full max-w-4xl mx-auto">
          <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="shrink-0 mx-4 text-slate-300 dark:text-slate-700">
            <Sparkles size={20} strokeWidth={2.5} fill="currentColor" />
          </span>
          <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <div className="flex flex-wrap   gap-8 md:gap-12 lg:gap-16">
          {logos.map((brand: { name: string; url: string }, index: number) => (
            <motion.div
              key={index}
              className="relative w-36 h-10 md:w-44 md:h-14 cursor-pointer"
              initial={{ opacity: 1, rotate: 0 }}
              whileHover={{
                opacity: [0, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                opacity: { duration: 1.5, ease: "easeOut" },
                rotate: { delay: 0.2, duration: 0.7, ease: "easeInOut" },
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={brand.url}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain dark:brightness-0 dark:invert transition-all duration-300"
                  sizes="(max-width: 768px) 144px, 176px"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Social;
