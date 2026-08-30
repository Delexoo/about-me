-- Harden existing leaderboard DB: constraints, index, RLS, grants.
-- Applied to issnyfbepoqnpkrgowdl. Does not drop supporter data.

create extension if not exists pgcrypto;

alter table public.supporters
  add column if not exists social_url text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'supporters_total_cents_check'
      and conrelid = 'public.supporters'::regclass
  ) then
    alter table public.supporters
      add constraint supporters_total_cents_check check (total_cents >= 0);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'donations_amount_cents_check'
      and conrelid = 'public.donations'::regclass
  ) then
    alter table public.donations
      add constraint donations_amount_cents_check check (amount_cents > 0);
  end if;
end $$;

create index if not exists supporters_total_idx
  on public.supporters (total_cents desc);

create index if not exists donations_supporter_id_idx
  on public.donations (supporter_id);

revoke all on table public.supporters from anon, authenticated;
revoke all on table public.donations from anon, authenticated;

grant select (display_name, note, total_cents, social_url)
  on table public.supporters to anon, authenticated;

grant all on table public.supporters to service_role;
grant all on table public.donations to service_role;

alter table public.supporters enable row level security;
alter table public.donations enable row level security;

drop policy if exists "leaderboard_public_read" on public.supporters;
create policy "leaderboard_public_read"
  on public.supporters
  for select
  to anon, authenticated
  using (total_cents > 0);
