-- Supabase PostgreSQL schema for ImprovHub

create table if not exists users (
  id text primary key,
  password text not null,
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
  open_to_join_team boolean,
  open_to_accompany_team boolean,
  open_to_coach_team boolean
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

create table if not exists showings (
  event_id text not null references shows(id) on delete cascade,
  date_time text not null,
  looking_for_teams boolean,
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

create table if not exists rsvps (
  user_id text not null references users(id) on delete cascade,
  show_id text not null references shows(id) on delete cascade,
  date_time text,
  status text
);

create table if not exists teams (
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

create table if not exists team_members (
  team text not null references teams(id) on delete cascade,
  name text not null,
  id text,
  role text not null,
  date_added text not null,
  added_by text not null,
  confirmed boolean,
  primary key (team, name, date_added)
);

create table if not exists follows (
  user_id text not null references users(id) on delete cascade,
  follow_id text not null,
  type text not null,
  following boolean not null,
  primary key (user_id, follow_id, type)
);

-- Grant privileges on sessions table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sessions TO service_role;

-- Grant privileges on other tables your app writes to
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.showings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.showing_cast TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rsvps TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.teams TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.team_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.follows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO service_role;

-- Grant sequence privileges for auto-incrementing IDs (if used)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;