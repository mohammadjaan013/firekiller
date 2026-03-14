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

  // All prices are BASE prices EXCLUDING 18% GST
  // FireKiller: 799, 1598, 2397  (+18% GST = 943, 1886, 2828)
  // PanSafe:    899, 2427, 3820  (+18% GST = 1061, 2864, 4507)

  const productsData = [
    // ── FireKiller × 1 ──────────────────────────────────
    {
      name: "FireKiller — 1 Unit",
      slug: "firekiller-1",
      description: "Single compact fire extinguisher — perfect for a room, office, or car.",
      shortDesc: "India's most trusted compact fire extinguisher.",
      longDescription: "The FireKiller is India's most trusted compact fire extinguisher. Works on Class A, B, C, and electrical fires with zero maintenance for 5 years. Just grab, point, and spray — one-hand operation means anyone in the family can use it.",
      price: 799,
      originalPrice: 999,
      gstRate: 0.18,
      sku: "FK-1",
      stock: 200,
      isActive: true,
      isFeatured: true,
      badge: "Best Seller",
      weight: 0.5,
      dimensions: "28 × 9 cm",
      packSize: 1,
      productLine: "firekiller",
      categoryLabel: "Home & Car Safety",
      categoryId: homeCat.id,
      features: ["Works on Oil, Gas & Electrical fires", "Zero maintenance for 5 years", "One-hand squeeze operation", "Non-toxic, eco-friendly agent", "Wall-mount bracket included", "ISI certified & BIS approved"],
      specifications: { Quantity: "1 × FireKiller", Weight: "500 g", Type: "Clean Agent (ABC + Electrical)", Range: "2-3 meters", "Discharge Time": "8-10 seconds", "Shelf Life": "5 years", Certifications: "ISI, BIS, CE" },
      video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
      images: [
        { url: "/images/products/f2.png", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/1.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/2.png", isPrimary: false, sortOrder: 3 },
      ],
    },
    // ── FireKiller × 2 ──────────────────────────────────
    {
      name: "FireKiller — 2 Units",
      slug: "firekiller-2",
      description: "Two extinguishers — cover bedroom + living room, or equip two cars.",
      shortDesc: "Cover two critical areas with the FireKiller 2-unit pack.",
      longDescription: "Cover two critical areas with the FireKiller 2-unit pack. Bedroom + living room, or one per car. Same trusted clean-agent formula, same zero-maintenance promise.",
      price: 1598,
      originalPrice: 1998,
      gstRate: 0.18,
      sku: "FK-2",
      stock: 150,
      isActive: true,
      isFeatured: true,
      badge: "Popular",
      weight: 1.0,
      dimensions: "28 × 9 cm (each)",
      packSize: 2,
      productLine: "firekiller",
      categoryLabel: "Home & Car Safety",
      categoryId: homeCat.id,
      features: ["Two extinguishers for multi-area safety", "Save more vs buying individually", "Zero maintenance for 5 years each", "One-hand squeeze operation", "Two wall-mount brackets included", "ISI certified & BIS approved"],
      specifications: { Quantity: "2 × FireKiller", Weight: "500 g per unit", Type: "Clean Agent (ABC + Electrical)", Range: "2-3 meters", "Discharge Time": "8-10 seconds", "Shelf Life": "5 years", Certifications: "ISI, BIS, CE" },
      video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
      images: [
        { url: "/images/products/firekiller-2.webp", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/1.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/2.png", isPrimary: false, sortOrder: 3 },
      ],
    },
    // ── FireKiller × 3 ──────────────────────────────────
    {
      name: "FireKiller — 3 Units",
      slug: "firekiller-3",
      description: "Three extinguishers — whole-home protection or equip your fleet.",
      shortDesc: "The 3-unit pack gives you complete coverage.",
      longDescription: "The 3-unit pack gives you complete coverage. Place one in every room or equip multiple vehicles. The best value with the biggest savings — protect your family without leaving any blind spots.",
      price: 2397,
      originalPrice: 2997,
      gstRate: 0.18,
      sku: "FK-3",
      stock: 100,
      isActive: true,
      isFeatured: false,
      badge: "Best Value",
      weight: 1.5,
      dimensions: "28 × 9 cm (each)",
      packSize: 3,
      productLine: "firekiller",
      categoryLabel: "Home & Car Safety",
      categoryId: homeCat.id,
      features: ["Three extinguishers for maximum safety", "Biggest savings on per-unit cost", "Zero maintenance for 5 years each", "One-hand squeeze operation", "Three wall-mount brackets included", "ISI certified & BIS approved"],
      specifications: { Quantity: "3 × FireKiller", Weight: "500 g per unit", Type: "Clean Agent (ABC + Electrical)", Range: "2-3 meters", "Discharge Time": "8-10 seconds", "Shelf Life": "5 years", Certifications: "ISI, BIS, CE" },
      video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
      images: [
        { url: "/images/products/firekiller-3.webp", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/firekiller-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/1.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/2.png", isPrimary: false, sortOrder: 3 },
      ],
    },
    // ── PanSafe × 1 ─────────────────────────────────────
    {
      name: "PanSafe Sachet — 1 Pc",
      slug: "pansafe-1",
      description: "Single fire suppression sachet — toss into a burning pan, fire goes out instantly.",
      shortDesc: "Revolutionary throw-and-forget fire sachet.",
      longDescription: "PanSafe is a revolutionary throw-and-forget fire sachet for cooking oil fires — the #1 cause of kitchen fires in India. Simply toss into the burning pan; it bursts on contact, instantly suppressing the fire. No aiming, no pins, no panic.",
      price: 899,
      originalPrice: 1149,
      gstRate: 0.18,
      sku: "PS-1",
      stock: 500,
      isActive: true,
      isFeatured: true,
      badge: "Starter",
      weight: 0.1,
      dimensions: "15 × 10 cm",
      packSize: 1,
      productLine: "pansafe",
      categoryLabel: "Kitchen Safety",
      categoryId: kitchenCat.id,
      features: ["Just throw into burning pan — that's it", "Activates on contact with fire", "Specifically made for cooking oil fires", "Child & elderly friendly - no training needed", "Compact - fits in a kitchen drawer"],
      specifications: { Quantity: "1 × PanSafe Sachet", Weight: "100 g", Type: "Kitchen Oil Fire Suppression", Activation: "Automatic on contact", "Shelf Life": "3 years", Certifications: "ISI, NABL tested" },
      video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
      images: [
        { url: "/images/products/p1.png", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/pansafe-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/3.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/4.png", isPrimary: false, sortOrder: 3 },
      ],
    },
    // ── PanSafe × 3 ─────────────────────────────────────
    {
      name: "PanSafe Sachet — 3 Pcs",
      slug: "pansafe-3",
      description: "Pack of 3 sachets — months of kitchen protection with backups ready.",
      shortDesc: "Three sachets for extended protection.",
      longDescription: "The 3-pack keeps your kitchen protected long-term. Keep one by the stove, one in the drawer, and one spare. Ideal for families that cook daily with oil.",
      price: 2427,
      originalPrice: 3447,
      gstRate: 0.18,
      sku: "PS-3",
      stock: 300,
      isActive: true,
      isFeatured: true,
      badge: "Best Seller",
      weight: 0.3,
      dimensions: "15 × 10 cm (each)",
      packSize: 3,
      productLine: "pansafe",
      categoryLabel: "Kitchen Safety",
      categoryId: kitchenCat.id,
      features: ["Three sachets for extended protection", "Save vs buying individually", "Activates on contact with fire", "Child & elderly friendly - no training needed", "Perfect housewarming gift"],
      specifications: { Quantity: "3 × PanSafe Sachet", Weight: "100 g per sachet", Type: "Kitchen Oil Fire Suppression", Activation: "Automatic on contact", "Shelf Life": "3 years", Certifications: "ISI, NABL tested" },
      video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
      images: [
        { url: "/images/products/pansafe-3.webp", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/pansafe-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/3.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/4.png", isPrimary: false, sortOrder: 3 },
      ],
    },
    // ── PanSafe × 5 ─────────────────────────────────────
    {
      name: "PanSafe Sachet — 5 Pcs",
      slug: "pansafe-5",
      description: "Mega pack of 5 sachets — share with family or stock up for the year.",
      shortDesc: "The ultimate kitchen safety investment.",
      longDescription: "The 5-pack is the ultimate kitchen safety investment. Keep sachets in your kitchen, give extras to parents or neighbours. The most affordable fire protection you can buy.",
      price: 3820,
      originalPrice: 5745,
      gstRate: 0.18,
      sku: "PS-5",
      stock: 200,
      isActive: true,
      isFeatured: false,
      badge: "Family Pack",
      weight: 0.5,
      dimensions: "15 × 10 cm (each)",
      packSize: 5,
      productLine: "pansafe",
      categoryLabel: "Kitchen Safety",
      categoryId: kitchenCat.id,
      features: ["Five sachets for maximum coverage", "Best per-unit value", "Share with family & neighbours", "Activates on contact with fire", "3-year shelf life"],
      specifications: { Quantity: "5 × PanSafe Sachet", Weight: "100 g per sachet", Type: "Kitchen Oil Fire Suppression", Activation: "Automatic on contact", "Shelf Life": "3 years", Certifications: "ISI, NABL tested" },
      video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
      images: [
        { url: "/images/products/pansafe-5.webp", isPrimary: true, sortOrder: 0 },
        { url: "/images/products/pansafe-1.webp", isPrimary: false, sortOrder: 1 },
        { url: "/images/products/3.png", isPrimary: false, sortOrder: 2 },
        { url: "/images/products/4.png", isPrimary: false, sortOrder: 3 },
      ],
    },
  ];

  for (const { images, specifications, ...productData } of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: { ...productData, specifications },
      create: { ...productData, specifications },
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
