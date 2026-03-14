import { requireAuth } from "@/lib/auth-utils";
import Link from "next/link";
import { User, Package, Heart } from "lucide-react";

export default async function AccountPage() {
  const user = await requireAuth();

  const menuItems = [
    { label: "My Orders", href: "/orders", icon: Package, description: "Track and manage your orders" },
    { label: "Wishlist", href: "/wishlist", icon: Heart, description: "Your saved products" },
  ];

  return (
    <div className="min-h-screen bg-muted pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.role === "ADMIN" && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary group-hover:text-primary transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
