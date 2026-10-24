-- Tulius portfolio CMS. Apply to project zfnrhzplwpjpdljraypt after reviewing
-- existing objects. This migration is additive and does not drop user data.
create extension if not exists pgcrypto;
create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner','editor')),
  created_at timestamptz not null default now()
);

create or replace function private.is_portfolio_admin(check_user uuid default auth.uid())
returns boolean
language sql stable security definer
set search_path = public, pg_catalog
as $$ select exists(select 1 from public.admin_users where user_id = check_user); $$;
revoke all on function private.is_portfolio_admin(uuid) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_portfolio_admin(uuid) to anon, authenticated;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null check (storage_bucket in ('portfolio-public','portfolio-private')),
  storage_path text not null,
  mime_type text not null,
  file_size bigint,
  width integer,
  height integer,
  alt_text text not null default '',
  title text,
  credit text,
  focal_point jsonb not null default '{"x":50,"y":50}'::jsonb,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(storage_bucket, storage_path)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  locale text not null default 'pt-BR',
  description text,
  favicon_media_id uuid references public.media_assets(id) on delete set null,
  seo_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.design_tokens (
  id uuid primary key default gen_random_uuid(),
  token_key text not null unique,
  token_value text not null,
  value_type text not null check (value_type in ('color','font','size','space','radius','motion')),
  scope text not null default 'global',
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  slug text not null,
  title text not null,
  eyebrow text,
  intro text,
  sort_order integer not null check (sort_order > 0),
  layout_variant text not null default 'editorial' check (layout_variant in ('hero','editorial','metrics','timeline','quotes','contact')),
  theme text not null default 'paper' check (theme in ('paper','cream','ink','orange')),
  animation_preset text not null default 'fade-up' check (animation_preset in ('none','fade-in','fade-up','stagger','image-reveal','metric-count')),
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  is_visible boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, slug),
  unique(page_id, sort_order)
);

create table if not exists public.section_panels (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  breakpoint text not null check (breakpoint in ('desktop','mobile')),
  panel_key text not null check (panel_key in ('desktop','mobile-a','mobile-b')),
  theme text not null default 'inherit',
  sort_order integer not null default 1,
  layout_variant text not null default 'inherit',
  style_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section_id, panel_key)
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  block_type text not null check (block_type in ('hero','rich_text','metric','cards','timeline','skills','media','quote','contact','tools')),
  content_json jsonb not null default '{}'::jsonb,
  media_id uuid references public.media_assets(id) on delete set null,
  mobile_panel text not null default 'a' check (mobile_panel in ('a','b')),
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  is_placeholder boolean not null default false,
  editorial_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.block_placements (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.content_blocks(id) on delete cascade,
  panel_id uuid not null references public.section_panels(id) on delete cascade,
  sort_order integer not null default 1,
  layout_variant text not null default 'default',
  style_config jsonb not null default '{}'::jsonb,
  motion_config jsonb not null default '{"preset":"fade-up","duration":520,"delay":0,"distance":18,"once":true}'::jsonb,
  is_visible boolean not null default true,
  unique(block_id, panel_id)
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  target_slug text not null,
  group_name text not null default 'principal',
  sort_order integer not null,
  is_visible boolean not null default true,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date text,
  end_date text,
  description text,
  skills text[] not null default '{}',
  sort_order integer not null,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  editorial_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid references public.career_experiences(id) on delete set null,
  title text not null,
  summary text,
  details text,
  project_status text,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  updated_at timestamptz not null default now()
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete cascade,
  label text not null,
  value_text text not null,
  unit text,
  context text,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  editorial_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  course text not null,
  degree_type text,
  start_date text,
  end_date text,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  updated_at timestamptz not null default now()
);

