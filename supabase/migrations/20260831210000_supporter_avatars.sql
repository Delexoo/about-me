-- Supporter profile photos (public read via storage + avatar_url on leaderboard)

alter table public.supporters
  add column if not exists avatar_url text;

revoke all on table public.supporters from anon, authenticated;
grant select (display_name, note, total_cents, social_url, avatar_url)
  on table public.supporters to anon, authenticated;
grant all on table public.supporters to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'supporter-avatars',
  'supporter-avatars',
  true,
  65536,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "supporter_avatars_public_read" on storage.objects;
create policy "supporter_avatars_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'supporter-avatars');
