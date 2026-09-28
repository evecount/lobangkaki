CREATE POLICY "No direct client access to deal actions" ON public.deal_actions AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
GRANT SELECT ON public.deals TO anon, authenticated;
GRANT ALL ON public.deals TO service_role;
GRANT ALL ON public.deal_actions TO service_role;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;