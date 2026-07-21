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

create table if not exists theatres (
  id text primary key,
  name text not null,
  address text,
  city text not null,
  state text not null,
  zipcode text not null,
  website text,
  image text,
  admins text[]
);

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
  id text not null,
  room text not null,
  topic_id text not null,
  post text not null,
  creator text not null,
  date text not null,
  primary key (room, topic_id, id),
  foreign key (room, topic_id) references topics(room, id) on delete cascade
);

create table if not exists comments (
  id text not null,
  room text not null,
  topic_id text not null,
  post_id text not null,
  comment text not null,
  creator text not null,
  date text not null,
  primary key (room, topic_id, post_id, id),
  foreign key (room, topic_id, post_id) references posts(room, topic_id, id) on delete cascade
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

CREATE TABLE if not exists notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  sender text NOT NULL,
  recipients text[],
  type text NOT NULL,
  data text
);

CREATE TABLE if not exists notification_checks (
  user_id uuid,
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
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.theatres TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.show_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.showing_cast TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jams TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jam_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workshops TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workshop_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.classes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.class_occurrences TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rsvps TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.troupes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.troupe_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.follows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.friendships TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.topics TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.comments TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_ids TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_checks TO service_role;
GRANT SELECT ON TABLE public.notification_ids TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.feedback TO service_role;

-- Grant sequence privileges for auto-incrementing IDs (if used)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
