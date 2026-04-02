-- Restrict profiles UPDATE to prevent direct balance modification
-- Drop the existing broad update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create a restricted update policy that ensures balance cannot be changed directly
-- The WITH CHECK ensures that the balance value in the update matches the current balance
CREATE POLICY "Users can update own non-financial profile fields"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND balance = (SELECT balance FROM profiles WHERE id = auth.uid())
  );

-- Add CHECK constraints on transactions table for data integrity
ALTER TABLE transactions ADD CONSTRAINT valid_transaction_values 
  CHECK (total_amount > 0 AND quantity > 0 AND price_per_unit > 0);

-- Add CHECK constraints on user_investments table
ALTER TABLE user_investments ADD CONSTRAINT valid_investment_values 
  CHECK (quantity > 0 AND purchase_price > 0);