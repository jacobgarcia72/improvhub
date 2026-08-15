CREATE TABLE IF NOT EXISTS public.admins (
  user_id text PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.theatres
ALTER COLUMN admins SET DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.theatre_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theatre_id text NOT NULL REFERENCES public.theatres(id) ON DELETE CASCADE,
  claimant_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proof text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  claimed_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by text REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

ALTER TABLE public.theatre_claims
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE public.theatre_claims
ADD COLUMN IF NOT EXISTS reviewed_by text REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.theatre_claims
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE INDEX IF NOT EXISTS theatre_claims_theatre_id_idx
ON public.theatre_claims(theatre_id);

CREATE INDEX IF NOT EXISTS theatre_claims_status_idx
ON public.theatre_claims(status);

CREATE UNIQUE INDEX IF NOT EXISTS theatre_claims_pending_claimant_idx
ON public.theatre_claims(theatre_id, claimant_id)
WHERE status = 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'theatre_claims_status_check'
  ) THEN
    ALTER TABLE public.theatre_claims
    ADD CONSTRAINT theatre_claims_status_check
    CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_theatre_claim(
  p_claim_id uuid,
  p_reviewer_id text
)
RETURNS public.theatre_claims
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claim_record public.theatre_claims;
  updated_count integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = p_reviewer_id) THEN
    RAISE EXCEPTION 'Reviewer is not an admin';
  END IF;

  SELECT *
  INTO claim_record
  FROM public.theatre_claims
  WHERE id = p_claim_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  UPDATE public.theatres
  SET
    admins = ARRAY[claim_record.claimant_id],
    creator_id = coalesce(creator_id, claim_record.claimant_id)
  WHERE id = claim_record.theatre_id
    AND coalesce(cardinality(admins), 0) = 0;

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count = 0 THEN
    UPDATE public.theatre_claims
    SET
      status = 'rejected',
      reviewed_by = p_reviewer_id,
      reviewed_at = now()
    WHERE id = claim_record.id;
    RETURN NULL;
  END IF;

  UPDATE public.theatre_claims
  SET
    status = 'approved',
    reviewed_by = p_reviewer_id,
    reviewed_at = now()
  WHERE id = claim_record.id
  RETURNING * INTO claim_record;

  UPDATE public.theatre_claims
  SET
    status = 'rejected',
    reviewed_by = p_reviewer_id,
    reviewed_at = now()
  WHERE theatre_id = claim_record.theatre_id
    AND status = 'pending'
    AND id <> claim_record.id;

  RETURN claim_record;
END;
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admins TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.theatre_claims TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_theatre_claim(uuid, text) TO service_role;
