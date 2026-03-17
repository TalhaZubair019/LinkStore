"use client";
import Image from "next/image";
import db from "@data/db.json";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BlindsImage = ({
  src,
  alt,
  className,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  delay?: number;
}) => {
  const bars = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className={`relative overflow-hidden shadow-2xl ${className}`}>
      <Image src={src} alt={alt} fill priority />
      <div className="absolute inset-0 flex flex-col z-10">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 w-full bg-gray-200 dark:bg-slate-800 border-b border-white/50 dark:border-slate-700/50"
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

const RevealText = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

function About() {
  const router = useRouter();
  const aboutData = db.about;

  return (
    <section
      id="about"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-20 bg-[#F6F9FF] dark:bg-slate-950 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative flex gap-8 lg:gap-10 items-start">
            <div className="w-[55%] relative z-10">
              <BlindsImage
                src={aboutData.mainImage}
                alt="Main Feature"
                className="w-full h-80 sm:h-110 lg:h-155 object-cover rounded-t-full rounded-bl-full shadow-lg"
                delay={0}
              />
            </div>
            <div className="w-[45%] flex flex-col gap-6 lg:gap-8 z-10">
              <div className="w-full aspect-square">
                <BlindsImage
                  src={aboutData.secondaryImages[0]}
                  alt="Detail 1"
                  className="w-full h-44 sm:h-60 lg:h-80 object-cover rounded-t-full rounded-br-full shadow-lg"
                  delay={0}
                />
              </div>
              <div className="w-full aspect-square">
                <BlindsImage
                  src={aboutData.secondaryImages[1]}
                  alt="Detail 2"
                  className="w-full h-44 sm:h-60 lg:h-80 object-cover rounded-t-full rounded-bl-full shadow-lg"
                  delay={0}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-10">
              <RevealText className="mb-4" delay={0.2}>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-400 uppercase tracking-widest">
                  {aboutData.sectionLabel}
                </p>
              </RevealText>
              <RevealText className="mb-6" delay={0.4}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black dark:text-white leading-tight">
                  {aboutData.headingFirst}{" "}
                  <span className="text-[#FF7F7F] underline decoration-4 underline-offset-4 decoration-[#FF7F7F]">
                    {aboutData.headingHighlight}
                  </span>
                </h2>
              </RevealText>
              <RevealText delay={0.6}>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {aboutData.description}
                </p>
              </RevealText>
            </div>

            <div className="space-y-8 mb-10">
              {aboutData.features.map(
                (item: (typeof aboutData.features)[0], idx: number) => (
                  <RevealText key={idx} delay={0.8 + idx * 0.2}>
                    <div className="flex group">
                      <div className="shrink-0 mr-6">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-slate-900 transition-colors duration-300">
                          <Check size={24} strokeWidth={3} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </RevealText>
                ),
              )}
            </div>
            <motion.button
              className="relative group cursor-pointer outline-none border-none bg-transparent p-0"
              onClick={() => router.push(aboutData.headerBtnLink)}
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
                See Our Products
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
