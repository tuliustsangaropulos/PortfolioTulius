-- P7: keep access predicates unchanged; cache per-statement Auth checks and index unindexed FKs.
-- Precondition: exactly 22 unchanged admin policies and the original Storage policy.
SET LOCAL lock_timeout = '5s';
DO $check$
DECLARE expected_count integer;
BEGIN
  SELECT count(*) INTO expected_count
  FROM pg_policies
  WHERE schemaname = 'public' AND policyname = 'admin full access'
    AND cmd = 'ALL' AND roles = '{authenticated}'::name[]
    AND qual = 'private.is_portfolio_admin(auth.uid())'
    AND with_check = 'private.is_portfolio_admin(auth.uid())';
  IF expected_count <> 22 THEN RAISE EXCEPTION 'admin_policies_changed: %', expected_count; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage'
      AND tablename = 'objects' AND policyname = 'admins manage portfolio storage'
      AND qual LIKE '%private.is_portfolio_admin(auth.uid())%'
      AND with_check LIKE '%private.is_portfolio_admin(auth.uid())%'
  ) THEN RAISE EXCEPTION 'storage_policy_changed'; END IF;
END $check$;

DO $policies$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_policies
    WHERE schemaname='public' AND policyname='admin full access'
    ORDER BY tablename
  LOOP
    EXECUTE format(
      'ALTER POLICY %I ON public.%I USING ((select private.is_portfolio_admin((select auth.uid())))) WITH CHECK ((select private.is_portfolio_admin((select auth.uid()))))',
      'admin full access', r.tablename
    );
  END LOOP;
END $policies$;

ALTER POLICY "admins manage portfolio storage" ON storage.objects
  USING (
    bucket_id = ANY (ARRAY['portfolio-public'::text,'portfolio-private'::text])
    AND (select private.is_portfolio_admin((select auth.uid())))
  )
  WITH CHECK (
    bucket_id = ANY (ARRAY['portfolio-public'::text,'portfolio-private'::text])
    AND (select private.is_portfolio_admin((select auth.uid())))
  );

-- FKs: extra indexes have no UNIQUE constraints, no row or access changes.
CREATE INDEX IF NOT EXISTS audit_logs_user_id_fk_idx ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS block_placements_panel_id_fk_idx ON public.block_placements (panel_id);
CREATE INDEX IF NOT EXISTS content_blocks_media_id_fk_idx ON public.content_blocks (media_id);
CREATE INDEX IF NOT EXISTS content_revisions_actor_user_id_fk_idx ON public.content_revisions (actor_user_id);
CREATE INDEX IF NOT EXISTS editorial_issues_section_id_fk_idx ON public.editorial_issues (section_id);
CREATE INDEX IF NOT EXISTS metrics_section_id_fk_idx ON public.metrics (section_id);
CREATE INDEX IF NOT EXISTS portfolio_projects_experience_id_fk_idx ON public.portfolio_projects (experience_id);
CREATE INDEX IF NOT EXISTS site_settings_favicon_media_id_fk_idx ON public.site_settings (favicon_media_id);
CREATE INDEX IF NOT EXISTS testimonials_photo_media_id_fk_idx ON public.testimonials (photo_media_id);
