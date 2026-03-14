// ─── Shared Product Data ────────────────────────────────
// When you connect to the database, replace this with Prisma queries.
// For now this serves as the single source of truth for all product info.

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  categories: string[];      // e.g. ["home", "car"] or ["kitchen"]
  categoryLabel: string;     // display label
  description: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];          // paths relative to /public
  video?: string;
  inStock: boolean;
}

// ────────────────────────────────────────────────────────
// 2 product lines, 6 SKUs total:
//   FireKiller (extinguisher) → shown in Home & Car
//   PanSafe   (sachet)        → shown in Kitchen
// ────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── FireKiller ×1 ──────────────────────────────────────
  {
    id: 1,
    slug: "firekiller-1",
    name: "FireKiller — 1 Unit",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 324,
    badge: "Best Seller",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Single compact fire extinguisher — perfect for a room, office, or car.",
    longDescription:
      "The FireKiller is India's most trusted compact fire extinguisher. Works on Class A, B, C, and electrical fires with zero maintenance for 5 years. Just grab, point, and spray — one-hand operation means anyone in the family can use it. Fits on a shelf, wall mount, or under your car seat.",
    features: [
      "Works on Oil, Gas & Electrical fires",
      "Zero maintenance for 5 years",
      "One-hand squeeze operation",
      "Non-toxic, eco-friendly agent",
      "Wall-mount bracket included",
      "ISI certified & BIS approved",
    ],
    specifications: {
      Quantity: "1 × FireKiller Extinguisher",
      Weight: "500 g",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "2-3 meters",
      "Discharge Time": "8-10 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE",
    },
    images: ["/images/products/f2.png", "/images/products/firekiller-1.webp", "/images/products/1.png", "/images/products/2.png"],
    video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
    inStock: true,
  },

  // ── FireKiller ×2 ──────────────────────────────────────
  {
    id: 2,
    slug: "firekiller-2",
    name: "FireKiller — 2 Units",
    price: 1598,
    originalPrice: 1998,
    rating: 4.9,
    reviews: 189,
    badge: "Popular",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Two extinguishers — cover the bedroom + living room, or equip two cars.",
    longDescription:
      "Cover two critical areas with the FireKiller 2-unit pack. Bedroom + living room, or one per car. Same trusted clean-agent formula, same zero-maintenance promise. Save over ₹2,000 compared to buying individually.",
    features: [
      "Two extinguishers for multi-area safety",
      "Save ₹2,199 vs buying individually",
      "Zero maintenance for 5 years each",
      "One-hand squeeze operation",
      "Two wall-mount brackets included",
      "ISI certified & BIS approved",
    ],
    specifications: {
      Quantity: "2 × FireKiller Extinguisher",
      Weight: "500 g per unit",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "2-3 meters",
      "Discharge Time": "8-10 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE",
    },
    images: ["/images/products/firekiller-2.webp", "/images/products/firekiller-1.webp", "/images/products/1.png", "/images/products/2.png"],
    video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
    inStock: true,
  },

  // ── FireKiller ×3 ──────────────────────────────────────
  {
    id: 3,
    slug: "firekiller-3",
    name: "FireKiller — 3 Units",
    price: 2397,
    originalPrice: 2997,
    rating: 4.9,
    reviews: 112,
    badge: "Best Value",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Three extinguishers — whole-home protection or equip your fleet.",
    longDescription:
      "The 3-unit pack gives you complete coverage. Place one in every room or equip multiple vehicles. The best value with the biggest savings — protect your family without leaving any blind spots.",
    features: [
      "Three extinguishers for maximum safety",
      "Save ₹3,498 vs buying individually",
      "Zero maintenance for 5 years each",
      "One-hand squeeze operation",
      "Three wall-mount brackets included",
      "ISI certified & BIS approved",
    ],
    specifications: {
      Quantity: "3 × FireKiller Extinguisher",
      Weight: "500 g per unit",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "2-3 meters",
      "Discharge Time": "8-10 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE",
    },
    images: ["/images/products/firekiller-3.webp", "/images/products/firekiller-1.webp", "/images/products/1.png", "/images/products/2.png"],
    video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
    inStock: true,
  },

  // ── PanSafe ×1 ────────────────────────────────────────
  {
    id: 4,
    slug: "pansafe-1",
    name: "PanSafe Sachet — 1 Pc",
    price: 899,
    originalPrice: 1149,
    rating: 4.7,
    reviews: 456,
    badge: "Starter",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "Single fire suppression sachet — toss into a burning pan, fire goes out instantly.",
    longDescription:
      "PanSafe is a revolutionary throw-and-forget fire sachet for cooking oil fires — the #1 cause of kitchen fires in India. Simply toss into the burning pan; it bursts on contact, instantly suppressing the fire. No aiming, no pins, no panic.",
    features: [
      "Just throw into burning pan — that's it",
      "Activates on contact with fire",
      "Specifically made for cooking oil fires",
      "Child & elderly friendly - no training needed",
      // "Non-toxic, food-safe agent",
      "Compact - fits in a kitchen drawer",
    ],
    specifications: {
      Quantity: "1 × PanSafe Sachet",
      Weight: "100 g",
      Type: "Kitchen Oil Fire Suppression",
      Activation: "Automatic on contact",
      "Shelf Life": "3 years",
      Certifications: "ISI, NABL tested",
    },
    images: ["/images/products/p1.png", "/images/products/pansafe-1.webp", "/images/products/3.png", "/images/products/4.png"],
    video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
    inStock: true,
  },

  // ── PanSafe ×3 ────────────────────────────────────────
  {
    id: 5,
    slug: "pansafe-3",
    name: "PanSafe Sachet — 3 Pcs",
    price: 2427,
    originalPrice: 3447,
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "Pack of 3 sachets — months of kitchen protection with backups ready.",
    longDescription:
      "The 3-pack keeps your kitchen protected long-term. Keep one by the stove, one in the drawer, and one spare. Save ₹598 compared to buying individually. Ideal for families that cook daily with oil.",
    features: [
      "Three sachets for extended protection",
      "Save ₹598 vs buying individually",
      "Activates on contact with fire",
      "Child & elderly friendly - no training needed",
      // "Non-toxic, food-safe agent",
      "Perfect housewarming gift",
    ],
    specifications: {
      Quantity: "3 × PanSafe Sachet",
      Weight: "100 g per sachet",
      Type: "Kitchen Oil Fire Suppression",
      Activation: "Automatic on contact",
      "Shelf Life": "3 years",
      Certifications: "ISI, NABL tested",
    },
    images: ["/images/products/pansafe-3.webp", "/images/products/pansafe-1.webp", "/images/products/3.png", "/images/products/4.png"],
    video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
    inStock: true,
  },

  // ── PanSafe ×5 ────────────────────────────────────────
  {
    id: 6,
    slug: "pansafe-5",
    name: "PanSafe Sachet — 5 Pcs",
    price: 3820,
    originalPrice: 5745,
    rating: 4.9,
    reviews: 98,
    badge: "Family Pack",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "Mega pack of 5 sachets — share with family or stock up for the year.",
    longDescription:
      "The 5-pack is the ultimate kitchen safety investment. Keep sachets in your kitchen, give extras to parents or neighbours. At under ₹280 per sachet, it's the most affordable fire protection you can buy.",
    features: [
      "Five sachets for maximum coverage",
      "Save ₹1,096 vs buying individually",
      "Share with family & neighbours",
      "Activates on contact with fire",
      // "Non-toxic, food-safe agent",
      "Best per-unit value",
    ],
    specifications: {
      Quantity: "5 × PanSafe Sachet",
      Weight: "100 g per sachet",
      Type: "Kitchen Oil Fire Suppression",
      Activation: "Automatic on contact",
      "Shelf Life": "3 years",
      Certifications: "ISI, NABL tested",
    },
    images: ["/images/products/pansafe-5.webp", "/images/products/pansafe-1.webp", "/images/products/3.png", "/images/products/4.png"],
    video: "https://www.youtube.com/embed/ZE2HtUVYZfw",
    inStock: true,
  },
];

// Helper to find a product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// Helper to find a product by ID
export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
