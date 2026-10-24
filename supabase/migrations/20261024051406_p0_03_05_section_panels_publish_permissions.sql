-- P0-03/P0-05: create a section with its 3 device panels atomically;
-- validate publish topology; reduce callable privileges of admin RPCs.
create or replace function public.create_section_with_panels(p_page_id uuid)
returns uuid
language plpgsql security definer
set search_path = ''
as $function$
declare
  new_section uuid;
  next_order integer;
begin
  perform private.require_portfolio_admin();
  if p_page_id is null then
    raise exception 'page_required' using errcode = '22023';
  end if;
  -- Serialize section order allocation for the same page.
  perform 1 from public.pages where id = p_page_id for update;
  if not found then
    raise exception 'page_not_found' using errcode = 'P0002';
  end if;
  select coalesce(max(sort_order), 0) + 1 into next_order
  from public.sections where page_id = p_page_id;

  insert into public.sections (
    page_id, slug, title, sort_order,
    layout_variant, theme, status, is_visible
  ) values (
    p_page_id,
    'nova-secao-' || replace(gen_random_uuid()::text, '-', ''),
    'Nova seção', next_order,
    'editorial', 'paper', 'draft', false
  ) returning id into new_section;

  insert into public.section_panels
    (section_id, breakpoint, panel_key, sort_order)
  values
    (new_section, 'desktop', 'desktop', 1),
    (new_section, 'mobile', 'mobile-a', 1),
    (new_section, 'mobile', 'mobile-b', 2);

  return new_section;
end;
$function$;

create or replace function public.publish_section(
  section_to_publish uuid, allow_placeholders boolean default false
)
returns void
language plpgsql security definer
set search_path = ''
as $function$
declare
  target public.sections%rowtype;
begin
  perform private.require_portfolio_admin();
  select * into target from public.sections where id = section_to_publish for update;
  if not found then raise exception 'section_not_found'; end if;
  if nullif(btrim(target.title), '') is null then
    raise exception 'section_title_required';
  end if;
  if (
    select count(*) from public.section_panels
    where section_id = target.id
      and ((panel_key = 'desktop' and breakpoint = 'desktop')
        or (panel_key in ('mobile-a','mobile-b') and breakpoint = 'mobile'))
  ) <> 3 then
    raise exception 'section_requires_three_device_panels';
  end if;
  if not exists (
    select 1 from public.content_blocks
    where section_id = target.id and status <> 'archived'
  ) then
    raise exception 'section_requires_content';
  end if;
  if not allow_placeholders and exists (
    select 1 from public.content_blocks
    where section_id = target.id and is_placeholder and status <> 'archived'
  ) then
    raise exception 'section_contains_placeholders';
  end if;
  if exists (
    select 1 from public.content_blocks b
    where b.section_id = target.id and b.status <> 'archived'
      and (
        not exists (
          select 1 from public.block_placements bp
          join public.section_panels sp on sp.id = bp.panel_id
          where bp.block_id = b.id and sp.section_id = target.id
            and sp.panel_key = 'desktop'
        )
        or not exists (
          select 1 from public.block_placements bp
          join public.section_panels sp on sp.id = bp.panel_id
          where bp.block_id = b.id and sp.section_id = target.id
            and sp.panel_key = ('mobile-' || b.mobile_panel)
        )
      )
  ) then
    raise exception 'section_contains_blocks_without_device_placements';
  end if;

  update public.content_blocks
  set status = 'published'
  where section_id = target.id and status in ('draft','in_review');

  update public.sections
  set status = 'published', is_visible = true, published_at = now()
  where id = target.id;
end;
$function$;

revoke all on function public.create_section_with_panels(uuid) from public, anon, authenticated;
grant execute on function public.create_section_with_panels(uuid) to authenticated;
revoke all on function public.publish_section(uuid, boolean) from public, anon, authenticated;
grant execute on function public.publish_section(uuid, boolean) to authenticated;
revoke all on function public.duplicate_section(uuid) from public, anon, authenticated;
grant execute on function public.duplicate_section(uuid) to authenticated;
revoke all on function public.swap_section_order(uuid, uuid) from public, anon, authenticated;
grant execute on function public.swap_section_order(uuid, uuid) to authenticated;
revoke all on function public.capture_content_change() from public, anon, authenticated;
