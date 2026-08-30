-- Public leaderboard reads from the browser (anon key).
-- Run once in Supabase → SQL Editor.

alter table supporters enable row level security;

revoke all on table supporters from anon;
grant select (display_name, note, total_cents, social_url) on table supporters to anon;

drop policy if exists "leaderboard_public_read" on supporters;
create policy "leaderboard_public_read"
  on supporters
  for select
  to anon
  using (total_cents > 0);
