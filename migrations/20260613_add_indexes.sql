-- Migration: Add indexes to speed up location/theatre filtered queries
-- Run in Supabase SQL editor or via psql.

-- 1) Speed up city/state equality lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_troupes_city_state_lower ON troupes (lower(city), lower(state));
CREATE INDEX IF NOT EXISTS idx_users_city_state_lower ON users (lower(city), lower(state));

-- 2) GIN indexes for array overlap queries on `theatres` (text[])
CREATE INDEX IF NOT EXISTS idx_troupes_theatres_gin ON troupes USING GIN (theatres);
CREATE INDEX IF NOT EXISTS idx_users_theatres_gin ON users USING GIN (theatres);

-- 3) Composite/partial indexes combining role-boolean + location to support queries
-- (adjust column names if your DB uses different names)
CREATE INDEX IF NOT EXISTS idx_troupes_looking_for_players_city_state ON troupes (looking_for_players, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS idx_troupes_looking_for_coach_city_state ON troupes (looking_for_coach, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS idx_troupes_looking_for_musician_city_state ON troupes (looking_for_musician, lower(city), lower(state));

CREATE INDEX IF NOT EXISTS idx_users_open_to_join_city_state ON users (open_to_join_troupe, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS idx_users_open_to_coach_city_state ON users (open_to_coach_troupe, lower(city), lower(state));
CREATE INDEX IF NOT EXISTS idx_users_open_to_accompany_city_state ON users (open_to_accompany_troupe, lower(city), lower(state));

-- Notes:
-- - GIN on text[] makes `.overlaps()` and `@>` / `<@` operations much faster.
-- - Expression indexes on lower(...) speed up case-insensitive comparisons.
-- - Composite indexes including the boolean flag reduce rows scanned for queries that filter by role and city/state.
-- - Test with EXPLAIN ANALYZE after applying indexes to ensure queries use them.

-- Example: verify with psql
-- psql "postgresql://<user>:<pass>@<host>:5432/<db>" -c "EXPLAIN ANALYZE SELECT * FROM troupes WHERE looking_for_players = true AND lower(city) = 'seattle' AND lower(state) = 'wa' LIMIT 10;"
