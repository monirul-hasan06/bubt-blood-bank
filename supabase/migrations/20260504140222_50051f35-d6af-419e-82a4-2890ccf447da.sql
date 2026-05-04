-- Add new profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- Donation history table
CREATE TABLE IF NOT EXISTS public.donation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  donation_date date,
  hospital text,
  location text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view donation history"
  ON public.donation_history FOR SELECT
  USING (true);

CREATE POLICY "Users insert own donation history"
  ON public.donation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own donation history"
  ON public.donation_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users delete own donation history"
  ON public.donation_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_donation_history_user ON public.donation_history(user_id, donation_date DESC);

CREATE TRIGGER set_donation_history_updated_at
  BEFORE UPDATE ON public.donation_history
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();