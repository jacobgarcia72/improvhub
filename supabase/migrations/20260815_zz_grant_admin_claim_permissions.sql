GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admins TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.theatre_claims TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_theatre_claim(uuid, text) TO service_role;
