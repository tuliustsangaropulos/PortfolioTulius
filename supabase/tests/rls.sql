-- Run with psql/Supabase CLI in a disposable or staging project after migration
-- and seed. The transaction always rolls back.
\set ON_ERROR_STOP on
begin;
set local role anon;

do $$
declare published_count integer;
declare draft_count integer;
declare private_count integer;
begin
  select count(*) into published_count from public.sections;
  if published_count <> 14 then
    raise exception 'Expected 14 public sections, got %', published_count;
  end if;
  select count(*) into draft_count from public.sections where status='draft';
  if draft_count <> 0 then
    raise exception 'Anon can read % draft sections', draft_count;
  end if;
  select count(*) into private_count from public.media_assets where storage_bucket='portfolio-private';
  if private_count <> 0 then
    raise exception 'Anon can read % private assets', private_count;
  end if;
end $$;

do $$
begin
  begin
    update public.sections set title='RLS attack' where slug='perfil';
    if found then raise exception 'Anon unexpectedly updated a section'; end if;
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.admin_users(user_id,role) values(gen_random_uuid(),'owner');
    raise exception 'Anon unexpectedly promoted a user';
  exception when insufficient_privilege or foreign_key_violation then null;
  end;
end $$;

reset role;

-- Simulate an authenticated user absent from admin_users.
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
set local role authenticated;
do $$
begin
  begin
    update public.sections set title='Common user attack' where slug='perfil';
    if found then raise exception 'Non-admin unexpectedly updated a section'; end if;
  exception when insufficient_privilege then null;
  end;
  if exists(select 1 from public.sections where status <> 'published') then
    raise exception 'Non-admin can read drafts';
  end if;
end $$;

reset role;
rollback;

-- Storage and admin-positive cases require sessions through the Data/Storage API:
-- 1. A real non-admin JWT cannot download portfolio-private or mutate tables.
-- 2. A real admin JWT can CRUD drafts and private files.
-- 3. publish_section exposes the change to anon only after a successful commit.
