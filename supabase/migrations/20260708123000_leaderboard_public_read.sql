-- Public leaderboard reads (browser anon / publishable key).
-- Revokes write access; selects only display fields for paid supporters.

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
