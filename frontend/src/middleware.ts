import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // We only target the home page for this instant redirect
  if (request.nextUrl.pathname === "/") {
    // Skip redirect if explicitly requested to see the storefront
    if (request.nextUrl.searchParams.get("view") === "store") {
      return NextResponse.next();
    }
    
    if (token) {
      try {
        // Lightweight JWT decoding for Edge Runtime (JWT is [header].[payload].[signature])
        const payloadPart = token.split(".")[1];
        if (payloadPart) {
          // Base64URL decode (standard in JWT)
          const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = atob(base64);
          const decoded = JSON.parse(jsonPayload);

          if (decoded.isAdmin) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
          }
          if (decoded.isVendor) {
            return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
          }
        }
      } catch (error) {
        // If decoding fails, just continue to the home page normally
        console.error("Middleware Auth Check Failed:", error);
      }
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs for the home page to keep site performance optimal
export const config = {
  matcher: "/",
};
