-- Site-wide settings (admin-controlled feature flags)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (so public site can know what to show)
CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can change settings
CREATE POLICY "Admins manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default: support button visible
INSERT INTO public.site_settings (key, value) VALUES ('support_button_visible', 'true'::jsonb);

-- Realtime so changes reflect instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;