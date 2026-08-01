create table if not exists demographics (
  user_id text primary key references users(id) on delete cascade,
  gender_identity text,
  orientation text,
  ethnicity text,
  updated_at text not null
);

create table if not exists submission_forms (
  id text primary key,
  owner_type text not null,
  owner_id text not null,
  title text not null,
  description text,
  questions jsonb not null,
  requires_sign_in boolean not null default true,
  has_audition boolean not null,
  audition_dates_tbd boolean not null,
  audition_slots jsonb not null,
  created_by text not null references users(id) on delete cascade,
  updated_at text not null,
  unique(owner_type, owner_id)
);

create table if not exists submission_form_submissions (
  id text primary key,
  form_id text not null references submission_forms(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  contact_email text,
  answers jsonb not null,
  audition_availability text[] not null,
  submitted_at text not null
);

create unique index if not exists submission_form_submissions_user_idx
  on submission_form_submissions(form_id, user_id)
  where user_id is not null;

create unique index if not exists submission_form_submissions_email_idx
  on submission_form_submissions(form_id, lower(contact_email))
  where user_id is null and contact_email is not null;

grant select, insert, update, delete on table public.demographics to service_role;
grant select, insert, update, delete on table public.submission_forms to service_role;
grant select, insert, update, delete on table public.submission_form_submissions to service_role;
