# Preorder With Oma — Worklog

---
Task ID: 1
Agent: Main
Task: Integrate Supabase (Postgres + Storage) into the Next.js project

Work Log:
- Updated .env with Supabase placeholder variables (URL, anon key, service role key, database URL)
- Switched Prisma schema from SQLite (`provider = "sqlite"`) to PostgreSQL (`provider = "postgresql"`)
- Installed `@supabase/supabase-js` package
- Created `/src/lib/supabase/server.ts` — server-side Supabase client using SERVICE_ROLE_KEY
- Created `/src/lib/supabase/client.ts` — browser-side Supabase client using ANON_KEY
- Created `/src/app/api/admin/upload/route.ts` — POST handler for file uploads to Supabase Storage, DELETE handler for removing files
- Updated seed.ts for PostgreSQL compatibility (no schema changes needed, cuid works on both)
- Ran `prisma generate` successfully for PostgreSQL provider
- Build passes with zero errors — all routes including `/api/admin/upload` compiled
- Created `supabase-setup.sql` with bucket creation and RLS policies

Stage Summary:
- Supabase is fully wired up in code, waiting for user to fill in .env credentials
- Admin dashboard already had upload UI (file picker + URL fallback) from previous session
- Upload flow: Admin picks file → POST /api/admin/upload → Supabase Storage → returns public URL → saved to product.imageUrl
- User needs to: (1) fill .env, (2) run supabase-setup.sql, (3) run `npx prisma db push`, (4) run `npx prisma db seed`
