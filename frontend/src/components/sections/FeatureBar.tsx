"use client";
import React from "react";
import { ShieldCheck, Truck, RotateCcw, BadgeDollarSign } from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "Safe Payments" },
  { icon: Truck, text: "Nationwide Delivery" },
  { icon: RotateCcw, text: "Free & Easy Returns" },
  { icon: BadgeDollarSign, text: "Best Price Guaranteed" },
];

export default function FeatureBar() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-sm flex flex-wrap items-center justify-between px-6 py-3 shadow-sm gap-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-darazOrange/10 flex items-center justify-center text-darazOrange group-hover:bg-darazOrange group-hover:text-white transition-all duration-300">
              <f.icon size={22} />
            </div>
            <span className="text-sm font-medium text-[#424242] dark:text-slate-300 group-hover:text-darazOrange transition-colors">
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
