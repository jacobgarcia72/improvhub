-- Supabase PostgreSQL schema for ImprovHub

create table if not exists users (
  id text primary key,
  uid uuid,
  join_date text not null,
  first_name text not null,
  last_name text,
  pronouns text,
  bio text,
  theatres text[],
  city text,
  state text,
  website text,
  image text,
  cover_image text,
  open_to_join_troupe boolean,
  open_to_accompany_troupe boolean,
  open_to_coach_troupe boolean
);

create table if not exists sessions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  expires_at integer not null
);

create table if not exists user_roles (
  user_id text not null references users(id) on delete cascade,
  player boolean,
  tech boolean,
  director boolean,
  musician boolean,
  coach boolean
);

create table if not exists admins (
  user_id text primary key references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists theatres (
  id text primary key,
  name text not null,
  address text,
  city text not null,
  state text not null,
  zipcode text not null,
  website text,
  image text,
  creator_id text,
  admins text[] default '{}'
);

create table if not exists theatre_claims (
  id uuid primary key default gen_random_uuid(),
  theatre_id text not null references theatres(id) on delete cascade,
  claimant_id text not null references users(id) on delete cascade,
  proof text not null,
  status text not null default 'pending',
  claimed_at timestamptz not null default now(),
  reviewed_by text references users(id) on delete set null,
  reviewed_at timestamptz,
  constraint theatre_claims_status_check check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists theatre_claims_theatre_id_idx
on theatre_claims(theatre_id);

create index if not exists theatre_claims_status_idx
on theatre_claims(status);

create unique index if not exists theatre_claims_pending_claimant_idx
on theatre_claims(theatre_id, claimant_id)
where status = 'pending';

create or replace function approve_theatre_claim(
  p_claim_id uuid,
  p_reviewer_id text
)
returns theatre_claims
language plpgsql
security definer
set search_path = public
as $$
declare
  claim_record theatre_claims;
  updated_count integer;
begin
  if not exists (select 1 from admins where user_id = p_reviewer_id) then
    raise exception 'Reviewer is not an admin';
  end if;

  select *
  into claim_record
  from theatre_claims
  where id = p_claim_id
    and status = 'pending'
  for update;

  if not found then
    return null;
  end if;

  update theatres
  set
    admins = array[claim_record.claimant_id],
    creator_id = coalesce(creator_id, claim_record.claimant_id)
  where id = claim_record.theatre_id
    and coalesce(cardinality(admins), 0) = 0;

  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    update theatre_claims
    set
      status = 'rejected',
      reviewed_by = p_reviewer_id,
      reviewed_at = now()
    where id = claim_record.id;
    return null;
  end if;

  update theatre_claims
  set
    status = 'approved',
    reviewed_by = p_reviewer_id,
    reviewed_at = now()
  where id = claim_record.id
  returning * into claim_record;

  update theatre_claims
  set
    status = 'rejected',
    reviewed_by = p_reviewer_id,
    reviewed_at = now()
  where theatre_id = claim_record.theatre_id
    and status = 'pending'
    and id <> claim_record.id;

  return claim_record;
end;
$$;

create table if not exists shows (
  id text primary key,
  creator_id text not null,
  admins text[] not null,
  title text not null,
  recurring_day text,
  recurring_time text,
  cadence text,
  description text,
  theatre text,
  city text,
  state text,
  price numeric,
  door_price numeric,
  tickets_url text,
  image text,
  photo_credit text,
  runtime text,
  notes text
);

create table if not exists show_occurrences (
  event_id text not null references shows(id) on delete cascade,
  date_time text not null,
  cancelled boolean,
  looking_for_troupes boolean,
  looking_for_players boolean,
  looking_for_directors boolean,
  looking_for_musician boolean,
  looking_for_tech boolean,
  primary key (event_id, date_time)
);

create table if not exists showing_cast (
  name text not null,
  id text,
  role text not null,
  show_id text not null references shows(id) on delete cascade,
  date_time text not null
);

create table if not exists troupe_cast_confirmations (
  user_id text not null references users(id) on delete cascade,
  troupe_id text not null references troupes(id) on delete cascade,
  show_id text not null references shows(id) on delete cascade,
  date_time text not null,
  confirmed boolean,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, troupe_id, show_id, date_time)
);

create table if not exists jams (
  id text primary key,
  creator_id text not null,
  admins text[] not null,
  instructors text[] not null,
  title text not null,
  recurring_day text,
  recurring_time text,
  cadence text,
  description text,
  theatre text,
  city text,
  state text,
  image text,
  photo_credit text,
  runtime text
);

create table if not exists jam_occurrences (
  event_id text not null references jams(id) on delete cascade,
  date_time text not null,
  cancelled boolean,
  primary key (event_id, date_time)
);

create table if not exists workshops (
  id text primary key,
  creator_id text not null,
  admins text[] not null,
  instructors text[] not null,
  title text not null,
  description text,
  theatre text,
  city text,
  state text,
  price numeric,
  tickets_url text,
  image text,
  photo_credit text,
  runtime text
);

create table if not exists workshop_occurrences (
  event_id text not null references workshops(id) on delete cascade,
  date_time text not null,
  cancelled boolean,
  primary key (event_id, date_time)
);

create table if not exists classes (
  id text primary key,
  creator_id text not null,
  admins text[] not null,
  instructors text[] not null,
  title text not null,
  description text,
  theatre text,
  city text,
  state text,
  price numeric,
  tickets_url text,
  image text,
  photo_credit text,
  runtime text
);

create table if not exists class_occurrences (
  event_id text not null references classes(id) on delete cascade,
  date_time text not null,
  cancelled boolean,
  primary key (event_id, date_time)
);

create table if not exists rsvps (
  user_id text not null references users(id) on delete cascade,
  event_id text not null,
  type text not null,
  date_time text,
  status text
);

create table if not exists troupes (
  id text primary key,
  name text not null,
  image text,
  photo_credit text,
  city text,
  state text,
  theatres text[],
  looking_for_players boolean,
  looking_for_coach boolean,
  looking_for_musician boolean,
  description text
);

create table if not exists troupe_members (
  troupe text not null references troupes(id) on delete cascade,
  name text not null,
  id text,
  role text not null,
  date_added text not null,
  added_by text not null,
  confirmed boolean,
  primary key (troupe, name, role, date_added)
);

create table if not exists follows (
  user_id text not null references users(id) on delete cascade,
  follow_id text not null,
  type text not null,
  primary key (user_id, follow_id, type)
);

create table if not exists friendships (
  user1_id text not null references users(id) on delete cascade,
  user2_id text not null references users(id) on delete cascade,
  accepted boolean not null,
  primary key (user1_id, user2_id)
);

create table if not exists topics (
  id text not null,
  title text not null,
  room text not null,
  description text,
  creator text not null,
  date text not null,
  primary key (room, id)
);

create table if not exists posts (
  id text primary key,
  room text not null,
  topic_id text not null,
  post text not null,
  creator text not null,
  date text not null
);

create table if not exists comments (
  id text primary key,
  room text not null,
  topic_id text not null,
  post_id text not null,
  comment text not null,
  creator text not null,
  date text not null
);

create table if not exists news (
  id text primary key,
  date text not null,
  follow_type text not null,
  follow_id text not null,
  news_type text not null,
  news_item_id text not null,
  news_item_date text,
  other_data text
);

create table if not exists feedback (
  id bigint generated by default as identity primary key,
  user_id text not null,
  feedback text not null,
  date text not null
);

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
  what_looking_for text,
  closes_at text,
  questions jsonb not null,
  requires_sign_in boolean not null default true,
  has_audition boolean not null,
  about_audition text,
  audition_location text,
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
  assigned_audition_slot_id text,
  submitted_at text not null
);

