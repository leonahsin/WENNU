REVOKE EXECUTE ON FUNCTION public.has_support_role(uuid, public.support_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_support_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_support_role(uuid, public.support_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_support_staff(uuid) TO authenticated, service_role;
COMMENT ON TABLE public.case_submission_throttle IS 'Server-only abuse throttle. RLS is enabled with no policies on purpose: only the controlled server action (service role) may read or write it.';