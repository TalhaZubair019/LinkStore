"use client";

import db from "@data/db.json";
import {
  Play,
  MousePointer2,
  PencilLine,
  Printer,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const STEP_POSITIONS = [
  { top: 0, left: 0 },
  { top: 160, left: "40%" },
  { top: 500, left: "10%" },
];
const STEP_COLORS = [
  { iconBg: "#A855F7", cardBg: "#F4F1FE" },
  { iconBg: "#FFAEB8", cardBg: "#FFF0F3" },
  { iconBg: "#8BB6FF", cardBg: "#EFF6FF" },
];

function HowItWorks() {
  const howItWorksData = db.howitworks;
  const {
    sectionLabel,
    headingMain,
    headingHighlight,
    assets,
    steps,
    footerContent,
  } = howItWorksData;

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative">
        <div className="max-w-3xl mb-12 lg:mb-24 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base text-blue-900 dark:text-blue-400 uppercase mb-3"
          >
            {sectionLabel}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-medium text-slate-900 dark:text-white leading-[1.15]"
          >
            {headingMain} <br />
            <span className="relative inline-block text-[#FF7F7F] mt-2 pb-2 border-b-4 border-[#FF7F7F] rounded-sm">
              {headingHighlight}
            </span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-6 lg:hidden">
          {steps.map((step: (typeof steps)[0], idx: number) => (
            <StepCard key={step.id} data={step} index={idx} desktop={false} />
          ))}
          <div className="mt-4 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">
              {footerContent.text}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton label={footerContent.btnText} />
              <VideoButton label={footerContent.videoText} />
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block" style={{ height: "820px" }}>
          <div className="absolute top-[5%] left-[22%] w-[20%] z-0 pointer-events-none select-none">
            <img
              src={assets.arrowOne}
              alt=""
              className="w-full h-auto object-contain opacity-80"
            />
          </div>
          <div className="absolute top-[36%] left-[24%] w-[18%] z-0 pointer-events-none select-none">
            <img
              src={assets.arrowTwo}
              alt=""
              className="w-full h-auto object-contain opacity-80"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            className="absolute top-[40%] right-[8%] w-[10%] z-0 pointer-events-none select-none"
          >
            <img
              src="https://themexriver.com/wp/printnest/wp-content/uploads/2025/12/p1-bg-illus-1.webp"
              alt="Background decoration"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {steps.map((step: (typeof steps)[0], idx: number) => (
            <StepCard key={step.id} data={step} index={idx} desktop={true} />
          ))}
          <div
            className="absolute text-left z-20"
            style={{ top: "580px", right: "5%", maxWidth: "450px" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8"
            >
              {footerContent.text}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                bounce: 0.4,
              }}
              className="flex items-center gap-6"
            >
              <GradientButton label={footerContent.btnText} />
              <VideoButton label={footerContent.videoText} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
const iconMap: Record<string, any> = {
  MousePointer2,
  PencilLine,
  Printer,
};

const resolveIcon = (icon: any) => {
  if (!icon) return HelpCircle;
  if (typeof icon === "string") return (iconMap as any)[icon] ?? HelpCircle;
  return icon;
};

const GradientButton = ({ label }: { label: string }) => (
  <motion.button
    className="relative group cursor-pointer outline-none border-none bg-transparent p-0"
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4, type: "spring" }}
  >
    <span
      className="absolute inset-0 rounded-full border-2 border-transparent translate-x-1.5 translate-y-1.5 transition-transform duration-200 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"
      style={{
        background: "linear-gradient(to right, #7f22fe, #26C6DA) border-box",
        WebkitMask:
          "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "destination-out",
        maskComposite: "exclude",
      }}
      aria-hidden="true"
    />
    <span className="relative block px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-linear-to-r from-[#7f22fe] to-[#26C6DA] text-base sm:text-lg font-bold text-white transition-transform duration-200 ease-in-out group-active:scale-95">
      {label}
    </span>
  </motion.button>
);

const VideoButton = ({ label }: { label: string }) => (
  <button className="flex items-center gap-3 group cursor-pointer">
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center relative">
      <div className="w-full h-full rounded-full border border-red-300 absolute" />
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
        <Play size={14} fill="white" className="text-white ml-0.5" />
      </div>
    </div>
    <span className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
      {label}
    </span>
  </button>
);

const StepCard = ({
  data,
  index,
  desktop,
}: {
  data: any;
  index: number;
  desktop: boolean;
}) => {
  const Icon = resolveIcon(data.icon);
  const pos = STEP_POSITIONS[index];
  const colors = STEP_COLORS[index] ?? { iconBg: "#6366f1", cardBg: "#F8FAFC" };

  const iconBounceVariant: any = {
    rest: { y: 0 },
    hover: {
      y: [0, -20, 0, -10, 0, -5, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.7, 0.85, 0.95, 1],
      },
    },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-8 sm:p-10 rounded-4xl border border-transparent dark:border-slate-800 transition-all duration-300 text-center z-10 group cursor-pointer bg-(--card-bg) dark:bg-slate-900"
      style={
        {
          "--card-bg": colors.cardBg,
          ...(desktop && pos
            ? {
                position: "absolute" as const,
                top: pos.top,
                left: pos.left,
                width: "320px",
              }
            : {}),
          opacity: 0,
          scale: 0.9,
        } as any
      }
    >
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg border-8 border-white dark:border-slate-800 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: colors.iconBg }}
      >
        <motion.div variants={iconBounceVariant}>
          <Icon size={30} strokeWidth={1.5} />
        </motion.div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
        {data.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
        {data.description}
      </p>
    </motion.div>
  );
};

export default HowItWorks;
