-- ════════════════════════════════════════════════════════════════════════
--  PREORDER WITH OMA — SECURITY HARDENING SQL
--  Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ════════════════════════════════════════════════════════════════════════

-- 1. LOCK DOWN THE "Product" TABLE
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON "Product";
DROP POLICY IF EXISTS "anon_insert_products" ON "Product";
DROP POLICY IF EXISTS "anon_update_products" ON "Product";
DROP POLICY IF EXISTS "anon_delete_products" ON "Product";
DROP POLICY IF EXISTS "service_role_all_products" ON "Product";

CREATE POLICY "service_role_full_access_products"
  ON "Product"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. CREATE THE "AuditLog" TABLE
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id          TEXT PRIMARY KEY,
  action      TEXT NOT NULL,
  targetType  TEXT NOT NULL DEFAULT '',
  targetId    TEXT,
  ip          TEXT NOT NULL DEFAULT '',
  userAgent   TEXT NOT NULL DEFAULT '',
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb,
  createdAt   TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" FORCE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_auditlog"
  ON "AuditLog"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS "auditlog_createdat_idx" ON "AuditLog" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "auditlog_action_idx"    ON "AuditLog" ("action");

-- 3. VERIFY (run separately after)
-- SELECT relname, relrowsecurity, relforcerowsecurity
-- FROM pg_class
-- WHERE relname IN ('Product', 'AuditLog');