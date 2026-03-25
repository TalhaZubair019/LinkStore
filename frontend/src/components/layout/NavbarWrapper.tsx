"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define paths where Navbar and Footer should be hidden
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
