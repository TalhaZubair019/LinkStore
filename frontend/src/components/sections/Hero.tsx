"use client";

import Image from "next/image";
import db from "@data/db.json";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();
  const heroData = db.hero;
  const { assets, content } = heroData;

  const slideLeft: any = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] },
    },
  };

  const slideRight: any = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] },
    },
  };

  const letterContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
      },
    },
  };

  const individualLetter: any = {
    hidden: (i: number) => ({
      opacity: 0,
      x: i % 2 === 0 ? -60 : 60,
      y: 10,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 150 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col justify-between font-sans px-4 sm:px-8 lg:px-16">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src={assets.background}
          alt="Hero Background"
          fill
          className="object-bottom"
          priority
          quality={90}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-24 lg:h-56 bg-white dark:bg-slate-950 z-10"
        style={{ clipPath: "ellipse(55% 90% at 50% 100%)" }}
      ></div>

      <div className="container mx-auto px-4 pt-25 sm:pt-35 lg:pt-45 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <motion.div
            className="hidden lg:flex lg:col-span-3 flex-col items-center lg:items-start space-y-4 order-2 lg:order-1 lg:mt-58"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideLeft}
          >
            <div className="flex -space-x-4">
              {assets.avatars.map((url, index) => (
                <div
                  key={index}
                  className="relative w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden shadow-sm bg-slate-300 dark:bg-slate-700"
                >
                  <Image
                    src={url}
                    alt={`User ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ))}
            </div>
            <div className="text-center lg:text-left text-black dark:text-white">
              <h3 className="text-4xl font-extrabold tracking-tight">
                {content.statsLeft.count}
              </h3>
              <p className="text-[15px] font-normal opacity-80 leading-tight">
                {content.statsLeft.label}
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-6 flex flex-col items-center text-center text-black dark:text-white space-y-8 order-1 lg:order-2">
            <div className="relative w-fit mx-auto">
              {assets.floating.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`hidden lg:block absolute z-10 ${
                    item.name === "cap"
                      ? "-left-73 w-20 h-20"
                      : item.name === "prism"
                        ? "-right-73 w-18 h-18"
                        : "-left-73 top-125 w-13 h-13"
                  }`}
                  animate={{ y: [0, idx % 2 === 0 ? -15 : 15, 0] }}
                  transition={{
                    duration: 4 + idx,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ))}

              <motion.h1
                className="text-[28px] md:text-[34px] lg:text-[52px] font-bold tracking-tight leading-[1.1] drop-shadow-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={letterContainer}
              >
                <span className="block">
                  {content.heroText.titlePart1
                    .split("")
                    .map((char: string, i: number) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={individualLetter}
                        className="inline-block"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                </span>
                <span className="block">
                  {content.heroText.titlePart2
                    .split("")
                    .map((char: string, i: number) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={individualLetter}
                        className="inline-block"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  <span className="relative inline-block underline decoration-4 decoration-[#FF6B6B] underline-offset-4 ml-3 text-[#f86464]">
                    {content.heroText.highlight
                      .split("")
                      .map((char: string, i: number) => (
                        <motion.span
                          key={i}
                          custom={i + 20}
                          variants={individualLetter}
                          className="inline-block"
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                  </span>
                </span>
              </motion.h1>
            </div>

            <motion.p
              className="text-[14px] md:text-[16px] font-normal text-slate-900 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {content.heroText.descriptionPart1}
              <br className="hidden md:block" />
              {content.heroText.descriptionPart2}
            </motion.p>

            <motion.button
              className="relative group cursor-pointer"
              onClick={() => router.push(content.heroText.headerBtnLink)}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
                style={{
                  background:
                    "linear-gradient(to right, #7f22fe, #26C6DA) border-box",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                }}
              />
              <span className="relative block px-10 py-4 rounded-full bg-linear-to-r from-[#7f22fe] to-[#26C6DA] text-lg font-bold text-white transition-transform group-active:scale-95">
                {content.heroText.buttonLabel}
              </span>
            </motion.button>
          </div>

          <motion.div
            className="hidden lg:flex lg:col-span-3 justify-center order-3 lg:mt-60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideRight}
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-3xl p-8 w-full max-w-50 shadow-2xl">
              <div className="space-y-4">
                {content.statsRight.map(
                  (stat: { value: string; label: string }, index: number) => (
                    <div key={index}>
                      <h3 className="text-4xl font-bold tracking-tight">
                        {stat.value}
                      </h3>
                      <p className="text-sm font-medium text-blue-50 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="hidden sm:block relative w-full max-w-4xl mx-auto h-120 mt-4 z-30 pointer-events-none">
        <motion.div
          className="absolute top-16 right-[9%] w-[40%] z-10"
          initial={{ opacity: 0, x: -100, rotate: 4 }}
          whileInView={{ opacity: 1, x: 0, rotate: 4 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <img
            src={assets.products.right}
            alt="Product Right"
            className="w-full"
          />
        </motion.div>
        <motion.div
          className="absolute top-34 left-[11%] w-[40%] z-10"
          initial={{ opacity: 0, x: 100, rotate: 1 }}
          whileInView={{ opacity: 1, x: 0, rotate: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <img
            src={assets.products.left}
            alt="Product Left"
            className="w-full"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] z-20"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <img
            src={assets.products.center}
            alt="Product Center"
            className="w-full"
          />
        </motion.div>
      </div>
      <motion.div
        className="sm:hidden w-full max-w-[280px] mx-auto mt-6 mb-4 pointer-events-none"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      >
        <img
          src={assets.products.center}
          alt="Featured Product"
          className="w-full drop-shadow-2xl"
        />
      </motion.div>

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-3 lg:right-[10%] z-40 hidden md:flex items-center justify-center w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-[#ff6b6b] border-10 border-white dark:border-slate-800 hover:scale-110 transition-transform cursor-pointer">
        <ChevronDown
          className="absolute text-white w-8 h-8 z-10"
          strokeWidth={3}
        />
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]"
          viewBox="0 0 100 100"
        >
          <path
            id="textCircle"
            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
          <text className="text-[10px] uppercase fill-white tracking-[0.15em]">
            <textPath href="#textCircle">
              scroll down / scroll down / scroll down /
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
