import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import db from "@data/db.json";

const checkoutConfig = db.checkout;

export default function CheckoutHeader() {
  return (
    <div className="w-full pb-20 mt-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
        Checkout
      </h1>
      <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {checkoutConfig.breadcrumbs.home}
        </Link>
        <div className="flex text-blue-400">
          <ChevronRight size={14} strokeWidth={2.5} />
          <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
        </div>
        <span className="text-slate-900">
          {checkoutConfig.breadcrumbs.current}
        </span>
      </div>
    </div>
  );
}
