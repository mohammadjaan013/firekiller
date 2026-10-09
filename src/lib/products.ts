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
  videos?: { src: string; label: string }[];
  inStock: boolean;
}

// ────────────────────────────────────────────────────────
// 2 product lines + 1 combo, 7 SKUs total:
//   FireKiller (extinguisher) → shown in Home & Car
//   PanSafe   (sachet)        → shown in Kitchen
//   Combo (1 FireKiller + 1 PanSafe) → shown in Home & Kitchen
// ────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── FireKiller ×1 ──────────────────────────────────────
  {
    id: 1,
    slug: "firekiller-1",
    name: "FireKiller - 1 Unit",
    price: 1200,
    originalPrice: 1200,
    rating: 4.8,
    reviews: 324,
    badge: "Best Seller",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Single compact fire extinguisher - perfect for a room, office, or car.",
    longDescription:
      "The FireKiller is India's most trusted compact fire extinguisher. Works on Class A, B, C, and electrical fires with zero maintenance for 5 years. Just grab, point, and spray - one-hand operation means anyone in the family can use it. Fits on a shelf, wall mount, or under your car seat.",
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
    images: ["/images/products/f30.png", "/images/products/firekiller-1.webp", "/images/products/1.png", "/images/products/2.png"],
    videos: [
      { src: "https://www.youtube.com/embed/PtLaz7YQ6-A", label: "FireKiller Demo" },
      { src: "https://www.youtube.com/embed/YtKvx5Pn_Vw", label: "FireKiller in Action" },      { src: "https://www.youtube.com/embed/oIspMHiZ1WM", label: "FireKiller Short" },
      { src: "https://www.youtube.com/embed/8BXNCR2GuJ4", label: "Customer Review" },    ],
    inStock: true,
  },

  // ── FireKiller ×2 ──────────────────────────────────────
  {
    id: 2,
    slug: "firekiller-2",
    name: "FireKiller - 2 Units",
    price: 2160,
    originalPrice: 2400,
    rating: 4.9,
    reviews: 189,
    badge: "Popular",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Two extinguishers - cover the bedroom + living room, or equip two cars.",
    longDescription:
      "Cover two critical areas with the FireKiller 2-unit pack. Bedroom + living room, or one per car. Same trusted clean-agent formula, same zero-maintenance promise. Get 10% off with the 2-unit pack - save ₹240.",
    features: [
      "Two extinguishers for multi-area safety",
      "Save ₹240 (10% off) vs buying two single packs",
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
    videos: [
      { src: "https://www.youtube.com/embed/PtLaz7YQ6-A", label: "FireKiller Demo" },
      { src: "https://www.youtube.com/embed/YtKvx5Pn_Vw", label: "FireKiller in Action" },      { src: "https://www.youtube.com/embed/oIspMHiZ1WM", label: "FireKiller Short" },
      { src: "https://www.youtube.com/embed/8BXNCR2GuJ4", label: "Customer Review" },    ],
    inStock: true,
  },

  // ── FireKiller ×3 ──────────────────────────────────────
  {
    id: 3,
    slug: "firekiller-3",
    name: "FireKiller - 3 Units",
    price: 3060,
    originalPrice: 3600,
    rating: 4.9,
    reviews: 112,
    badge: "Best Value",
    categories: ["home", "car"],
    categoryLabel: "Home & Car Safety",
    description:
      "Three extinguishers - whole-home protection or equip your fleet.",
    longDescription:
      "The 3-unit pack gives you complete coverage. Place one in every room or equip multiple vehicles. The best value with the biggest savings - protect your family without leaving any blind spots.",
    features: [
      "Three extinguishers for maximum safety",
      "Save ₹540 (15% off) vs buying three single packs",
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
    videos: [
      { src: "https://www.youtube.com/embed/PtLaz7YQ6-A", label: "FireKiller Demo" },
      { src: "https://www.youtube.com/embed/YtKvx5Pn_Vw", label: "FireKiller in Action" },      { src: "https://www.youtube.com/embed/oIspMHiZ1WM", label: "FireKiller Short" },
      { src: "https://www.youtube.com/embed/8BXNCR2GuJ4", label: "Customer Review" },    ],
    inStock: true,
  },

  // ── PanSafe ×1 ────────────────────────────────────────
  {
    id: 4,
    slug: "pansafe-1",
    name: "PanSafe Sachet - 1 Pc",
    price: 666,
    originalPrice: 999,
    rating: 4.7,
    reviews: 456,
    badge: "Starter",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "OustFire's patented fire suppression sachet - toss into a burning pan, fire goes out instantly.",
    longDescription:
      "PanSafe is an OustFire patented, revolutionary throw-and-forget fire sachet for cooking oil fires - the #1 cause of kitchen fires in India. Simply toss into the burning pan; it bursts on contact, instantly suppressing the fire. No aiming, no pins, no panic.",
    features: [
      "Just throw into burning pan - that's it",
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
    images: ["/images/products/p10.png", "/images/products/pansafe-1.webp", "/images/products/3.png", "/images/products/4.png"],
    videos: [
      { src: "https://www.youtube.com/embed/cF5OFvxHTi0", label: "PanSafe × Vishnu Manohar" },
      { src: "https://www.youtube.com/embed/bX5AV4asYeA", label: "PanSafe in Action" },      { src: "https://www.youtube.com/embed/DgAOQZXSetk", label: "PanSafe Short" },
      { src: "https://www.youtube.com/embed/lRxesFqSU0U", label: "PanSafe Quick Demo" },    ],
    inStock: true,
  },

  // ── PanSafe ×3 ────────────────────────────────────────
  {
    id: 5,
    slug: "pansafe-3",
    name: "PanSafe Sachet - 3 Pcs",
    price: 1800,
    originalPrice: 2997,
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "Pack of 3 OustFire patented sachets - months of kitchen protection with backups ready.",
    longDescription:
      "The 3-pack of OustFire's patented PanSafe keeps your kitchen protected long-term. Keep one by the stove, one in the drawer, and one spare. Save ₹198 compared to buying three single sachets. Ideal for families that cook daily with oil.",
    features: [
      "Three sachets for extended protection",
      "Save ₹198 vs buying three single packs",
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
    videos: [
      { src: "https://www.youtube.com/embed/cF5OFvxHTi0", label: "PanSafe × Vishnu Manohar" },
      { src: "https://www.youtube.com/embed/bX5AV4asYeA", label: "PanSafe in Action" },      { src: "https://www.youtube.com/embed/DgAOQZXSetk", label: "PanSafe Short" },
      { src: "https://www.youtube.com/embed/lRxesFqSU0U", label: "PanSafe Quick Demo" },    ],
    inStock: true,
  },

  // ── PanSafe ×5 ────────────────────────────────────────
  {
    id: 6,
    slug: "pansafe-5",
    name: "PanSafe Sachet - 5 Pcs",
    price: 2750,
    originalPrice: 4995,
    rating: 4.9,
    reviews: 98,
    badge: "Family Pack",
    categories: ["kitchen"],
    categoryLabel: "Kitchen Safety",
    description:
      "Mega pack of 5 OustFire patented sachets - share with family or stock up for the year.",
    longDescription:
      "The 5-pack of OustFire's patented PanSafe is the ultimate kitchen safety investment. Keep sachets in your kitchen, give extras to parents or neighbours. At ₹550 per sachet, it's the most affordable fire protection you can buy.",
    features: [
      "Five sachets for maximum coverage",
      "Save ₹580 vs buying five single packs",
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
    videos: [
      { src: "https://www.youtube.com/embed/cF5OFvxHTi0", label: "PanSafe × Vishnu Manohar" },
      { src: "https://www.youtube.com/embed/bX5AV4asYeA", label: "PanSafe in Action" },
      { src: "https://www.youtube.com/embed/DgAOQZXSetk", label: "PanSafe Short" },
      { src: "https://www.youtube.com/embed/lRxesFqSU0U", label: "PanSafe Quick Demo" },
    ],
    inStock: true,
  },

  // ── Combo: FireKiller ×1 + PanSafe ×1 ──────────────────
  {
    id: 7,
    slug: "combo-firekiller-pansafe",
    name: "Combo - FireKiller + PanSafe",
    price: 1500,
    originalPrice: 1866, // FireKiller ×1 (1200) + PanSafe ×1 (666) bought separately
    rating: 0,
    reviews: 0,
    badge: "Combo Offer",
    categories: ["home", "kitchen"],
    categoryLabel: "Home & Kitchen Safety",
    description:
      "Get both - 1 FireKiller extinguisher + 1 PanSafe sachet for complete home & kitchen fire protection.",
    longDescription:
      "Complete fire protection in one box. The FireKiller compact extinguisher handles Class A, B, C and electrical fires anywhere in your home or car, and OustFire's patented PanSafe sachet puts out cooking-oil fires in the kitchen - just toss it into the pan. Save ₹366 compared to buying both separately.",
    features: [
      "1 × FireKiller extinguisher + 1 × PanSafe sachet",
      "Save ₹366 vs buying both separately",
      "Covers electrical, gas & cooking-oil fires",
      "FireKiller: zero maintenance for 5 years",
      "PanSafe: just toss into a burning pan",
      "Wall-mount bracket included",
    ],
    specifications: {
      Contents: "1 × FireKiller Extinguisher + 1 × PanSafe Sachet",
      "FireKiller Weight": "500 g",
      "PanSafe Weight": "100 g",
      "FireKiller Shelf Life": "5 years",
      "PanSafe Shelf Life": "3 years",
      Certifications: "FireKiller: ISI, BIS, CE · PanSafe: ISI, NABL tested",
    },
    images: ["/images/products/f30.png", "/images/products/p10.png", "/images/products/firekiller-1.webp", "/images/products/pansafe-1.webp"],
    videos: [
      { src: "https://www.youtube.com/embed/PtLaz7YQ6-A", label: "FireKiller Demo" },
      { src: "https://www.youtube.com/embed/bX5AV4asYeA", label: "PanSafe in Action" },
    ],
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