create unique index if not exists submission_form_submissions_user_idx
  on submission_form_submissions(form_id, user_id)
  where user_id is not null;

create unique index if not exists submission_form_submissions_email_idx
  on submission_form_submissions(form_id, lower(contact_email))
  where user_id is null and contact_email is not null;

CREATE TABLE if not exists notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  sender text NOT NULL,
  recipients text[],
  type text NOT NULL,
  data text
);

CREATE TABLE if not exists notification_checks (
  user_id uuid PRIMARY KEY,
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE if not exists public.notification_ids (
  user_id uuid,
  notification_id uuid not null references notifications(id) on delete cascade,
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  primary key (user_id, notification_id)
);
alter publication supabase_realtime add table public.notification_ids;
-- 2. (Highly Recommended) Set replica identity to FULL to receive old values on UPDATE and DELETE
alter table public.notification_ids replica identity full;
alter table public.notification_ids enable row level security;

DROP POLICY IF EXISTS "Users can read their own notifications" ON public.notification_ids;
CREATE POLICY "Users can read their own notifications" ON public.notification_ids
TO authenticated
USING ( auth.uid() = user_id );

-- Grant privileges on sessions table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sessions TO service_role;

-- Grant privileges on other tables your app writes to
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admins TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.classes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.class_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.comments TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.feedback TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.demographics TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.follows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.friendships TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jams TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jam_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_ids TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_checks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rsvps TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.showing_cast TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.show_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.submission_forms TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.submission_form_submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.theatres TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.theatre_claims TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.topics TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.troupe_cast_confirmations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.troupes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.troupe_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workshops TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workshop_occurrences TO service_role;
GRANT SELECT ON TABLE public.notification_ids TO authenticated;

-- Grant sequence privileges for auto-incrementing IDs (if used)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_theatre_claim(uuid, text) TO service_role;
