-- Add unique constraints to prevent duplicate registrations
-- Run this SQL script on your database to add unique constraints on email and username

-- First, check if there are any existing duplicate emails
-- If you have duplicates, you'll need to clean them up first
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- First, check if there are any existing duplicate usernames
-- If you have duplicates, you'll need to clean them up first
SELECT name, COUNT(*) as count 
FROM users 
GROUP BY name 
HAVING COUNT(*) > 1;

-- Add unique constraint on email column
-- This will prevent duplicate emails at the database level
ALTER TABLE users 
ADD UNIQUE INDEX unique_email (email);

-- Add unique constraint on username (name) column
-- This will prevent duplicate usernames at the database level
ALTER TABLE users 
ADD UNIQUE INDEX unique_username (name);

-- Optional: If you have existing duplicates, you can use this query to find them:
-- SELECT * FROM users WHERE email IN (
--     SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1
-- ) ORDER BY email;
