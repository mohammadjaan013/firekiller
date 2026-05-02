import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-safe authConfig (no Prisma, no bcrypt) for middleware
export default NextAuth(authConfig).auth;

export const config = {
  // Run middleware on protected + admin routes only (not on API, static files, etc.)
  // /orders/track is public (guest order lookup) — excluded here, handled in auth.config.ts
  matcher: ["/account/:path*", "/orders/((?!track).*)", "/wishlist/:path*", "/admin/:path*"],
};
