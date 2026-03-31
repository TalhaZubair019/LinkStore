"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  
  const isHidden = pathname?.includes("/admin/store-preview");

  if (isHidden) {
    return <main className="grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
