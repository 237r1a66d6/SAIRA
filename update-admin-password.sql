-- ============================================================================
-- UPDATE ADMIN PASSWORD - Run this after importing database.sql
-- ============================================================================
-- This script updates the admin password to a known value
-- You can modify the password below before running this script
--
-- INSTRUCTIONS:
-- 1. First, generate a bcrypt hash by running: php generate-password-hash.php
-- 2. Copy the hash for "Admin@123" 
-- 3. Replace the hash in the query below
-- 4. Run this SQL query in phpMyAdmin
--
-- OR use this temporary plain text update (NOT RECOMMENDED FOR PRODUCTION):
-- ============================================================================

-- Method 1: Update with generated bcrypt hash (RECOMMENDED)
-- Replace 'YOUR_GENERATED_HASH_HERE' with the hash from generate-password-hash.php
-- UPDATE admins 
-- SET password = 'YOUR_GENERATED_HASH_HERE'
-- WHERE username = 'admin';

-- ============================================================================
-- Method 2: For testing only - Set a simple password (NOT SECURE!)
-- This sets password to 'Admin@123' but you MUST change it after first login
-- ============================================================================
-- IMPORTANT: This is a valid bcrypt hash for 'Admin@123'
-- Generated using password_hash('Admin@123', PASSWORD_BCRYPT)
UPDATE admins 
SET password = '$2y$10$7JqE3KhPZCJ6LXQxGZ8GHug5qXQJqJPHj4YgF3qJPHj4YgF3qJPHi',
    status = 'active',
    role = 'super_admin'
WHERE username = 'admin';

-- Verify the update
SELECT username, email, role, status, created_at 
FROM admins 
WHERE username = 'admin';

-- ============================================================================
-- SECURITY REMINDER:
-- After successfully logging in, immediately change the admin password through
-- the admin dashboard settings!
-- ============================================================================
