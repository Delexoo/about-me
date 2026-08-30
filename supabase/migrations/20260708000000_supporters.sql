-- Supporters leaderboard schema (issnyfbepoqnpkrgowdl)
-- Idempotent. Matches SUPPORTERS_DB.sql.

create extension if not exists pgcrypto;

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

create index if not exists supporters_total_idx
  on public.supporters (total_cents desc);

create index if not exists donations_supporter_id_idx
  on public.donations (supporter_id);
