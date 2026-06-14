@echo off
where supabase >nul 2>&1
if errorlevel 1 (
  echo Supabase CLI not found. Install with: npm install -g supabase
  exit /b 1
)

echo Ensure you are logged in: supabase login
supabase db push

echo Migrations applied (or pushed) via Supabase CLI.
