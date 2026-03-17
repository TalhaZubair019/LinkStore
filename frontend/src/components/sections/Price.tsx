"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import db from "@data/db.json";
import { motion } from "framer-motion";

function PricingSection() {
  const pricingData = db.price;
  const [isAnnual, setIsAnnual] = useState(false);
  const { header, toggles, plans } = pricingData;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-20 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div
          className="flex flex-col items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span
            variants={itemVariants}
            className="text-blue-800 dark:text-blue-400 tracking-widest text-s uppercase mb-4 block"
          >
            {header.label}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-[40px] font-medium text-[#111827] dark:text-white leading-[1.1] mb-6"
          >
            {header.titleMain} <br />
            <span className="text-[#ff6b6b] relative inline-block">
              {header.titleHighlight}
              <span className="absolute -bottom-1 left-0 w-full h-0.75 bg-[#ff6b6b] rounded-full"></span>
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 dark:text-slate-400 mb-10 max-w-xs leading-relaxed"
          >
            {header.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-10"
          >
            <span
              className={`text-sm font-bold ${!isAnnual ? "text-[#111827] dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              {toggles.monthly}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-[#4f46e5] rounded-full relative p-1 transition-all cursor-pointer"
              aria-label="Toggle pricing period"
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${isAnnual ? "translate-x-7" : "translate-x-0"}`}
              />
            </button>
            <span
              className={`text-sm font-bold ${isAnnual ? "text-[#111827] dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              {toggles.annual}
            </span>
          </motion.div>

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
              {header.ctaText}
            </span>
          </motion.button>
        </motion.div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan: any) => (
            <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
}

const PricingCard = ({ plan, isAnnual }: { plan: any; isAnnual: boolean }) => {
  return (
    <div className="relative p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-500 group cursor-default hover:bg-linear-to-br hover:from-[#6366f1] hover:to-[#06b6d4] hover:-translate-y-2 hover:shadow-2xl">
      <span className="inline-block px-5 py-1.5 rounded-full text-xs font-bold mb-6 bg-black text-white group-hover:bg-white/20 transition-colors">
        {plan.name}
      </span>
      <p className="text-sm mb-8 leading-relaxed text-gray-500 dark:text-slate-400 group-hover:text-white transition-colors">
        {plan.description}
      </p>

      <div className="flex items-baseline gap-1 mb-8 group-hover:text-white transition-colors">
        <span className="text-5xl font-black">
          ${isAnnual ? plan.price.yearly : plan.price.monthly}
        </span>
        <span className="text-sm font-medium text-gray-400 dark:text-slate-500 group-hover:text-white/80 transition-colors">
          / Per {isAnnual ? "Year" : "Month"}
        </span>
      </div>

      <button className="w-full py-4 rounded-full border border-gray-200 dark:border-slate-700 font-bold text-sm mb-10 transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white group-hover:border-transparent group-hover:bg-white/95 group-hover:text-slate-900 cursor-pointer">
        Get Started
      </button>

      <div className="space-y-4">
        {plan.features.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-center gap-3">
            <Check
              size={18}
              className="text-gray-800 dark:text-slate-200 group-hover:text-white transition-colors shrink-0"
            />
            <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-white/90 transition-colors">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
