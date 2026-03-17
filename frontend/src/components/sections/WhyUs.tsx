"use client";

import React from "react";
import db from "@data/db.json";
import { Printer, Settings2, Headset, PenTool, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHYUS_COLORS = [
  { iconBg: "#c084fc", accentBg: "#e9d5ff" },
  { iconBg: "#2dd4bf", accentBg: "#99f6e4" },
  { iconBg: "#f472b6", accentBg: "#fbcfe8" },
  { iconBg: "#fbbf24", accentBg: "#fde68a" },
];

function WhyChooseUs() {
  const whyChooseUsData = db.whyus;
  const { header, features } = whyChooseUsData;

  return (
    <section
      id="services"
      className="scroll-mt-24 py-20 px-4 bg-[#f8fbff] dark:bg-slate-950 font-sans"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base text-blue-800 dark:text-blue-400 uppercase mb-3"
          >
            {header.label}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl lg:text-5xl font-medium text-slate-900 dark:text-white leading-tight"
          >
            {header.titleMain} <br />
            <span className="text-[#FF7F7F] border-b-4 border-[#FF7F7F] pb-1">
              {header.titleHighlight}
            </span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: any, index: number) => (
            <div key={index} className="relative pt-4">
              <FeatureCard item={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const iconMap: Record<string, any> = {
  Printer,
  Settings2,
  Headset,
  PenTool,
};

function resolveIcon(icon: any) {
  if (!icon) return HelpCircle;
  if (typeof icon === "string") {
    return (iconMap as any)[icon] ?? HelpCircle;
  }
  return icon;
}

const FeatureCard = ({ item, index }: { item: any; index?: number }) => {
  const Icon = resolveIcon(item.icon);
  const colors = WHYUS_COLORS[index ?? 0] ?? WHYUS_COLORS[0];
  const iconVariants: any = {
    initial: { opacity: 1, rotate: 0 },
    hover: {
      opacity: [0, 1],
      rotate: [0, -10, 10, 0],
      transition: {
        opacity: {
          duration: 1.5,
          ease: "easeOut",
        },
        rotate: {
          delay: 0.5,
          duration: 1.0,
          ease: "easeInOut",
        },
      },
    },
  };
  const bgVariants = {
    initial: { height: "6rem" },
    hover: { height: "5rem" },
  };
  return (
    <motion.div
      className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center p-8 text-center h-full overflow-hidden cursor-pointer transition-colors duration-300"
      initial="initial"
      whileHover="hover"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full absolute top-0 left-0 rounded-t-2xl opacity-60"
        style={{
          clipPath: "ellipse(70% 80% at 50% 0%)",
          backgroundColor: colors.accentBg,
        }}
        variants={bgVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10 p-4 rounded-full border-6 border-white dark:border-slate-800 mb-6 text-white"
        style={{ backgroundColor: colors.iconBg }}
        variants={iconVariants}
      >
        <Icon size={32} strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-3 leading-tight">
        {item.title}
      </h3>
      <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm">
        {item.description}
      </p>
    </motion.div>
  );
};

export default WhyChooseUs;
