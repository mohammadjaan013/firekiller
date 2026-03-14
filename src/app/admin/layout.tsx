import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  ShieldCheck,
  Package,
  Users,
  Tag,
  DollarSign,
  ArrowLeft,
  IndianRupee,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  // { href: "/admin/cod-orders", label: "COD Orders", icon: ShieldCheck },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: DollarSign },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-muted pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border shrink-0 hidden lg:block">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <h2 className="text-lg font-bold text-secondary mt-3">Admin Panel</h2>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-secondary transition-colors"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-muted-foreground hover:text-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-sm font-bold text-secondary">Admin Panel</h2>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-28 overflow-x-hidden">{children}</main>
    </div>
  );
}
