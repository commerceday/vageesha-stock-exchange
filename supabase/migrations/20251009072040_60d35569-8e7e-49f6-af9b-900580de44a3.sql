-- Clear all user-related data
DELETE FROM transactions;
DELETE FROM user_investments;
DELETE FROM user_roles;
DELETE FROM profiles;

-- Delete all user accounts from auth
DELETE FROM auth.users;