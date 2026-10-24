-- P0-01: atomic, admin-only save for one content block and selected device placements.
-- Does not delete placements or change existing block data at installation time.
create or replace function public.save_content_block_atomic(
  p_block_id uuid,
  p_block_type text,
  p_content_json jsonb,
  p_mobile_panel text,
  p_sort_order integer,
  p_status text,
  p_is_placeholder boolean,
  p_editorial_note text,
  p_placements jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_section_id uuid;
  v_entry jsonb;
  v_panel_key text;
  v_panel_id uuid;
  v_seen text[] := array[]::text[];
  v_motion jsonb;
  v_sort integer;
begin
  perform private.require_portfolio_admin();

  if p_block_id is null or nullif(btrim(p_block_type), '') is null
    or p_mobile_panel not in ('a', 'b') or p_mobile_panel is null
    or p_status not in ('draft', 'in_review', 'published', 'archived') or p_status is null
    or p_sort_order is null or p_sort_order < 1
    or jsonb_typeof(p_content_json) is distinct from 'object'
  then
    raise exception 'invalid_block_payload' using errcode = '22023';
  end if;

  if p_placements is null or jsonb_typeof(p_placements) is distinct from 'array'
    or jsonb_array_length(p_placements) > 3
  then
    raise exception 'invalid_placements_payload' using errcode = '22023';
  end if;

  select cb.section_id into v_section_id
  from public.content_blocks as cb
  where cb.id = p_block_id
  for update;
  if not found then
    raise exception 'block_not_found' using errcode = 'P0002';
  end if;

  update public.content_blocks
     set block_type = p_block_type,
         content_json = p_content_json,
         mobile_panel = p_mobile_panel,
         sort_order = p_sort_order,
         status = p_status,
         is_placeholder = p_is_placeholder,
         editorial_note = p_editorial_note
   where id = p_block_id;

  for v_entry in select value from jsonb_array_elements(p_placements) as items(value)
  loop
    if jsonb_typeof(v_entry) is distinct from 'object' then
      raise exception 'invalid_placement_entry' using errcode = '22023';
    end if;
    v_panel_key := v_entry->>'panel_key';
    if v_panel_key is null or v_panel_key not in ('desktop', 'mobile-a', 'mobile-b')
       or v_panel_key = any(v_seen)
    then
      raise exception 'invalid_or_duplicate_panel_key' using errcode = '22023';
    end if;
    v_seen := array_append(v_seen, v_panel_key);

    select sp.id into v_panel_id
    from public.section_panels as sp
    where sp.section_id = v_section_id and sp.panel_key = v_panel_key;
    if not found then
      raise exception 'panel_not_found: %', v_panel_key using errcode = 'P0002';
    end if;

    v_motion := coalesce(v_entry->'motion_config', '{}'::jsonb);
    if jsonb_typeof(v_motion) is distinct from 'object' then
      raise exception 'invalid_motion_config' using errcode = '22023';
    end if;
    v_sort := coalesce((v_entry->>'sort_order')::integer, p_sort_order);
    if v_sort < 1 then
      raise exception 'invalid_placement_order' using errcode = '22023';
    end if;

    insert into public.block_placements (
      block_id, panel_id, sort_order, layout_variant, is_visible, motion_config
    )
    values (
      p_block_id,
      v_panel_id,
      v_sort,
      coalesce(nullif(v_entry->>'layout_variant', ''), 'default'),
      coalesce((v_entry->>'is_visible')::boolean, true),
      v_motion
    )
    on conflict (block_id, panel_id) do update
      set sort_order = excluded.sort_order,
          layout_variant = excluded.layout_variant,
          is_visible = excluded.is_visible,
          motion_config = excluded.motion_config;
  end loop;
end;
$function$;

revoke all on function public.save_content_block_atomic(uuid,text,jsonb,text,integer,text,boolean,text,jsonb)
  from public, anon, authenticated;
grant execute on function public.save_content_block_atomic(uuid,text,jsonb,text,integer,text,boolean,text,jsonb)
  to authenticated;
