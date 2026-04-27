-- 1. Allow public (anon) to view profiles of available donors
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Public donors table (unregistered contacts)
CREATE TABLE public.public_donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Donor name unpublished',
  blood_group public.blood_group NOT NULL,
  phone TEXT NOT NULL,
  note TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.public_donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible public donors"
ON public.public_donors
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

CREATE POLICY "Admins can insert public donors"
ON public.public_donors
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update public donors"
ON public.public_donors
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete public donors"
ON public.public_donors
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_public_donors_updated_at
BEFORE UPDATE ON public.public_donors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();