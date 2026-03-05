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
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "home-safety" },
      update: {},
      create: {
        name: "Home Safety",
        slug: "home-safety",
        description: "Fire extinguishers and safety products for your home",
        image: "/images/categories/home-safety.jpg",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "kitchen-safety" },
      update: {},
      create: {
        name: "Kitchen Safety",
        slug: "kitchen-safety",
        description: "Fire suppression solutions for kitchen and cooking fires",
        image: "/images/categories/kitchen-safety.jpg",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "car-safety" },
      update: {},
      create: {
        name: "Car Safety",
        slug: "car-safety",
        description: "Compact fire extinguishers designed for vehicles",
        image: "/images/categories/car-safety.jpg",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "combo-packs" },
      update: {},
      create: {
        name: "Combo Packs",
        slug: "combo-packs",
        description: "Value bundles for complete fire protection",
        image: "/images/categories/combo-packs.jpg",
        sortOrder: 4,
      },
    }),
  ]);

  const [homeCat, kitchenCat, carCat, comboCat] = categories;
  console.log(`   ✅ ${categories.length} categories created\n`);

  // ─── 2. PRODUCTS ───────────────────────────────────────
  console.log("📦 Creating products...");

  const productsData = [
    {
      name: "FireKiller 500g Home Extinguisher",
      slug: "firekiller-500g-home",
      description: "Compact home fire extinguisher for living rooms and bedrooms",
      shortDesc:
        "India's most trusted compact fire extinguisher. Works on Class A, B, C, and electrical fires. No maintenance needed for 5 years.",
      price: 1499,
      originalPrice: 2499,
      sku: "FK-500G-HOME",
      stock: 150,
      isActive: true,
      isFeatured: true,
      badge: "Best Seller",
      weight: 0.5,
      dimensions: "28 × 9 cm",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-500g-home-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-500g-home-2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/firekiller-500g-home-3.jpg", isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: "FireKiller 1kg Multi-Purpose",
      slug: "firekiller-1kg-multipurpose",
      description: "Large capacity extinguisher for whole-home protection",
      shortDesc:
        "Double the capacity, double the protection. Extended 15-second discharge time with wider coverage for large living rooms and offices.",
      price: 2199,
      originalPrice: 3499,
      sku: "FK-1KG-MULTI",
      stock: 100,
      isActive: true,
      isFeatured: true,
      badge: "Popular",
      weight: 1.0,
      dimensions: "35 × 11 cm",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-1kg-multi-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-1kg-multi-2.jpg", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "PanSafe Kitchen Sachet (Pack of 3)",
      slug: "pansafe-kitchen-sachet-3pack",
      description: "Automatic fire suppression sachets for kitchen oil fires",
      shortDesc:
        "Revolutionary throw-and-forget fire sachet for cooking oil fires. No aiming, no pins — just toss into the burning pan.",
      price: 899,
      originalPrice: 1299,
      sku: "PS-SACHET-3PK",
      stock: 300,
      isActive: true,
      isFeatured: true,
      badge: "Kitchen Special",
      weight: 0.3,
      dimensions: "15 × 10 cm",
      categoryId: kitchenCat.id,
      images: [
        { url: "/images/products/pansafe-sachet-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/pansafe-sachet-2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/pansafe-sachet-3.jpg", isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: "FireKiller Car Compact 500g",
      slug: "firekiller-car-compact-500g",
      description: "Ultra-compact extinguisher that fits under your car seat",
      shortDesc:
        "Designed to fit under car seats or in the glove box. Vibration-resistant with glow-in-dark handle for emergencies.",
      price: 1299,
      originalPrice: 1999,
      sku: "FK-CAR-500G",
      stock: 120,
      isActive: true,
      isFeatured: true,
      badge: "New",
      weight: 0.5,
      dimensions: "25 × 8 cm",
      categoryId: carCat.id,
      images: [
        { url: "/images/products/firekiller-car-500g-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-car-500g-2.jpg", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "FireKiller 2kg Industrial",
      slug: "firekiller-2kg-industrial",
      description: "Heavy-duty extinguisher for large spaces and offices",
      shortDesc:
        "Built for large spaces — 4-5 meter range with 30-second continuous discharge. Commercial-grade certification.",
      price: 3499,
      originalPrice: 4999,
      sku: "FK-2KG-IND",
      stock: 50,
      isActive: true,
      isFeatured: false,
      badge: "Pro",
      weight: 2.0,
      dimensions: "42 × 14 cm",
      categoryId: homeCat.id,
      images: [
        { url: "/images/products/firekiller-2kg-industrial-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-2kg-industrial-2.jpg", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "PanSafe + FireKiller Kitchen Combo",
      slug: "pansafe-firekiller-kitchen-combo",
      description: "Complete kitchen fire safety kit with sachet and extinguisher",
      shortDesc:
        "PanSafe sachet (for oil fires) + FireKiller 500g (for everything else). Covers every kitchen fire scenario.",
      price: 2199,
      originalPrice: 3499,
      sku: "FK-KITCHEN-COMBO",
      stock: 80,
      isActive: true,
      isFeatured: false,
      badge: "Value Pack",
      weight: 0.6,
      dimensions: "30 × 12 cm",
      categoryId: kitchenCat.id,
      images: [
        { url: "/images/products/kitchen-combo-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/kitchen-combo-2.jpg", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "FireKiller Car Mount Kit",
      slug: "firekiller-car-mount-kit",
      description: "Extinguisher with mounting bracket for secure car installation",
      shortDesc:
        "Premium 500g car extinguisher with heavy-duty steel bracket. Quick-release mechanism for emergencies.",
      price: 1799,
      originalPrice: 2499,
      sku: "FK-CAR-MOUNT",
      stock: 90,
      isActive: true,
      isFeatured: false,
      badge: "Bundle",
      weight: 0.75,
      dimensions: "28 × 12 cm",
      categoryId: carCat.id,
      images: [
        { url: "/images/products/car-mount-kit-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/car-mount-kit-2.jpg", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "FireKiller Home Safety Combo",
      slug: "firekiller-home-safety-combo",
      description: "Complete home protection: kitchen + bedroom + car extinguisher",
      shortDesc:
        "1kg home extinguisher + PanSafe kitchen sachet + 500g car compact. Save ₹2,000 — complete family protection.",
      price: 3999,
      originalPrice: 5999,
      sku: "FK-HOME-COMBO",
      stock: 60,
      isActive: true,
      isFeatured: true,
      badge: "Best Value",
      weight: 1.6,
      dimensions: "40 × 20 cm",
      categoryId: comboCat.id,
      images: [
        { url: "/images/products/home-combo-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/home-combo-2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/home-combo-3.jpg", isPrimary: false, sortOrder: 2 },
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
