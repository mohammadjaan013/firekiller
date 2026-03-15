import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config - NO Prisma, NO bcrypt, NO Node.js modules.
 * Used by middleware.ts which runs in Edge Runtime.
 * The full auth config (with Credentials + Prisma) lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [], // Credentials provider is added in auth.ts (Node.js runtime only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Protected routes that require login
      const protectedRoutes = ["/account", "/orders", "/wishlist"];
      const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Admin routes
      const isAdminRoute = pathname.startsWith("/admin");

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== "ADMIN") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      if (isProtected && !isLoggedIn) return false;

      return true;
    },
  },
};
