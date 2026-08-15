ALTER TABLE public.theatres
ADD COLUMN IF NOT EXISTS creator_id text;

UPDATE public.theatres
SET creator_id = admins[1]
WHERE creator_id IS NULL
  AND admins IS NOT NULL
  AND array_length(admins, 1) > 0;
