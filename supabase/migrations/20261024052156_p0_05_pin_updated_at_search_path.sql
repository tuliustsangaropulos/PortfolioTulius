-- P0-05: pin trigger helper resolution to trusted system functions.
-- Body uses only now(), which resolves from pg_catalog.
alter function public.set_updated_at() set search_path = '';
