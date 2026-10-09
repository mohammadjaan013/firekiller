// ─── Product Price Updater + Combo insert ───────────────
// 1. Updates ONLY price + originalPrice for the 6 known SKUs.
// 2. Inserts the FireKiller + PanSafe combo product (skipped if it already exists).
// Everything else (stock, images of existing products, descriptions, orders) is untouched.
//
//   Dry run (preview only, default):  npx tsx prisma/update-prices.ts
//   Apply the change:                 npx tsx prisma/update-prices.ts --apply
//
// Targets whatever DATABASE_URL points at. NOTE: dotenv loads .env (localhost),
// NOT .env.local - so to update Neon, set the URL explicitly first (PowerShell):
//   $env:DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
//   npx tsx prisma/update-prices.ts --apply
//
// Prices are BASE prices EXCLUDING 18% GST.

import "dotenv/config";
import pg from "pg";

const NEW_PRICES: Record<string, { price: number; originalPrice: number }> = {
  // FireKiller: ₹1,200/unit; 2-pack 10% off, 3-pack 15% off (MRP = 1200 × units)
  "firekiller-1": { price: 1200, originalPrice: 1200 },
  "firekiller-2": { price: 2160, originalPrice: 2400 },
  "firekiller-3": { price: 3060, originalPrice: 3600 },
  "pansafe-1": { price: 666, originalPrice: 999 },
  "pansafe-3": { price: 1800, originalPrice: 2997 },
  "pansafe-5": { price: 2750, originalPrice: 4995 },
};

const COMBO = {
  slug: "combo-firekiller-pansafe",
  name: "Combo - FireKiller + PanSafe",
  description:
    "Get both - 1 FireKiller extinguisher + 1 PanSafe sachet for complete home & kitchen fire protection.",
  shortDesc: "FireKiller + PanSafe together at a combo price.",
  longDescription:
    "Complete fire protection in one box. The FireKiller compact extinguisher handles Class A, B, C and electrical fires anywhere in your home or car, and OustFire's patented PanSafe sachet puts out cooking-oil fires in the kitchen. Save ₹366 compared to buying both separately.",
  price: 1500,
  originalPrice: 1866, // 1200 + 666 bought separately
  sku: "COMBO-FK-PS",
  stock: 100,
  badge: "Combo Offer",
  weight: 0.6,
  dimensions: "28 × 9 cm + 15 × 10 cm",
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
  video: "https://www.youtube.com/embed/OvkMlBMoLFQ",
  categoryLabel: "Home & Kitchen Safety",
  categorySlug: "home-safety", // legacy "combo-packs" category is deleted by seed.ts
  images: [
    { url: "/images/products/f30.png", isPrimary: true },
    { url: "/images/products/p10.png", isPrimary: false },
    { url: "/images/products/firekiller-1.webp", isPrimary: false },
    { url: "/images/products/pansafe-1.webp", isPrimary: false },
  ],
};

