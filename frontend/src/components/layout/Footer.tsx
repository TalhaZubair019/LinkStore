"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import db from "@data/db.json";

function Footer() {
  const footerData = db.footer;
  const pathname = usePathname();
  const { newsletter, brand, columns, contact, bottom } = footerData;

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/account") ||
    pathname === "/apply-vendor"
  ) {
    return null;
  }

  const socialIcons = {
    Facebook: Facebook,
    Twitter: Twitter,
    Instagram: Instagram,
    Linkedin: Linkedin,
  };

  return (
    <footer className="relative bg-[#020617] mt-32 sm:mt-40 lg:mt-48 px-4 sm:px-8 lg:px-20 pt-32 sm:pt-40 lg:pt-44 pb-12 font-sans">
      <div className="absolute left-0 right-0 -top-32 px-4 md:px-6 z-30">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-linear-to-br from-[#6d05ff] to-[#06b3ca] rounded-4xl p-6 md:px-12 md:py-8 lg:py-10 shadow-2xl overflow-hidden shadow-blue-500/20">
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
                {newsletter.titlePart1} {newsletter.titlePart2}
              </h2>
              <p className="text-white/90 mb-6 text-sm md:text-base max-w-2xl font-medium">
                {newsletter.description}
              </p>

              <form className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <input
                  type="email"
                  placeholder={newsletter.placeholder}
                  className="flex-1 px-8 py-4 rounded-full bg-white/20 border border-white/30 placeholder-white/70 text-white text-base focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-xl transition-all shadow-inner"
                />
                <button className="px-10 py-4 bg-white text-[#06b3ca] font-black rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap text-base cursor-pointer">
                  {newsletter.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12 lg:mb-16 border-b border-gray-800 pb-8 lg:pb-12">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <Image
                src={brand.logo}
                alt="Brand Logo"
                width={140}
                height={40}
                className="h-8 w-auto dark:brightness-0 dark:invert"
                unoptimized
              />
            </div>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {brand.description}
            </p>
            <div className="flex gap-3">
              {brand.socials.map(
                (social: { name: string; url: string }, idx: number) => {
                  const Icon =
                    socialIcons[social.name as keyof typeof socialIcons];
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-white/10 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                },
              )}
            </div>
          </div>
          {columns.map((col: (typeof columns)[0], idx: number) => (
            <FooterLinkColumn key={idx} title={col.title} links={col.links} />
          ))}
          <div className="lg:col-span-1">
            <FooterContactColumn contact={contact} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            {bottom.copyright}
          </p>

          <div className="flex items-center gap-2">
            {bottom.paymentMethods.map((src: string, idx: number) => (
              <div key={idx} className="bg-white rounded px-1.5 py-1">
                <Image
                  src={src}
                  alt={`Payment Method ${idx}`}
                  width={34}
                  height={20}
                  className="h-4 w-auto object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; url: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800/50 md:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between md:block py-4 md:py-0 text-left cursor-pointer group"
      >
        <h4 className="text-white font-bold md:mb-6 flex flex-col">
          {title}
          <span className="hidden md:block w-8 h-0.5 bg-[#ff5e14] mt-2 rounded-full"></span>
        </h4>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden md:overflow-visible transition-all duration-300 ${isOpen ? "max-h-64 pb-6" : "max-h-0 md:max-h-none"}`}
      >
        <ul className="space-y-3 text-sm text-gray-400">
          {links.map((item: { label: string; url: string }) => (
            <li key={item.label}>
              <a
                href={item.url}
                className="relative group transition-colors inline-block"
              >
                <span className="text-gray-400 group-hover:text-[#ff5e14] transition-colors">
                  {item.label}
                </span>
                <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-[#ff5e14] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FooterContactColumn = ({ contact }: { contact: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800/50 md:border-0 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between md:block py-4 md:py-0 text-left cursor-pointer group"
      >
        <h4 className="text-white font-bold md:mb-6 flex flex-col">
          {contact.title}
          <span className="hidden md:block w-8 h-0.5 bg-[#ff5e14] mt-2 rounded-full"></span>
        </h4>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden md:overflow-visible transition-all duration-300 ${isOpen ? "max-h-64 pb-6" : "max-h-0 md:max-h-none"}`}
      >
        <ul className="space-y-4 text-sm text-gray-400">
          <li className="leading-relaxed">
            {contact.address.map((line: string, i: number) => (
              <div
                key={i}
                className="relative group/addr inline-block w-fit mr-2"
              >
                <span className="relative z-10 transition-colors group-hover/addr:text-[#ff5e14]">
                  {line}
                </span>
                <span className="absolute left-0 bottom-0 w-full h-px bg-[#ff5e14] scale-x-0 group-hover/addr:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </div>
            ))}
          </li>
          <li className="flex items-center gap-2 group/link">
            <Mail className="w-4 h-4 text-[#ff5e14]" />
            <a
              href={`mailto:${contact.email}`}
              className="relative transition-colors"
            >
              <span className="hover:text-[#ff5e14] transition-colors">
                {contact.email}
              </span>
              <span className="absolute left-0 bottom-0 w-full h-px bg-[#ff5e14] scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </a>
          </li>
          <li className="flex items-center gap-2 group/link">
            <Phone className="w-4 h-4 text-[#ff5e14]" />
            <a
              href={`tel:${contact.phoneLink}`}
              className="relative transition-colors"
            >
              <span className="text-lg text-white font-medium hover:text-[#ff5e14] transition-colors">
                {contact.phone}
              </span>
              <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-[#ff5e14] scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
