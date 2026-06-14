-- ============================================================
-- Restrict profiles.email from being readable by other users
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Drop the old "anyone can read every profile (incl. email)" policy.
drop policy if exists "Users can read all profiles" on public.profiles;

-- Full rows (including email) are only readable by their owner.
create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);

-- Safe, non-PII profile info (no email) for displaying other users' names.
-- Owned by the table owner, so it bypasses the "own row only" RLS policy
-- above while only ever exposing these three columns.
create or replace view public.profile_public as
  select id, display_name, role from public.profiles;

grant select on public.profile_public to anon, authenticated;
