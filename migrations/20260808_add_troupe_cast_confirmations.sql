create table if not exists troupe_cast_confirmations (
  user_id text not null references users(id) on delete cascade,
  troupe_id text not null references troupes(id) on delete cascade,
  show_id text not null references shows(id) on delete cascade,
  date_time text not null,
  confirmed boolean,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, troupe_id, show_id, date_time)
);

grant select, insert, update, delete on table public.troupe_cast_confirmations to service_role;
