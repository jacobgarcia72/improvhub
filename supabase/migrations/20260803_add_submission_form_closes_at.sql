alter table public.submission_forms
  add column if not exists closes_at text;
