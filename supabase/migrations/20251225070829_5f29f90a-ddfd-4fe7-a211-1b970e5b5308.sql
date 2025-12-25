-- Update default balance for profiles table to 5 lakhs
ALTER TABLE public.profiles ALTER COLUMN balance SET DEFAULT 500000.00;

-- Update existing users who still have the old default balance to the new amount
UPDATE public.profiles SET balance = 500000.00 WHERE balance = 100000.00;