const APPLY = process.argv.includes("--apply");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Prisma generates cuids app-side; any unique text id is valid for the column.
const newId = () => "c" + crypto.randomUUID().replace(/-/g, "");

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  console.log(`DB host : ${new URL(process.env.DATABASE_URL).host}`);
  console.log(`Mode    : ${APPLY ? "APPLY (will write)" : "DRY RUN (read-only)"}\n`);

  const { rows } = await pool.query<{
    slug: string;
    price: number;
    originalPrice: number | null;
  }>(`SELECT slug, price, "originalPrice" FROM products ORDER BY slug`);

  console.log(`Rows in products table : ${rows.length}`);
  const targets = rows.filter((r) => r.slug in NEW_PRICES);
  console.log(`Rows that will change  : ${targets.length}\n`);

  console.log("slug                       price (old -> new)      MRP (old -> new)");
  console.log("─────────────────────────────────────────────────────────────────────");
  for (const r of rows) {
    const n = NEW_PRICES[r.slug];
    if (!n) {
      console.log(`${r.slug.padEnd(26)} UNCHANGED (not in scope), price=${r.price}`);
      continue;
    }
    console.log(
      `${r.slug.padEnd(26)}${String(r.price).padStart(7)} -> ${String(n.price).padEnd(10)}` +
        `${String(r.originalPrice ?? "-").padStart(7)} -> ${n.originalPrice}`
    );
  }

  const missing = Object.keys(NEW_PRICES).filter((s) => !rows.some((r) => r.slug === s));
  if (missing.length) console.log(`\n⚠  Not found in DB (skipped): ${missing.join(", ")}`);

  const comboExists = rows.some((r) => r.slug === COMBO.slug);
  const { rows: cat } = await pool.query<{ id: string }>(
    `SELECT id FROM categories WHERE slug = $1`,
    [COMBO.categorySlug]
  );
  console.log(
    `\nCombo "${COMBO.slug}": ${
      comboExists
        ? "already exists - will be skipped"
        : `will be INSERTED at ₹${COMBO.price} (MRP ₹${COMBO.originalPrice})`
    }`
  );
  if (!comboExists && cat.length === 0) {
    throw new Error(`Category "${COMBO.categorySlug}" not found - cannot insert combo`);
  }

  if (!APPLY) {
    console.log("\nDry run only - nothing was written. Re-run with --apply to commit.");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let updated = 0;
    for (const [slug, n] of Object.entries(NEW_PRICES)) {
      const res = await client.query(
        `UPDATE products
            SET price = $1, "originalPrice" = $2, "updatedAt" = NOW()
          WHERE slug = $3`,
        [n.price, n.originalPrice, slug]
      );
      updated += res.rowCount ?? 0;
    }
    if (updated !== targets.length) {
      throw new Error(
        `Expected to update ${targets.length} rows but updated ${updated} - rolling back`
      );
    }

    if (!comboExists) {
      const comboId = newId();
      await client.query(
        `INSERT INTO products (
           id, name, slug, description, "shortDesc", "longDescription",
           price, "originalPrice", "gstRate", sku, stock, "isActive", "isFeatured",
           badge, weight, dimensions, features, specifications, video,
           "packSize", "productLine", "categoryLabel", "categoryId", "createdAt", "updatedAt"
         ) VALUES (
           $1, $2, $3, $4, $5, $6,
           $7, $8, 0.18, $9, $10, true, true,
           $11, $12, $13, $14, $15, $16,
           1, 'combo', $17, $18, NOW(), NOW()
         )`,
        [
          comboId, COMBO.name, COMBO.slug, COMBO.description, COMBO.shortDesc, COMBO.longDescription,
          COMBO.price, COMBO.originalPrice, COMBO.sku, COMBO.stock,
          COMBO.badge, COMBO.weight, COMBO.dimensions, COMBO.features,
          JSON.stringify(COMBO.specifications), COMBO.video,
          COMBO.categoryLabel, cat[0].id,
        ]
      );
      for (const [i, img] of COMBO.images.entries()) {
        await client.query(
          `INSERT INTO product_images (id, url, "isPrimary", "sortOrder", "productId")
           VALUES ($1, $2, $3, $4, $5)`,
          [newId(), img.url, img.isPrimary, i, comboId]
        );
      }
      console.log(`\n➕ Combo inserted (id ${comboId}) with ${COMBO.images.length} images.`);
    }

    await client.query("COMMIT");
    console.log(`\n✅ Committed. ${updated} prices updated.`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  // Verification read-back
  const { rows: after } = await pool.query(
    `SELECT slug, price, "originalPrice" FROM products
      WHERE slug = ANY($1) ORDER BY slug`,
    [[...Object.keys(NEW_PRICES), COMBO.slug]]
  );
  console.log("\nVerification:");
  for (const r of after) console.log(`  ${r.slug.padEnd(26)} ₹${r.price}  (MRP ₹${r.originalPrice})`);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
