"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  unoptimized?: boolean;
  isDashboard?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  breadcrumbs,
  isDashboard,
}) => {
  const router = useRouter();
  const finalBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
    { label: breadcrumb || title },
  ];

  return (
    <div
      className={`w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 transition-all ${isDashboard ? "py-6 pt-12" : "py-12 lg:py-16 pt-32 lg:pt-40"}`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className={`flex flex-col ${isDashboard ? "gap-2" : "gap-6"}`}>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            {finalBreadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <ChevronRight
                  size={14}
                  className="text-slate-300 dark:text-slate-700"
                />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 dark:text-white font-bold">
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight capitalize leading-tight">
            {title}
          </h1>

          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/shop");
              }
            }}
            className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-bold transition-all duration-300 hover:-translate-x-1 w-fit"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
