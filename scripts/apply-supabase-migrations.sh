#!/usr/bin/env bash
set -euo pipefail

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI not found. Install: npm install -g supabase"
  exit 1
fi

# Ensure you're authenticated: `supabase login`
# This will push local migrations to your configured database
supabase db push

echo "Migrations applied (or pushed) via Supabase CLI."
