"use client";

import React from "react";
import db from "@data/db.json";
import { motion } from "framer-motion";

function PackagingHero() {
  const packagingHeroData = db.packaging;
  const { header, video } = packagingHeroData;
  const fadeUpVariant: any = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: delay,
      },
    }),
  };

  return (
    <section className="relative bg-white dark:bg-slate-950 min-h-screen font-sans">
      <div
        className="pt-16 pb-48 lg:pb-64 px-6 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url(${header.backgroundImage})`,
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="lg:w-1/2">
              <motion.span
                custom={0}
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="inline-block text-s font-medium text-white uppercase mb-4"
              >
                {header.label}
              </motion.span>

              <motion.h1
                custom={0.2}
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight"
              >
                {header.title.main}
                <br />
                <span className="text-rose-400 underline decoration-2 underline-offset-8">
                  {header.title.highlight}
                </span>
              </motion.h1>
            </div>

            <div className="lg:w-1/3 lg:pt-12">
              <motion.p
                custom={0.4}
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="text-white/90 text-sm md:text-[17px] leading-relaxed mb-6 max-w-sm lg:ml-auto"
              >
                {header.description}
              </motion.p>

              <motion.button
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
                  {header.buttonText}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="relative px-6 -mt-32 lg:-mt-48 max-w-7xl mx-auto z-10"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
          <div className="relative w-full aspect-video lg:aspect-21/9">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster={video.poster}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </motion.div>
      <div className="h-32 lg:h-48" />
    </section>
  );
}

export default PackagingHero;
