// ─── Database Seed Script ───────────────────────────────
// Run with: npx tsx prisma/seed.ts

import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── 1. CATEGORIES ─────────────────────────────────────
  console.log("📁 Creating categories...");

  // Remove legacy combo-packs category if it exists (delete products first)
  const comboCat = await prisma.category.findUnique({ where: { slug: "combo-packs" } });
  if (comboCat) {
    await prisma.productImage.deleteMany({
      where: { product: { categoryId: comboCat.id } },
    });
    await prisma.product.deleteMany({ where: { categoryId: comboCat.id } });
    await prisma.category.delete({ where: { slug: "combo-packs" } });
  }

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "home-safety" },
      update: {
        description: "FireKiller extinguishers for your home — 1, 2, or 3 units",
        image: "/images/categories/home.png",
      },
      create: {
        name: "Home Safety",
        slug: "home-safety",
        description: "FireKiller extinguishers for your home — 1, 2, or 3 units",
        image: "/images/categories/home.png",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "kitchen-safety" },
      update: {
        description: "PanSafe fire suppression sachets — toss & extinguish oil fires",
        image: "/images/categories/kitchen.png",
      },
      create: {
        name: "Kitchen Safety",
        slug: "kitchen-safety",
        description: "PanSafe fire suppression sachets — toss & extinguish oil fires",
        image: "/images/categories/kitchen.png",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "car-safety" },
      update: {
        description: "Compact FireKiller extinguishers designed for vehicles",
        image: "/images/categories/car.png",
      },
      create: {
        name: "Car Safety",
        slug: "car-safety",
        description: "Compact FireKiller extinguishers designed for vehicles",
        image: "/images/categories/car.png",
        sortOrder: 3,
      },
    }),
  ]);

  const [homeCat, kitchenCat, carCat] = categories;
  console.log(`   ✅ ${categories.length} categories created\n`);

  // ─── 2. PRODUCTS ───────────────────────────────────────
  console.log("📦 Creating products...");

  // Clean up old products that no longer exist
  const oldSlugs = [
    "firekiller-500g-home", "firekiller-1kg-multipurpose",
    "pansafe-kitchen-sachet-3pack", "firekiller-car-compact-500g",
    "firekiller-2kg-industrial", "pansafe-firekiller-kitchen-combo",
    "firekiller-car-mount-kit", "firekiller-home-safety-combo",
    // Old 9-product slugs
    "firekiller-home-1", "firekiller-home-2", "firekiller-home-3",
    "pansafe-kitchen-1", "pansafe-kitchen-3", "pansafe-kitchen-5",
    "firekiller-car-1", "firekiller-car-2", "firekiller-car-3",
  ];
  for (const slug of oldSlugs) {
    const old = await prisma.product.findUnique({ where: { slug } });
    if (old) {
      await prisma.productImage.deleteMany({ where: { productId: old.id } });
      await prisma.product.delete({ where: { slug } });
    }
  }

  const productsData = [
    // ── FireKiller × 1 (Home + Car) ─────────────────────
    {
      name: "FireKiller — 1 Unit",
      slug: "firekiller-1",
      description: "Single compact fire extinguisher for home or car",
      shortDesc:
        "India's most trusted compact fire extinguisher. Works on Class A, B, C, and electrical fires. No maintenance needed for 5 years.",
      price: 943,
      originalPrice: 943,
      sku: "FK-1",
      stock: 200,
      isActive: true,
      isFeatured: true,
      badge: "Best Seller",
      weight: 0.5,
      dimensions: "28 × 9 cm",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-1.webp", isPrimary: true, sortOrder: 0 },
      ],
    },
    // ── FireKiller × 2 (Home + Car) ─────────────────────
    {
      name: "FireKiller — 2 Units",
      slug: "firekiller-2",
      description: "Two extinguishers for multi-room or multi-vehicle coverage",
      shortDesc:
        "Cover bedroom + living room, or place one in each car. Same trusted clean-agent formula. Save over \u20B9200.",
      price: 1650,
      originalPrice: 1850,
      sku: "FK-2",
      stock: 150,
      isActive: true,
      isFeatured: true,
      badge: "Popular",
      weight: 1.0,
      dimensions: "28 × 9 cm (each)",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-2.webp", isPrimary: true, sortOrder: 0 },
      ],
    },
    // ── FireKiller × 3 (Home + Car) ─────────────────────
    {
      name: "FireKiller — 3 Units",
      slug: "firekiller-3",
      description: "Three extinguishers for whole-home or fleet protection",
      shortDesc:
        "Protect bedroom, living room, kitchen, or all three vehicles. Best value with ₹400 savings.",
      price: 2358,
      originalPrice: 2758,
      sku: "FK-3",
      stock: 100,
      isActive: true,
      isFeatured: false,
      badge: "Best Value",
      weight: 1.5,
      dimensions: "28 × 9 cm (each)",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-3.webp", isPrimary: true, sortOrder: 0 },
      ],
    },

    // ── PanSafe × 1 (Kitchen) ───────────────────────────
    {
      name: "PanSafe Sachet — 1 Pc",
      slug: "pansafe-1",
      description: "Single fire suppression sachet for cooking oil fires",
      shortDesc:
        "Revolutionary throw-and-forget sachet. Toss into a burning pan — it activates on contact. No aiming, no pins.",
      price: 1299,
      originalPrice: 1299,
      sku: "PS-1",
      stock: 500,
      isActive: true,
      isFeatured: true,
      badge: "Starter",
      weight: 0.1,
      dimensions: "15 × 10 cm",
      categoryId: kitchenCat.id,
      images: [
        { url: "/images/products/pansafe-1.webp", isPrimary: true, sortOrder: 0 },
      ],
    },
    // ── PanSafe × 3 (Kitchen) ───────────────────────────
    {
      name: "PanSafe Sachet — 3 Pcs",
      slug: "pansafe-3",
      description: "Pack of 3 sachets for months of kitchen protection",
      shortDesc:
        "Three sachets — stove, drawer, spare. Daily confidence for families who cook with oil. Save ₹399.",
      price: 3498,
      originalPrice: 3897,
      sku: "PS-3",
      stock: 300,
      isActive: true,
      isFeatured: true,
      badge: "Best Seller",
      weight: 0.3,
      dimensions: "15 × 10 cm (each)",
      categoryId: kitchenCat.id,
      images: [
        { url: "/images/products/pansafe-3.webp", isPrimary: true, sortOrder: 0 },
      ],
    },
    // ── PanSafe × 5 (Kitchen) ───────────────────────────
    {
      name: "PanSafe Sachet — 5 Pcs",
      slug: "pansafe-5",
      description: "Mega pack of 5 sachets for year-round kitchen safety",
      shortDesc:
        "Under ₹1,099 per sachet. Share with family or stock up for the year. Best per-unit value.",
      price: 5495,
      originalPrice: 6495,
      sku: "PS-5",
      stock: 200,
      isActive: true,
      isFeatured: false,
      badge: "Family Pack",
      weight: 0.5,
      dimensions: "15 × 10 cm (each)",
      categoryId: kitchenCat.id,
      images: [
        { url: "/images/products/pansafe-5.webp", isPrimary: true, sortOrder: 0 },
      ],
    },
  ];

  for (const { images, ...productData } of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });

    // Delete existing images and re-create
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((img) => ({ ...img, productId: product.id })),
    });
  }

  console.log(`   ✅ ${productsData.length} products with images created\n`);

  // ─── 3. ADMIN USER ────────────────────────────────────
  console.log("👤 Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@firekiller.in" },
    update: { password: adminPassword },
    create: {
      name: "FireKiller Admin",
      email: "admin@firekiller.in",
      password: adminPassword,
      role: "ADMIN",
      phone: "+91-9876543210",
    },
  });
  console.log("   ✅ Admin user created (admin@firekiller.in / admin123456)\n");

  // ─── 4. SAMPLE COUPONS ────────────────────────────────
  console.log("🎟️  Creating coupons...");
  const coupons = [
    {
      code: "WELCOME10",
      description: "10% off on your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 999,
      maxDiscount: 500,
      usageLimit: 1000,
      isActive: true,
      expiresAt: new Date("2027-03-31"),
    },
    {
      code: "FIRESAFE200",
      description: "Flat ₹200 off on orders above ₹1,500",
      discountType: "fixed",
      discountValue: 200,
      minOrder: 1500,
      maxDiscount: 200,
      usageLimit: 500,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    },
    {
      code: "COMBO15",
      description: "15% off on combo packs",
      discountType: "percentage",
      discountValue: 15,
      minOrder: 2000,
      maxDiscount: 1000,
      usageLimit: 300,
      isActive: true,
      expiresAt: new Date("2026-09-30"),
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }
  console.log(`   ✅ ${coupons.length} coupons created\n`);

  // ─── 5. SAMPLE BLOG POSTS ─────────────────────────────
  console.log("📝 Creating blog posts...");
  const posts = [
    {
      title: "5 Signs You Need a Fire Extinguisher at Home",
      slug: "5-signs-you-need-fire-extinguisher",
      excerpt:
        "Most Indian homes have zero fire safety equipment. Here are 5 telltale signs you need to get one today.",
      content: `
## Why Every Indian Home Needs a Fire Extinguisher

Every year, over 17,000 people die in fire accidents in India. That's 46 deaths every single day. Yet, less than 2% of Indian homes have a fire extinguisher.

### Sign 1: You Cook with Gas or Oil
Kitchen fires are the #1 cause of home fires. If you use a gas stove or cook with oil, you're at risk.

### Sign 2: You Have Electrical Appliances
Old wiring, overloaded sockets, and faulty appliances can spark a fire at any time.

### Sign 3: You Live in a Multi-Story Building
High-rise fires can trap families. Having your own extinguisher gives you a fighting chance before firefighters arrive.

### Sign 4: You Have Kids or Elderly at Home
They're the most vulnerable. A simple, one-hand extinguisher can be used by anyone.

### Sign 5: You've Never Thought About Fire Safety
That's actually the biggest sign. Fire doesn't wait for you to be prepared.

## The Solution
A compact FireKiller extinguisher costs less than a dinner out and lasts 5 years with zero maintenance. Isn't your family worth it?
      `.trim(),
      coverImage: "/images/blog/fire-extinguisher-home.jpg",
      category: "Safety Tips",
      readTime: "4 min read",
      isPublished: true,
      publishedAt: new Date("2026-02-15"),
    },
    {
      title: "Kitchen Fire? Here's What to Do (and NOT Do)",
      slug: "kitchen-fire-what-to-do",
      excerpt:
        "Throwing water on an oil fire is the worst thing you can do. Learn the right way to handle kitchen fires.",
      content: `
## Kitchen Fire Safety 101

Kitchen fires are terrifying — they happen fast and spread even faster. Here's your survival guide.

### What NOT to Do
- **Never pour water on an oil fire.** It causes a massive fireball.
- **Don't try to carry a burning pan.** You'll spill burning oil on yourself.
- **Don't fan the flames.** Oxygen makes fire bigger.

### What TO Do
1. **Turn off the gas** if you can reach the knob safely.
2. **Cover the pan** with a metal lid to cut off oxygen.
3. **Use a PanSafe sachet** — just throw it into the pan. It activates on contact.
4. **Use a fire extinguisher** if the fire has spread beyond the pan.
5. **Call 101** (fire services) if you can't control it in 30 seconds.

### Prevention Tips
- Never leave cooking unattended
- Keep a PanSafe sachet within arm's reach of your stove
- Install a FireKiller extinguisher in your kitchen
- Keep a fire blanket handy
      `.trim(),
      coverImage: "/images/blog/kitchen-fire-safety.jpg",
      category: "Safety Tips",
      readTime: "3 min read",
      isPublished: true,
      publishedAt: new Date("2026-01-20"),
    },
    {
      title: "FireKiller vs Traditional Extinguishers: What's Different?",
      slug: "firekiller-vs-traditional-extinguishers",
      excerpt:
        "Traditional extinguishers are bulky, need annual maintenance, and require training. FireKiller changes all that.",
      content: `
## The Problem with Traditional Fire Extinguishers

Let's be honest — traditional fire extinguishers are great for offices and factories. But for homes? They're impractical.

### Traditional Extinguishers
- Heavy (4-9 kg)
- Need annual maintenance and pressure checks
- Require pulling a pin and squeezing a lever (training needed)
- Leave a massive mess (powder everywhere)
- Expensive (₹3,000-8,000)

### FireKiller Extinguishers
- Lightweight (500g-2kg)
- Zero maintenance for 5 years
- One-hand squeeze operation — anyone can use it
- Clean agent — no powder mess
- Affordable (starting ₹1,499)

### The Verdict
For industrial use, traditional extinguishers still have their place. But for Indian homes, apartments, kitchens, and cars — FireKiller is the smarter, easier, more affordable choice.
      `.trim(),
      coverImage: "/images/blog/firekiller-vs-traditional.jpg",
      category: "Product Guide",
      readTime: "5 min read",
      isPublished: true,
      publishedAt: new Date("2026-03-01"),
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`   ✅ ${posts.length} blog posts created\n`);

  console.log("─────────────────────────────────────────");
  console.log("🎉 Seed complete! Your database is ready.");
  console.log("─────────────────────────────────────────");
  console.log("\nRun `npx prisma studio` to explore your data!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
