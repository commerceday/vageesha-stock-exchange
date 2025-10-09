-- Clear all investment and transaction data
DELETE FROM transactions;
DELETE FROM user_investments;

-- Reset all user balances to starting amount
UPDATE profiles SET balance = 100000;