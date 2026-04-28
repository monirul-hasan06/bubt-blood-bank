-- Update handle_new_user to auto-promote the founder email to admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, student_id, department, phone, blood_group)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'BUBT Student'),
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'phone',
    NULLIF(NEW.raw_user_meta_data->>'blood_group','')::public.blood_group
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'donor');

  -- Auto-grant admin role to the founder email
  IF lower(NEW.email) = 'monirul.hasan513@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- If the admin user already exists in auth.users, promote them now
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE lower(email) = 'monirul.hasan513@gmail.com' LIMIT 1;
  IF v_uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Allow admins to update any profile (for moderation edits)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to see hidden public donors too
DROP POLICY IF EXISTS "Admins can view all public donors" ON public.public_donors;
CREATE POLICY "Admins can view all public donors"
ON public.public_donors
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));