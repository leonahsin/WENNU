-- Purchase details are only required for warranty or replacement review.
-- General product-support cases may be created without them.
ALTER TABLE public.support_cases
  ALTER COLUMN order_reference DROP NOT NULL,
  ALTER COLUMN purchase_date DROP NOT NULL;
