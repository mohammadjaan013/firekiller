-- ─── Price update + Combo product (base prices, EXCLUDING 18% GST) ───
-- Paste into the Neon SQL Editor and run ONE STEP AT A TIME.
--
--   FireKiller : 1200 / 2160 (10% off) / 3060 (15% off)   MRP = 1200 × units
--   PanSafe    :  666 / 1800 / 2750                       (unchanged since last update)
--   Combo      : 1500  (1 FireKiller + 1 PanSafe, MRP 1866)
--
-- Safe to re-run: price updates are idempotent, the combo insert is skipped if it already exists.

-- ═══ STEP 0 — sanity checks (read-only) ═══════════════════════════════
SELECT id, slug FROM categories WHERE slug = 'home-safety';
-- Expect exactly 1 row. If 0, STOP - the combo has nowhere to live.

SELECT slug, sku FROM products
 WHERE slug = 'combo-firekiller-pansafe' OR sku = 'COMBO-FK-PS';
-- Expect 0 rows on the first run (1 row means the combo was already added).


-- ═══ STEP 1 — preview: current vs new (read-only) ═════════════════════
SELECT n.slug,
       p.price           AS current_price,
       n.price           AS new_price,
       p."originalPrice" AS current_mrp,
       n.mrp             AS new_mrp,
       CASE WHEN p.id IS NULL THEN 'NEW - will be inserted' ELSE 'update' END AS action
FROM (VALUES
  ('firekiller-1',             1200, 1200),
  ('firekiller-2',             2160, 2400),
  ('firekiller-3',             3060, 3600),
  ('pansafe-1',                 666,  999),
  ('pansafe-3',                1800, 2997),
  ('pansafe-5',                2750, 4995),
  ('combo-firekiller-pansafe', 1500, 1866)
) AS n(slug, price, mrp)
LEFT JOIN products p ON p.slug = n.slug
ORDER BY n.slug;
-- Expect 7 rows: 6 'update' + the combo as 'NEW'. If any of the 6 shows NEW, STOP - a slug is missing.


-- ═══ STEP 2 — apply (single atomic statement) ═════════════════════════
-- A DO block runs as one transaction: if any check fails, RAISE EXCEPTION
-- rolls back EVERYTHING and nothing is written.
DO $$
DECLARE
  n_updated int;
  n_images  int;
  combo_id  text;
BEGIN
  -- 2a. Prices for the 6 existing SKUs
  UPDATE products AS p
     SET price           = n.price,
         "originalPrice" = n.mrp,
         "updatedAt"     = NOW()
    FROM (VALUES
      ('firekiller-1', 1200, 1200),
      ('firekiller-2', 2160, 2400),
      ('firekiller-3', 3060, 3600),
      ('pansafe-1',     666,  999),
      ('pansafe-3',    1800, 2997),
      ('pansafe-5',    2750, 4995)
    ) AS n(slug, price, mrp)
   WHERE p.slug = n.slug;
  GET DIAGNOSTICS n_updated = ROW_COUNT;
  IF n_updated <> 6 THEN
    RAISE EXCEPTION 'Expected 6 price updates, got % - rolled back', n_updated;
  END IF;

  -- 2b. Combo product (skipped if the slug already exists)
  INSERT INTO products (
    id, name, slug, description, "shortDesc", "longDescription",
    price, "originalPrice", "gstRate", sku, stock, "isActive", "isFeatured",
    badge, weight, dimensions, features, specifications, video,
    "packSize", "productLine", "categoryLabel", "categoryId", "createdAt", "updatedAt"
  )
  SELECT
    'c' || replace(gen_random_uuid()::text, '-', ''),
    'Combo - FireKiller + PanSafe',
    'combo-firekiller-pansafe',
    'Get both - 1 FireKiller extinguisher + 1 PanSafe sachet for complete home & kitchen fire protection.',
    'FireKiller + PanSafe together at a combo price.',
    'Complete fire protection in one box. The FireKiller compact extinguisher handles Class A, B, C and electrical fires anywhere in your home or car, and OustFire''s patented PanSafe sachet puts out cooking-oil fires in the kitchen. Save ₹366 compared to buying both separately.',
    1500, 1866, 0.18, 'COMBO-FK-PS', 100, true, true,
    'Combo Offer', 0.6, '28 × 9 cm + 15 × 10 cm',
    ARRAY[
      '1 × FireKiller extinguisher + 1 × PanSafe sachet',
      'Save ₹366 vs buying both separately',
      'Covers electrical, gas & cooking-oil fires',
      'FireKiller: zero maintenance for 5 years',
      'PanSafe: just toss into a burning pan',
      'Wall-mount bracket included'
    ],
    '{"Contents": "1 × FireKiller Extinguisher + 1 × PanSafe Sachet", "FireKiller Weight": "500 g", "PanSafe Weight": "100 g", "FireKiller Shelf Life": "5 years", "PanSafe Shelf Life": "3 years", "Certifications": "FireKiller: ISI, BIS, CE · PanSafe: ISI, NABL tested"}'::jsonb,
    'https://www.youtube.com/embed/OvkMlBMoLFQ',
    1, 'combo', 'Home & Kitchen Safety', c.id, NOW(), NOW()
  FROM categories c
  WHERE c.slug = 'home-safety'
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO combo_id FROM products WHERE slug = 'combo-firekiller-pansafe';
  IF combo_id IS NULL THEN
    RAISE EXCEPTION 'Combo product was not created (home-safety category missing?) - rolled back';
  END IF;

  -- 2c. Combo images (only if it has none yet)
  INSERT INTO product_images (id, url, "isPrimary", "sortOrder", "productId")
  SELECT 'c' || replace(gen_random_uuid()::text, '-', ''), i.url, i.is_primary, i.sort_order, combo_id
  FROM (VALUES
    ('/images/products/f30.png',           true,  0),
    ('/images/products/p10.png',           false, 1),
    ('/images/products/firekiller-1.webp', false, 2),
    ('/images/products/pansafe-1.webp',    false, 3)
  ) AS i(url, is_primary, sort_order)
  WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi."productId" = combo_id);
  GET DIAGNOSTICS n_images = ROW_COUNT;

  RAISE NOTICE 'Done: % prices updated, combo id %, % images added', n_updated, combo_id, n_images;
END $$;


-- ═══ STEP 3 — verify (read-only) ══════════════════════════════════════
SELECT p.slug, p.sku, p.price, p."originalPrice", p."gstRate", p."isActive", p.stock,
       (SELECT count(*) FROM product_images pi WHERE pi."productId" = p.id) AS images,
       p."updatedAt"
FROM products p
ORDER BY p.slug;
-- Expect 7 rows; combo-firekiller-pansafe with price 1500, 4 images.
