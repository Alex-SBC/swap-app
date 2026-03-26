-- Couples table
create table if not exists couples (
  id text primary key,
  user_a_name text not null,
  user_a_avatar text not null,
  user_b_name text,
  user_b_avatar text,
  linked boolean default false,
  created_at timestamptz default now()
);

-- Users table (local user state per device)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text not null,
  couple_id text references couples(id),
  role text check (role in ('a', 'b')),
  xp integer default 0,
  level integer default 1,
  created_at timestamptz default now()
);

-- Swaps table
create table if not exists swaps (
  id uuid primary key default gen_random_uuid(),
  couple_id text references couples(id),
  created_by text not null,
  want_cat text not null,
  want_title text not null,
  offer_cat text not null,
  offer_title text not null,
  deadline text,
  status text default 'pending' check (status in ('pending', 'active', 'completed', 'declined', 'countered')),
  counter_want_cat text,
  counter_want_title text,
  counter_offer_cat text,
  counter_offer_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- XP / achievements table
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  couple_id text references couples(id),
  user_role text not null,
  achievement text not null,
  unlocked_at timestamptz default now()
);

-- Enable realtime on swaps
alter publication supabase_realtime add table swaps;

-- RLS: allow public access for MVP (no auth)
alter table couples enable row level security;
alter table users enable row level security;
alter table swaps enable row level security;
alter table achievements enable row level security;

create policy "public_all" on couples for all using (true) with check (true);
create policy "public_all" on users for all using (true) with check (true);
create policy "public_all" on swaps for all using (true) with check (true);
create policy "public_all" on achievements for all using (true) with check (true);
