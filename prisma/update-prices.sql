-- ─── Product price update (base prices, EXCLUDING 18% GST) ───
-- Paste into the Neon SQL Editor. Run step by step.

-- STEP 1 — preview: what is there now vs what it will become
SELECT p.slug,
       p.price          AS current_price,
       n.price          AS new_price,
       p."originalPrice" AS current_mrp,
       n.mrp            AS new_mrp
FROM products p
JOIN (VALUES
  ('firekiller-1', 1080, 1350),
  ('firekiller-2', 1990, 2700),
  ('firekiller-3', 2700, 4050),
  ('pansafe-1',     666,  999),
  ('pansafe-3',    1800, 2997),
  ('pansafe-5',    2750, 4995)
) AS n(slug, price, mrp) ON n.slug = p.slug
ORDER BY p.slug;
-- Expect exactly 6 rows. If fewer, a slug is missing — stop and check.

-- STEP 2 — apply (transactional; UPDATE ... FROM touches only the 6 matched rows)
BEGIN;

UPDATE products AS p
   SET price           = n.price,
       "originalPrice" = n.mrp,
       "updatedAt"     = NOW()
  FROM (VALUES
    ('firekiller-1', 1080::double precision, 1350::double precision),
    ('firekiller-2', 1990,                   2700),
    ('firekiller-3', 2700,                   4050),
    ('pansafe-1',     666,                    999),
    ('pansafe-3',    1800,                   2997),
    ('pansafe-5',    2750,                   4995)
  ) AS n(slug, price, mrp)
 WHERE p.slug = n.slug;
-- Check the reported row count is 6, then:

COMMIT;
-- (or ROLLBACK; if the count was not 6)

-- STEP 3 — verify
SELECT slug, sku, price, "originalPrice", "gstRate", "updatedAt"
FROM products
ORDER BY slug;
