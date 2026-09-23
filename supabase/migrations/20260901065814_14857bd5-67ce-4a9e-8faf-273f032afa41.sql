CREATE TYPE public.market_code AS ENUM ('US','JP');
CREATE TYPE public.case_locale AS ENUM ('en-US','ja-JP');
CREATE TYPE public.case_status AS ENUM ('new','triaged','awaiting_customer','in_review','resolved','closed');
CREATE TYPE public.attachment_type AS ENUM ('proof_of_purchase','complete_product','issue_closeup','additional');
CREATE TYPE public.setup_state AS ENUM ('bare','blue_silicone_cover');
CREATE TYPE public.pet_guide AS ENUM ('dog','cat','not_applicable');
CREATE TYPE public.support_role AS ENUM ('admin','support');

CREATE TABLE public.support_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.support_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.support_roles TO authenticated;
GRANT ALL ON public.support_roles TO service_role;
ALTER TABLE public.support_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_support_role(_user_id uuid, _role public.support_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.support_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_support_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.support_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "staff read own roles" ON public.support_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_support_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.support_roles
  FOR ALL TO authenticated
  USING (public.has_support_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_support_role(auth.uid(), 'admin'));

CREATE TABLE public.support_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference text NOT NULL UNIQUE,
  market public.market_code NOT NULL,
  locale public.case_locale NOT NULL,
  status public.case_status NOT NULL DEFAULT 'new',
  support_topic text NOT NULL,
  purchase_channel text NOT NULL,
  order_reference text NOT NULL,
  purchase_date date NOT NULL,
  product_code text NOT NULL DEFAULT 'PCI01' CHECK (product_code = 'PCI01'),
  setup_state public.setup_state NOT NULL,
  pet_guide public.pet_guide NOT NULL,
  optional_product_identifier text,
  issue_title text NOT NULL,
  issue_description text NOT NULL,
  issue_started_at date,
  steps_already_tried text[] NOT NULL DEFAULT '{}',
  damaged_or_leaking_battery boolean NOT NULL DEFAULT false,
  customer_email text NOT NULL,
  privacy_consent_version text NOT NULL,
  submission_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_cases_market_status_idx ON public.support_cases (market, status, created_at DESC);
CREATE INDEX support_cases_order_reference_idx ON public.support_cases (order_reference);
GRANT SELECT, UPDATE ON public.support_cases TO authenticated;
GRANT ALL ON public.support_cases TO service_role;
ALTER TABLE public.support_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read cases" ON public.support_cases
  FOR SELECT TO authenticated USING (public.is_support_staff(auth.uid()));
CREATE POLICY "admins update cases" ON public.support_cases
  FOR UPDATE TO authenticated
  USING (public.has_support_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_support_role(auth.uid(), 'admin'));

CREATE TABLE public.case_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.support_cases(id) ON DELETE CASCADE,
  attachment_type public.attachment_type NOT NULL,
  storage_path text NOT NULL,
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes integer NOT NULL CHECK (size_bytes > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX case_attachments_case_idx ON public.case_attachments (case_id);
GRANT SELECT ON public.case_attachments TO authenticated;
GRANT ALL ON public.case_attachments TO service_role;
ALTER TABLE public.case_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read attachments" ON public.case_attachments
  FOR SELECT TO authenticated USING (public.is_support_staff(auth.uid()));

CREATE TABLE public.case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.support_cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  previous_status public.case_status,
  new_status public.case_status,
  internal_note text,
  actor_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX case_events_case_idx ON public.case_events (case_id, created_at DESC);
GRANT SELECT, INSERT ON public.case_events TO authenticated;
GRANT ALL ON public.case_events TO service_role;
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read events" ON public.case_events
  FOR SELECT TO authenticated USING (public.is_support_staff(auth.uid()));
CREATE POLICY "staff add events" ON public.case_events
  FOR INSERT TO authenticated
  WITH CHECK (public.is_support_staff(auth.uid()) AND actor_user_id = auth.uid());

CREATE TABLE public.case_submission_throttle (
  fingerprint text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  submission_count integer NOT NULL DEFAULT 0
);
GRANT ALL ON public.case_submission_throttle TO service_role;
ALTER TABLE public.case_submission_throttle ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER support_cases_touch_updated_at
  BEFORE UPDATE ON public.support_cases
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "staff read support attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'support-attachments' AND public.is_support_staff(auth.uid()));