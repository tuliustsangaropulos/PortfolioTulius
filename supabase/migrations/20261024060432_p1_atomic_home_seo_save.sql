-- P1: Save the home page and global SEO settings in one transaction.
create or replace function public.save_home_seo_atomic(
  p_page_id uuid,
  p_settings_id uuid,
  p_page_seo_title text,
  p_page_seo_description text,
  p_site_title text,
  p_site_description text,
  p_locale text,
  p_seo_json jsonb,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  perform private.require_portfolio_admin();
  if p_page_id is null or p_settings_id is null or
    nullif(btrim(p_site_title), '') is null or
    p_locale !~ '^[a-z]{2}-[A-Z]{2}$' or
    p_locale is null or
    p_status not in ('draft','published') or p_status is null or
    jsonb_typeof(p_seo_json) is distinct from 'object'
  then
    raise exception 'invalid_seo_payload' using errcode = '22023';
  end if;

  if (p_seo_json ? 'canonical') and nullif(p_seo_json->>'canonical','') is not null
    and (p_seo_json->>'canonical') !~ '^https://[^[:space:]]+$'
  then raise exception 'canonical_must_be_https' using errcode = '22023';
  end if;
  if (p_seo_json ? 'ogImage') and nullif(p_seo_json->>'ogImage','') is not null
    and (p_seo_json->>'ogImage') !~ '^https://[^[:space:]]+$'
  then raise exception 'og_image_must_be_https' using errcode = '22023';
  end if;

  update public.pages
  set seo_title = p_page_seo_title,
      seo_description = p_page_seo_description
  where id = p_page_id and slug = 'home';
  if not found then raise exception 'home_page_not_found' using errcode = 'P0002'; end if;

  update public.site_settings
  set site_title = p_site_title,
      description = p_site_description,
      locale = p_locale,
      seo_json = p_seo_json,
      status = p_status
  where id = p_settings_id;
  if not found then raise exception 'site_settings_not_found' using errcode = 'P0002'; end if;
end;
$fn$;
revoke all on function public.save_home_seo_atomic(uuid,uuid,text,text,text,text,text,jsonb,text)
  from public, anon, authenticated;
grant execute on function public.save_home_seo_atomic(uuid,uuid,text,text,text,text,text,jsonb,text)
  to authenticated;
