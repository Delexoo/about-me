-- Canonical supporters leaderboard schema for project rvrrrcsveqpqnmzptxuj (Leaderboard)
-- Safe to re-run. Used by: server.js, netlify/functions/*, browser REST fallback.

create extension if not exists pgcrypto;

-- ── tables ──────────────────────────────────────────────────────────────
create table if not exists public.supporters (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text not null,
  note text,
  social_url text,
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supporters_email_unique unique (email)
);

alter table public.supporters add column if not exists social_url text;

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references public.supporters(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  stripe_payment_intent_id text not null,
  created_at timestamptz not null default now(),
  constraint donations_stripe_payment_intent_id_key unique (stripe_payment_intent_id)
);

-- ── indexes ─────────────────────────────────────────────────────────────
create index if not exists supporters_total_idx
  on public.supporters (total_cents desc);

create index if not exists donations_supporter_id_idx
  on public.donations (supporter_id);

-- ── privileges: lock down browser roles ─────────────────────────────────
revoke all on table public.supporters from anon, authenticated;
revoke all on table public.donations from anon, authenticated;

-- Public leaderboard fields only (no email / ids)
grant select (display_name, note, total_cents, social_url)
  on table public.supporters to anon, authenticated;

-- Backend uses service_role (bypasses RLS); keep full access
grant all on table public.supporters to service_role;
grant all on table public.donations to service_role;

-- ── row level security ──────────────────────────────────────────────────
alter table public.supporters enable row level security;
alter table public.donations enable row level security;

drop policy if exists "leaderboard_public_read" on public.supporters;
create policy "leaderboard_public_read"
  on public.supporters
  for select
  to anon, authenticated
  using (total_cents > 0);

-- No policies on donations for anon/authenticated → no public access
drop policy if exists "donations_deny_all" on public.donations;

-- service_role bypasses RLS; no public write policies on purpose
