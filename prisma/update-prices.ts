// ─── Product Price Updater ──────────────────────────────
// Updates ONLY price + originalPrice for the 6 known SKUs.
// Everything else (stock, images, descriptions, orders) is untouched.
//
//   Dry run (preview only, default):  npx tsx prisma/update-prices.ts
//   Apply the change:                 npx tsx prisma/update-prices.ts --apply
//
// Targets whatever DATABASE_URL points at, so to update Neon run:
//   DATABASE_URL="<neon-url>" npx tsx prisma/update-prices.ts --apply
//
// Prices are BASE prices EXCLUDING 18% GST.

import "dotenv/config";
import pg from "pg";

const NEW_PRICES: Record<string, { price: number; originalPrice: number }> = {
  "firekiller-1": { price: 1080, originalPrice: 1350 },
  "firekiller-2": { price: 1990, originalPrice: 2700 },
  "firekiller-3": { price: 2700, originalPrice: 4050 },
  "pansafe-1": { price: 666, originalPrice: 999 },
  "pansafe-3": { price: 1800, originalPrice: 2997 },
  "pansafe-5": { price: 2750, originalPrice: 4995 },
};

const APPLY = process.argv.includes("--apply");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  console.log(`DB host : ${new URL(process.env.DATABASE_URL).host}`);
  console.log(`Mode    : ${APPLY ? "APPLY (will write)" : "DRY RUN (read-only)"}\n`);

  const { rows } = await pool.query<{
    slug: string;
    name: string;
    price: number;
    originalPrice: number | null;
  }>(`SELECT slug, name, price, "originalPrice" FROM products ORDER BY slug`);

  console.log(`Rows in products table : ${rows.length}`);
  const targets = rows.filter((r) => r.slug in NEW_PRICES);
  console.log(`Rows that will change  : ${targets.length}\n`);

  console.log("slug            price (old -> new)      MRP (old -> new)");
  console.log("──────────────────────────────────────────────────────────");
  for (const r of rows) {
    const n = NEW_PRICES[r.slug];
    if (!n) {
      console.log(`${r.slug.padEnd(15)} UNCHANGED (not in scope), price=${r.price}`);
      continue;
    }
    console.log(
      `${r.slug.padEnd(15)}${String(r.price).padStart(7)} -> ${String(n.price).padEnd(10)}` +
        `${String(r.originalPrice ?? "-").padStart(7)} -> ${n.originalPrice}`
    );
  }

  const missing = Object.keys(NEW_PRICES).filter((s) => !rows.some((r) => r.slug === s));
  if (missing.length) console.log(`\n⚠  Not found in DB (skipped): ${missing.join(", ")}`);

  if (!APPLY) {
    console.log("\nDry run only — nothing was written. Re-run with --apply to commit.");
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
        `Expected to update ${targets.length} rows but updated ${updated} — rolling back`
      );
    }
    await client.query("COMMIT");
    console.log(`\n✅ Committed. ${updated} rows updated.`);
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
    [Object.keys(NEW_PRICES)]
  );
  console.log("\nVerification:");
  for (const r of after) console.log(`  ${r.slug.padEnd(15)} ₹${r.price}  (MRP ₹${r.originalPrice})`);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
