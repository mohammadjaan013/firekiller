import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on server components.
 * Returns the session or null.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication. Redirects to /login if not logged in.
 * Use in server components / pages.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require admin role. Redirects to / if not admin.
 * Use in server components / pages.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