create table if not exists public.language_levels (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  level_label text not null,
  evidence_note text,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  editorial_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.tool_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tools jsonb not null default '[]'::jsonb,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote_text text not null,
  photo_media_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_channels (
  id uuid primary key default gen_random_uuid(),
  channel_type text not null check (channel_type in ('whatsapp','email','linkedin','location','website')),
  label text not null,
  value text not null,
  url text,
  sort_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_issues (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete cascade,
  field_path text not null,
  description text not null,
  source_a text,
  source_b text,
  status text not null default 'open' check (status in ('open','resolved','wont_fix')),
  resolution text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  snapshot_json jsonb not null,
  actor_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sections_status_order_idx on public.sections(status, sort_order);
create index if not exists content_blocks_section_order_idx on public.content_blocks(section_id, sort_order);
create index if not exists section_panels_section_idx on public.section_panels(section_id);
create index if not exists editorial_issues_status_idx on public.editorial_issues(status);
create index if not exists media_assets_status_idx on public.media_assets(status);
create unique index if not exists navigation_target_slug_idx on public.navigation_items(target_slug);
create unique index if not exists career_company_start_idx on public.career_experiences(company, start_date);
create unique index if not exists education_institution_course_idx on public.education(institution, course);
create unique index if not exists language_name_idx on public.language_levels(language);
create unique index if not exists skill_name_category_idx on public.skills(name, category);
create unique index if not exists tool_category_title_idx on public.tool_categories(title);
create unique index if not exists testimonial_author_idx on public.testimonials(author_name);
create unique index if not exists contact_channel_type_idx on public.contact_channels(channel_type);

create or replace function private.require_portfolio_admin()
returns void
language plpgsql security definer
set search_path = public, pg_catalog
as $$
begin
  if not private.is_portfolio_admin(auth.uid()) then
    raise exception 'portfolio_admin_required' using errcode = '42501';
  end if;
end;
$$;
revoke all on function private.require_portfolio_admin() from public;
grant execute on function private.require_portfolio_admin() to authenticated;

create or replace function public.swap_section_order(section_a uuid, section_b uuid)
returns void
language plpgsql security definer
set search_path = public, private, pg_catalog
as $$
declare
  a public.sections%rowtype;
  b public.sections%rowtype;
  temporary_order integer;
begin
  perform private.require_portfolio_admin();
  select * into a from public.sections where id = section_a for update;
  select * into b from public.sections where id = section_b for update;
  if a.id is null or b.id is null or a.page_id <> b.page_id then
    raise exception 'sections_must_exist_on_same_page';
  end if;
  select coalesce(max(sort_order), 0) + 1000 into temporary_order
  from public.sections where page_id = a.page_id;
  update public.sections set sort_order = temporary_order where id = a.id;
  update public.sections set sort_order = a.sort_order where id = b.id;
  update public.sections set sort_order = b.sort_order where id = a.id;
end;
$$;
revoke all on function public.swap_section_order(uuid, uuid) from public;
grant execute on function public.swap_section_order(uuid, uuid) to authenticated;

create or replace function public.duplicate_section(source_section uuid)
returns uuid
language plpgsql security definer
set search_path = public, private, pg_catalog
as $$
declare
  source public.sections%rowtype;
  new_section uuid;
  source_block public.content_blocks%rowtype;
  new_block uuid;
begin
  perform private.require_portfolio_admin();
  select * into source from public.sections where id = source_section for update;
  if source.id is null then raise exception 'section_not_found'; end if;

  insert into public.sections (
    page_id, slug, title, eyebrow, intro, sort_order, layout_variant, theme,
    animation_preset, status, is_visible
  ) values (
    source.page_id,
    source.slug || '-copia-' || right(replace(gen_random_uuid()::text, '-', ''), 6),
    source.title || ' — cópia',
    source.eyebrow,
    source.intro,
    (select coalesce(max(sort_order), 0) + 1 from public.sections where page_id = source.page_id),
    source.layout_variant,
    source.theme,
    source.animation_preset,
    'draft',
    false
  ) returning id into new_section;

  insert into public.section_panels (
    section_id, breakpoint, panel_key, theme, sort_order, layout_variant, style_config
  )
  select new_section, breakpoint, panel_key, theme, sort_order, layout_variant, style_config
  from public.section_panels where section_id = source.id;

  for source_block in
    select * from public.content_blocks where section_id = source.id order by sort_order
  loop
    insert into public.content_blocks (
      section_id, block_type, content_json, media_id, mobile_panel, sort_order,
      status, is_placeholder, editorial_note
    ) values (
      new_section, source_block.block_type, source_block.content_json,
      source_block.media_id, source_block.mobile_panel, source_block.sort_order,
      'draft', source_block.is_placeholder, source_block.editorial_note
    ) returning id into new_block;

    insert into public.block_placements (
      block_id, panel_id, sort_order, layout_variant, style_config, motion_config, is_visible
    )
    select new_block, new_panel.id, old_placement.sort_order,
      old_placement.layout_variant, old_placement.style_config,
      old_placement.motion_config, old_placement.is_visible
    from public.block_placements old_placement
    join public.section_panels old_panel on old_panel.id = old_placement.panel_id
    join public.section_panels new_panel
      on new_panel.section_id = new_section and new_panel.panel_key = old_panel.panel_key
    where old_placement.block_id = source_block.id;
  end loop;

  return new_section;
end;
$$;
revoke all on function public.duplicate_section(uuid) from public;
grant execute on function public.duplicate_section(uuid) to authenticated;

create or replace function public.publish_section(section_to_publish uuid, allow_placeholders boolean default false)
returns void
language plpgsql security definer
set search_path = public, private, pg_catalog
as $$
declare
  target public.sections%rowtype;
begin
  perform private.require_portfolio_admin();
  select * into target from public.sections where id = section_to_publish for update;
  if target.id is null then raise exception 'section_not_found'; end if;
  if nullif(trim(target.title), '') is null then raise exception 'section_title_required'; end if;
  if not exists(select 1 from public.content_blocks where section_id = target.id and status <> 'archived') then
    raise exception 'section_requires_content';
  end if;
  if not allow_placeholders and exists(
    select 1 from public.content_blocks
    where section_id = target.id and is_placeholder and status <> 'archived'
  ) then
    raise exception 'section_contains_placeholders';
  end if;

  update public.content_blocks
  set status = 'published'
  where section_id = target.id and status in ('draft', 'in_review');
  update public.sections
  set status = 'published', is_visible = true, published_at = now()
  where id = target.id;
end;
$$;
revoke all on function public.publish_section(uuid, boolean) from public;
grant execute on function public.publish_section(uuid, boolean) to authenticated;

create or replace function public.capture_content_change()
returns trigger
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare
  entity uuid;
begin
  if not private.is_portfolio_admin(auth.uid()) then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;
  entity := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into public.content_revisions(entity_type, entity_id, snapshot_json, actor_user_id)
  values (tg_table_name, entity, case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end, auth.uid());
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), lower(tg_op), tg_table_name, entity, jsonb_build_object('source', 'database_trigger'));
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'site_settings','design_tokens','pages','sections','section_panels','content_blocks',
    'block_placements','navigation_items','media_assets','career_experiences',
    'portfolio_projects','metrics','skills','education','language_levels',
    'tool_categories','testimonials','contact_channels','editorial_issues'
  ] loop
    execute format('drop trigger if exists capture_content_change on public.%I', table_name);
    execute format(
      'create trigger capture_content_change after insert or update or delete on public.%I for each row execute function public.capture_content_change()',
      table_name
    );
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'media_assets','site_settings','design_tokens','pages','sections','section_panels',
    'content_blocks','block_placements','navigation_items','career_experiences',
    'portfolio_projects','metrics','skills','education','language_levels','tool_categories',
    'testimonials','contact_channels','editorial_issues','content_revisions','audit_logs','admin_users'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "admin full access" on public.%I', table_name);
    execute format(
      'create policy "admin full access" on public.%I for all to authenticated using (private.is_portfolio_admin(auth.uid())) with check (private.is_portfolio_admin(auth.uid()))',
      table_name
    );
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'media_assets','site_settings','design_tokens','pages','sections','section_panels',
    'content_blocks','block_placements','navigation_items','career_experiences',
    'portfolio_projects','metrics','skills','education','language_levels',
    'tool_categories','testimonials','contact_channels'
  ] loop
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
  end loop;
  foreach table_name in array array[
    'editorial_issues','content_revisions','audit_logs','admin_users'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end $$;
grant usage, select on all sequences in schema public to authenticated;

drop policy if exists "public published site settings" on public.site_settings;
create policy "public published site settings" on public.site_settings for select to anon, authenticated using (status = 'published');
drop policy if exists "public published tokens" on public.design_tokens;
create policy "public published tokens" on public.design_tokens for select to anon, authenticated using (status = 'published');
drop policy if exists "public published pages" on public.pages;
create policy "public published pages" on public.pages for select to anon, authenticated using (status = 'published');
drop policy if exists "public published sections" on public.sections;
create policy "public published sections" on public.sections for select to anon, authenticated using (status = 'published' and is_visible);
drop policy if exists "public section panels" on public.section_panels;
create policy "public section panels" on public.section_panels for select to anon, authenticated using (
  exists(select 1 from public.sections s where s.id = section_id and s.status = 'published' and s.is_visible)
);
drop policy if exists "public published blocks" on public.content_blocks;
create policy "public published blocks" on public.content_blocks for select to anon, authenticated using (
  status = 'published' and exists(select 1 from public.sections s where s.id = section_id and s.status = 'published' and s.is_visible)
);
drop policy if exists "public visible placements" on public.block_placements;
create policy "public visible placements" on public.block_placements for select to anon, authenticated using (
  is_visible and exists(
    select 1 from public.content_blocks b join public.sections s on s.id = b.section_id
    where b.id = block_id and b.status = 'published' and s.status = 'published' and s.is_visible
  )
);
drop policy if exists "public navigation" on public.navigation_items;
create policy "public navigation" on public.navigation_items for select to anon, authenticated using (status = 'published' and is_visible);
drop policy if exists "public media metadata" on public.media_assets;
create policy "public media metadata" on public.media_assets for select to anon, authenticated using (status = 'published' and storage_bucket = 'portfolio-public');

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'career_experiences','portfolio_projects','metrics','skills','education',
    'language_levels','tool_categories','testimonials','contact_channels'
  ] loop
    execute format('drop policy if exists "public published rows" on public.%I', table_name);
    execute format(
      'create policy "public published rows" on public.%I for select to anon, authenticated using (status = ''published'')',
      table_name
    );
  end loop;
end $$;

drop policy if exists "owner may read own admin membership" on public.admin_users;
create policy "owner may read own admin membership" on public.admin_users
for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-public','portfolio-public',true,8000000,array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('portfolio-private','portfolio-private',false,8000000,array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public may view published assets" on storage.objects;
create policy "public may view published assets" on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-public');
drop policy if exists "admins manage portfolio storage" on storage.objects;
create policy "admins manage portfolio storage" on storage.objects for all to authenticated
using (bucket_id in ('portfolio-public','portfolio-private') and private.is_portfolio_admin(auth.uid()))
with check (bucket_id in ('portfolio-public','portfolio-private') and private.is_portfolio_admin(auth.uid()));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'media_assets','site_settings','design_tokens','pages','sections','section_panels',
    'content_blocks','navigation_items','career_experiences','portfolio_projects','metrics',
    'skills','education','language_levels','tool_categories','testimonials','contact_channels'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;
