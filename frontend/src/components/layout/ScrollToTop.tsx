"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const isPopState = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const tid = setTimeout(() => {
      if (isPopState.current) {
        isPopState.current = false;
        return;
      }

      if (window.location.hash) return;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 10);

    return () => clearTimeout(tid);
  }, [pathname]);

  return null;
}
