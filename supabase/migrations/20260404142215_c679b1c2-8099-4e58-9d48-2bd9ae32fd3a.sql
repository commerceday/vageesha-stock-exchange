-- Remove UPDATE and DELETE policies on transactions (should be immutable records)
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

-- Remove UPDATE and DELETE policies on user_investments (managed by edge function)
DROP POLICY IF EXISTS "Users can update their own investments" ON public.user_investments;
DROP POLICY IF EXISTS "Users can delete their own investments" ON public.user_investments;