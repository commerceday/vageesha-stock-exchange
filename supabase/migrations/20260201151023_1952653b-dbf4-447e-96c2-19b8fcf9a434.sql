-- Allow fractional units (e.g., mutual fund units like 31.867)
-- Convert existing integer quantities safely.

ALTER TABLE public.transactions
  ALTER COLUMN quantity TYPE numeric(18,3)
  USING quantity::numeric;

ALTER TABLE public.user_investments
  ALTER COLUMN quantity TYPE numeric(18,3)
  USING quantity::numeric;
