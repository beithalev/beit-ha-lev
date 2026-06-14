-- ============================================================
-- Beit Ha Lev — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────

create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text not null,
  display_name  text not null,
  role          text not null check (role in ('student','rabbi','shidduch','admin')),
  created_at    timestamptz default now()
);

alter table public.profiles enable row level security;

-- Full rows (including email) are only readable by their owner.
-- Other users get display name/role via the public.profile_public view below.
create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Rabbi Profiles ───────────────────────────────────────────────────────────

create table if not exists public.rabbi_profiles (
  id                    uuid references public.profiles(id) on delete cascade primary key,
  title                 text,
  bio                   text,
  specialties           text[] default '{}',
  is_accepting_students boolean default true,
  updated_at            timestamptz default now()
);

alter table public.rabbi_profiles enable row level security;
create policy "Anyone can view rabbi profiles" on public.rabbi_profiles for select using (true);
create policy "Rabbis manage their own profile" on public.rabbi_profiles
  for all using (auth.uid() = id);

-- ─── Torah Classrooms ─────────────────────────────────────────────────────────

create table if not exists public.classrooms (
  id                uuid default gen_random_uuid() primary key,
  rabbi_id          uuid references public.profiles(id) on delete cascade not null,
  title             text not null,
  description       text,
  topic             text,
  is_live           boolean default false,
  jitsi_room_name   text unique not null,
  scheduled_at      timestamptz,
  created_at        timestamptz default now()
);

alter table public.classrooms enable row level security;
create policy "Anyone can view classrooms" on public.classrooms for select using (true);
create policy "Rabbis create classrooms" on public.classrooms for insert
  with check (auth.uid() = rabbi_id);
create policy "Rabbis update their classrooms" on public.classrooms for update
  using (auth.uid() = rabbi_id);
create policy "Rabbis delete their classrooms" on public.classrooms for delete
  using (auth.uid() = rabbi_id);

-- ─── Classroom Chat Messages ──────────────────────────────────────────────────

create table if not exists public.classroom_messages (
  id            uuid default gen_random_uuid() primary key,
  classroom_id  uuid references public.classrooms(id) on delete cascade not null,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  content       text not null check (char_length(content) <= 2000),
  created_at    timestamptz default now()
);

alter table public.classroom_messages enable row level security;
create policy "Anyone can read classroom messages" on public.classroom_messages for select using (true);
create policy "Authenticated users can send messages" on public.classroom_messages for insert
  with check (auth.uid() = user_id);

-- ─── Shidduch Profiles ────────────────────────────────────────────────────────

create table if not exists public.shidduch_profiles (
  id              uuid references public.profiles(id) on delete cascade primary key,
  gender          text check (gender in ('male','female','other')),
  age             integer check (age >= 18 and age <= 120),
  background      text,
  denomination    text,
  bio             text,
  questionnaire   jsonb default '{}',
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.shidduch_profiles enable row level security;

-- Only active profiles are visible; no photos, no names — just the profile
create policy "Active shidduch profiles are visible to authenticated users"
  on public.shidduch_profiles for select
  using (auth.role() = 'authenticated' and is_active = true);

create policy "Users manage their own shidduch profile"
  on public.shidduch_profiles for all
  using (auth.uid() = id);

-- ─── Shidduch Matches ────────────────────────────────────────────────────────

create table if not exists public.shidduch_matches (
  id          uuid default gen_random_uuid() primary key,
  user_a      uuid references public.profiles(id) on delete cascade not null,
  user_b      uuid references public.profiles(id) on delete cascade not null,
  score       float not null check (score >= 0 and score <= 1),
  status      text default 'pending' check (status in ('pending','accepted','rejected','expired')),
  created_at  timestamptz default now(),
  constraint no_self_match check (user_a <> user_b)
);

-- Prevent duplicate pairs regardless of order (user_a/user_b can be swapped)
create unique index if not exists unique_match_pair
  on public.shidduch_matches (least(user_a::text, user_b::text), greatest(user_a::text, user_b::text));

alter table public.shidduch_matches enable row level security;
create policy "Users see their own matches"
  on public.shidduch_matches for select
  using (auth.uid() = user_a or auth.uid() = user_b);
create policy "Users update their own matches"
  on public.shidduch_matches for update
  using (auth.uid() = user_a or auth.uid() = user_b);

-- ─── Match Messages ───────────────────────────────────────────────────────────

create table if not exists public.match_messages (
  id          uuid default gen_random_uuid() primary key,
  match_id    uuid references public.shidduch_matches(id) on delete cascade not null,
  sender_id   uuid references public.profiles(id) on delete cascade not null,
  content     text not null check (char_length(content) <= 2000),
  created_at  timestamptz default now()
);

alter table public.match_messages enable row level security;

-- Only parties to the match can see/send messages
create policy "Match parties can read messages"
  on public.match_messages for select
  using (
    exists (
      select 1 from public.shidduch_matches m
      where m.id = match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
        and m.status = 'accepted'
    )
  );

create policy "Match parties can send messages"
  on public.match_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.shidduch_matches m
      where m.id = match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
        and m.status = 'accepted'
    )
  );

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable Realtime for live chat and match messaging
-- In Supabase dashboard: Database → Replication → enable for classroom_messages & match_messages

-- ─── Helper views ─────────────────────────────────────────────────────────────

-- Safe, non-PII profile info (no email) for displaying other users' names.
-- Owned by the table owner, so it bypasses the "own row only" RLS policy above
-- while only ever exposing these three columns.
create or replace view public.profile_public as
  select id, display_name, role from public.profiles;

grant select on public.profile_public to anon, authenticated;

create or replace view public.classroom_list as
  select
    c.*,
    p.display_name as rabbi_name,
    rp.title as rabbi_title,
    (select count(*) from public.classroom_messages m where m.classroom_id = c.id) as message_count,
    0 as participant_count  -- real-time count handled client-side via Jitsi events
  from public.classrooms c
  join public.profiles p on p.id = c.rabbi_id
  left join public.rabbi_profiles rp on rp.id = c.rabbi_id
  order by c.is_live desc, c.created_at desc;
