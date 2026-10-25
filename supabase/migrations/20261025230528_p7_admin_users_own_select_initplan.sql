-- P7 follow-up: evaluate JWT UID once per statement, without changing policy roles or row visibility.
DO $guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='admin_users'
      AND policyname='owner may read own admin membership'
      AND cmd='SELECT' AND qual='(user_id = auth.uid())'
  ) THEN RAISE EXCEPTION 'owner_membership_policy_changed'; END IF;
END $guard$;
ALTER POLICY "owner may read own admin membership" ON public.admin_users
  USING (user_id = (select auth.uid()));
