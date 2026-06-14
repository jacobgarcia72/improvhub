Applying Supabase migrations (local)

1) Ensure you have the Supabase CLI installed and you're logged in:

   npm install -g supabase
   supabase login

2) The migrations are stored under `supabase/migrations/` and include:

   - supabase/migrations/20260613_add_indexes.sql

3) To apply the migrations locally, run one of the scripts:

   # macOS / WSL / Linux
   bash scripts/apply-supabase-migrations.sh

   # Windows (cmd)
   scripts\apply-supabase-migrations.cmd

4) Alternatively, run directly:

   supabase db push

Notes:
- `supabase db push` will apply local schema/migrations to the configured database from your Supabase project.
- If you prefer to run SQL directly, paste `supabase/migrations/20260613_add_indexes.sql` into the Supabase SQL editor.
- Test with `EXPLAIN ANALYZE` after applying the indexes to confirm improved query plans.
