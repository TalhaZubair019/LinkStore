import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  
  if (request.nextUrl.pathname === "/") {
    
    if (request.nextUrl.searchParams.get("view") === "store") {
      return NextResponse.next();
    }
    
    if (token) {
      try {
        
        const payloadPart = token.split(".")[1];
        if (payloadPart) {
          
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
        
        console.error("Middleware Auth Check Failed:", error);
      }
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: "/",
};
