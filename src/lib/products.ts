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
  category: string;
  categoryLabel: string;
  description: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];   // paths relative to /public  e.g. "/images/products/fk-500g-1.jpg"
  video?: string;     // optional video path e.g. "/videos/fk-500g-demo.mp4"
  inStock: boolean;
}

// ────────────────────────────────────────────────────────
// HOW TO ADD YOUR PRODUCT IMAGES & VIDEOS:
//
// 1. Put product images in:   public/images/products/
//    Naming convention:        product-slug-1.jpg, product-slug-2.jpg, ...
//    Example:                  public/images/products/firekiller-500g-home-1.jpg
//
// 2. Put product videos in:   public/videos/
//    Example:                  public/videos/firekiller-500g-demo.mp4
//
// 3. Put category images in:  public/images/categories/
//    Example:                  public/images/categories/home-safety.jpg
//
// 4. Put hero images in:      public/images/hero/
//    Example:                  public/images/hero/hero-extinguisher.png
//
// 5. Put brand/logo in:       public/images/brand/
//    Example:                  public/images/brand/firekiller-logo.png
//
// 6. Update the `images` array below with actual paths.
//    Then the product cards / detail pages will show your photos.
// ────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 1,
    slug: "firekiller-500g-home",
    name: "FireKiller 500g Home Extinguisher",
    price: 1499,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 324,
    badge: "Best Seller",
    category: "home",
    categoryLabel: "Home Safety",
    description: "Compact home fire extinguisher for living rooms and bedrooms",
    longDescription:
      "The FireKiller 500g is India's most trusted compact fire extinguisher. Designed specifically for modern homes, it works on Class A, B, C, and electrical fires. No maintenance needed — just grab, point, and spray. Its sleek form factor fits on any shelf or wall mount, blending seamlessly into your home décor while providing instant fire protection.",
    features: [
      "Works on Oil, Gas & Electrical fires",
      "Zero maintenance for 5 years",
      "One-hand squeeze operation",
      "Non-toxic, eco-friendly agent",
      "Wall-mount bracket included",
      "ISI certified & BIS approved",
    ],
    specifications: {
      Weight: "500g",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "2-3 meters",
      "Discharge Time": "8-10 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE",
      Dimensions: "28 × 9 cm",
    },
    images: [
      "/images/products/firekiller-500g-home-1.jpg",
      "/images/products/firekiller-500g-home-2.jpg",
      "/images/products/firekiller-500g-home-3.jpg",
    ],
    video: "/videos/firekiller-500g-demo.mp4",
    inStock: true,
  },
  {
    id: 2,
    slug: "firekiller-1kg-multipurpose",
    name: "FireKiller 1kg Multi-Purpose",
    price: 2199,
    originalPrice: 3499,
    rating: 4.9,
    reviews: 189,
    badge: "Popular",
    category: "home",
    categoryLabel: "Home Safety",
    description: "Large capacity extinguisher for whole-home protection",
    longDescription:
      "The FireKiller 1kg Multi-Purpose is the ultimate whole-home fire protection solution. With double the capacity of the 500g model, it provides extended discharge time and wider coverage. Ideal for large living rooms, offices, workshops, and garages. Same one-hand operation — anyone in your family can use it.",
    features: [
      "Double capacity — 1kg clean agent",
      "Extended 15-second discharge time",
      "Works on all common fire types",
      "Pressure gauge for easy status check",
      "Heavy-duty wall mount included",
      "ISI certified & BIS approved",
    ],
    specifications: {
      Weight: "1kg",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "3-4 meters",
      "Discharge Time": "15-18 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE",
      Dimensions: "35 × 11 cm",
    },
    images: [
      "/images/products/firekiller-1kg-multi-1.jpg",
      "/images/products/firekiller-1kg-multi-2.jpg",
    ],
    inStock: true,
  },
  {
    id: 3,
    slug: "pansafe-kitchen-sachet-3pack",
    name: "PanSafe Kitchen Sachet (Pack of 3)",
    price: 899,
    originalPrice: 1299,
    rating: 4.7,
    reviews: 456,
    badge: "Kitchen Special",
    category: "kitchen",
    categoryLabel: "Kitchen Safety",
    description: "Automatic fire suppression sachets for kitchen oil fires",
    longDescription:
      "PanSafe is a revolutionary throw-and-forget fire sachet designed specifically for cooking oil fires — the #1 cause of kitchen fires in India. Simply toss the sachet into the burning pan and it bursts on contact, instantly suppressing the fire. No aiming, no pins, no panic. Keep one near your stove and stay safe.",
    features: [
      "Just throw into burning pan — that's it",
      "Activates on contact with fire",
      "Specifically made for cooking oil fires",
      "Child & elderly friendly — no training needed",
      "Non-toxic, food-safe agent",
      "Pack of 3 for extended protection",
    ],
    specifications: {
      Weight: "100g per sachet",
      Type: "Kitchen Oil Fire Suppression",
      Activation: "Automatic on contact",
      "Shelf Life": "3 years",
      "Pack Contents": "3 sachets",
      Certifications: "ISI, NABL tested",
    },
    images: [
      "/images/products/pansafe-sachet-1.jpg",
      "/images/products/pansafe-sachet-2.jpg",
      "/images/products/pansafe-sachet-3.jpg",
    ],
    video: "/videos/pansafe-demo.mp4",
    inStock: true,
  },
  {
    id: 4,
    slug: "firekiller-car-compact-500g",
    name: "FireKiller Car Compact 500g",
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 267,
    badge: "New",
    category: "car",
    categoryLabel: "Car Safety",
    description: "Ultra-compact extinguisher that fits under your car seat",
    longDescription:
      "The FireKiller Car Compact is designed to fit perfectly under your car seat or in the glove box. Cars are highly flammable environments — a small electrical fault or engine leak can cause a fire in seconds. This compact extinguisher gives you critical protection when you need it most, whether in traffic or on a highway.",
    features: [
      "Ultra-compact — fits under car seat",
      "Vibration-resistant design for vehicles",
      "Works on fuel, electrical & upholstery fires",
      "Quick-release mounting bracket included",
      "Glow-in-dark handle for emergencies",
      "Tested at extreme temperatures (-20°C to 60°C)",
    ],
    specifications: {
      Weight: "500g",
      Type: "Clean Agent (BC + Electrical)",
      Range: "2 meters",
      "Discharge Time": "8-10 seconds",
      "Shelf Life": "5 years",
      "Temperature Range": "-20°C to 60°C",
      Dimensions: "25 × 8 cm",
    },
    images: [
      "/images/products/firekiller-car-500g-1.jpg",
      "/images/products/firekiller-car-500g-2.jpg",
    ],
    inStock: true,
  },
  {
    id: 5,
    slug: "firekiller-2kg-industrial",
    name: "FireKiller 2kg Industrial",
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviews: 98,
    badge: "Pro",
    category: "home",
    categoryLabel: "Home Safety",
    description: "Heavy-duty extinguisher for large spaces and offices",
    longDescription:
      "The FireKiller 2kg Industrial is built for large spaces — offices, warehouses, workshops, and commercial kitchens. With 2kg of clean agent and a 4-5 meter range, it provides serious fire suppression power while maintaining the same easy-to-use design FireKiller is known for.",
    features: [
      "2kg heavy-duty clean agent",
      "4-5 meter spray range",
      "30-second continuous discharge",
      "Built-in pressure gauge",
      "Heavy-duty wall bracket included",
      "Commercial-grade certification",
    ],
    specifications: {
      Weight: "2kg",
      Type: "Clean Agent (ABC + Electrical)",
      Range: "4-5 meters",
      "Discharge Time": "30 seconds",
      "Shelf Life": "5 years",
      Certifications: "ISI, BIS, CE, UL",
      Dimensions: "42 × 14 cm",
    },
    images: [
      "/images/products/firekiller-2kg-industrial-1.jpg",
      "/images/products/firekiller-2kg-industrial-2.jpg",
    ],
    inStock: true,
  },
  {
    id: 6,
    slug: "pansafe-firekiller-kitchen-combo",
    name: "PanSafe + FireKiller Kitchen Combo",
    price: 2199,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 312,
    badge: "Value Pack",
    category: "kitchen",
    categoryLabel: "Kitchen Safety",
    description: "Complete kitchen fire safety kit with sachet and extinguisher",
    longDescription:
      "The ultimate kitchen fire safety combo. Get a PanSafe sachet (for oil fires) + a FireKiller 500g extinguisher (for everything else) at a massive discount. Cover every fire scenario in your kitchen with one bundle. Perfect gift for housewarming or family safety.",
    features: [
      "PanSafe sachet for oil/grease fires",
      "FireKiller 500g for general kitchen fires",
      "Save ₹1,300 vs buying separately",
      "Covers all kitchen fire scenarios",
      "Perfect housewarming gift",
      "Wall mount included for extinguisher",
    ],
    specifications: {
      Contents: "1× PanSafe Sachet + 1× FireKiller 500g",
      "Total Weight": "600g",
      "Fire Types": "Oil, Gas, Electrical, Solid",
      "Shelf Life": "3-5 years",
      Certifications: "ISI, BIS",
    },
    images: [
      "/images/products/kitchen-combo-1.jpg",
      "/images/products/kitchen-combo-2.jpg",
    ],
    inStock: true,
  },
  {
    id: 7,
    slug: "firekiller-car-mount-kit",
    name: "FireKiller Car Mount Kit",
    price: 1799,
    originalPrice: 2499,
    rating: 4.5,
    reviews: 145,
    badge: "Bundle",
    category: "car",
    categoryLabel: "Car Safety",
    description: "Extinguisher with mounting bracket for secure car installation",
    longDescription:
      "The FireKiller Car Mount Kit comes with a premium 500g car extinguisher and a heavy-duty steel mounting bracket. The bracket bolts securely to your car's floor or seat rail, keeping the extinguisher within arm's reach and rattle-free even on rough roads. Professional installation guide included.",
    features: [
      "500g car extinguisher included",
      "Steel mounting bracket with bolts",
      "Fits all car makes & models",
      "Quick-release mechanism for emergencies",
      "Anti-vibration rubber padding",
      "Installation guide & hardware included",
    ],
    specifications: {
      Contents: "1× FireKiller Car 500g + 1× Mount Kit",
      "Bracket Material": "Powder-coated steel",
      Compatibility: "Universal fit",
      "Total Weight": "750g (with bracket)",
      Certifications: "ISI, BIS",
    },
    images: [
      "/images/products/car-mount-kit-1.jpg",
      "/images/products/car-mount-kit-2.jpg",
    ],
    inStock: true,
  },
  {
    id: 8,
    slug: "firekiller-home-safety-combo",
    name: "FireKiller Home Safety Combo",
    price: 3999,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 201,
    badge: "Best Value",
    category: "combos",
    categoryLabel: "Combo Packs",
    description: "Complete home protection: kitchen + bedroom + car extinguisher",
    longDescription:
      "The FireKiller Home Safety Combo is our most comprehensive protection package. You get a 1kg extinguisher for your home, a PanSafe sachet for your kitchen, and a 500g car compact for your vehicle — all at a massive 33% discount. One purchase protects your entire family across home, kitchen, and car.",
    features: [
      "1kg home extinguisher",
      "PanSafe kitchen sachet",
      "500g car compact extinguisher",
      "Save ₹2,000 vs buying separately",
      "Complete family protection",
      "All wall mounts & brackets included",
    ],
    specifications: {
      Contents: "1× FK 1kg + 1× PanSafe + 1× FK Car 500g",
      "Total Weight": "1.6kg",
      "Fire Types": "All classes covered",
      "Shelf Life": "3-5 years",
      Certifications: "ISI, BIS, CE",
    },
    images: [
      "/images/products/home-combo-1.jpg",
      "/images/products/home-combo-2.jpg",
      "/images/products/home-combo-3.jpg",
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
