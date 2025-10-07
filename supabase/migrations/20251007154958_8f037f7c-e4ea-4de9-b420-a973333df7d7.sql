-- Add DELETE policy for transactions table to allow users to delete their own transaction history
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);