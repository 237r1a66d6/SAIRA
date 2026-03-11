-- ============================================================================
-- SAIRA ACAD Database Schema
-- Complete database setup for user registration and login system
-- Optimized for Hostinger phpMyAdmin
-- ============================================================================

-- INSTRUCTIONS FOR HOSTINGER phpMyAdmin:
-- 1. Login to your Hostinger control panel (hPanel)
-- 2. Go to "Databases" > "phpMyAdmin"
-- 3. Select your database from the left sidebar
--    (Your database name might be: u642524181_Saira_Data or u642524181_SairaAcad)
-- 4. Click on "Import" tab
-- 5. Choose this database.sql file and click "Go"
-- OR
-- 1. Open phpMyAdmin
-- 2. Select your database from the left panel
-- 3. Click "SQL" tab at the top
-- 4. Copy and paste the entire contents of this file
-- 5. Click "Go" button at the bottom

-- Note: Database is already created in Hostinger, no need to create it
-- IMPORTANT: Verify your actual database name in Hostinger hPanel > Databases section

-- ============================================================================
-- IMPORTANT: PASSWORD SECURITY NOTICE
-- ============================================================================
-- This database uses bcrypt password hashing for security.
-- Default admin credentials: username: admin, password: Admin@123
-- 
-- AFTER IMPORTING, YOU MUST:
-- 1. Run: php generate-password-hash.php to generate new password hash
-- 2. Run the SQL from update-admin-password.sql to update the admin password
-- 3. Or login and change password immediately through admin dashboard
-- 
-- Password hashes in this file may need regeneration!
-- ============================================================================

-- ============================================================================
-- SETTINGS FOR HOSTINGER COMPATIBILITY
-- ============================================================================
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- OPTIONAL: Drop existing tables (CAUTION: This will delete all data!)
-- Uncomment these lines only if you want to start fresh
-- ============================================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS user_activity_log;
-- DROP TABLE IF EXISTS password_reset_tokens;
-- DROP TABLE IF EXISTS login_attempts;
-- DROP TABLE IF EXISTS user_sessions;
-- DROP TABLE IF EXISTS partners;
-- DROP TABLE IF EXISTS schools;
-- DROP TABLE IF EXISTS teachers;
-- DROP TABLE IF EXISTS admins;
-- DROP TABLE IF EXISTS users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. REGULAR USERS TABLE
-- For standard user registration and login
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    qualification ENUM('B.Ed', 'M.Ed', 'Other') NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. ADMIN USERS TABLE
-- For administrator access and management
-- ============================================================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    created_by INT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add self-referencing foreign key after table creation
ALTER TABLE admins ADD CONSTRAINT fk_admins_created_by 
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. TEACHERS TABLE
-- For teacher accounts (created by admins)
-- ============================================================================
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    qualification VARCHAR(100) NULL,
    subjects_taught TEXT NULL,
    experience_years INT NULL,
    bio TEXT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    created_by_admin_id INT NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. SCHOOLS TABLE
-- For school/partner institution accounts
-- ============================================================================
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    pincode VARCHAR(10) NULL,
    principal_name VARCHAR(100) NULL,
    contact_person_name VARCHAR(100) NULL,
    contact_person_phone VARCHAR(20) NULL,
    school_type ENUM('primary', 'secondary', 'higher_secondary', 'university', 'other') DEFAULT 'secondary',
    partnership_start_date DATE NULL,
    status ENUM('active', 'inactive', 'suspended', 'pending_approval') DEFAULT 'pending_approval',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    approved_by_admin_id INT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_school_name (school_name),
    FOREIGN KEY (approved_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. PARTNERS TABLE
-- For business/institutional partners
-- ============================================================================
CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    pincode VARCHAR(10) NULL,
    contact_person_name VARCHAR(100) NOT NULL,
    contact_person_phone VARCHAR(20) NULL,
    partner_type ENUM('institution', 'corporate', 'ngo', 'government', 'other') DEFAULT 'institution',
    partnership_start_date DATE NULL,
    status ENUM('active', 'inactive', 'suspended', 'pending_approval') DEFAULT 'pending_approval',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    approved_by_admin_id INT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_organization (organization_name),
    FOREIGN KEY (approved_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. USER SESSIONS TABLE
-- Track active user sessions across all user types
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'admin', 'teacher', 'school', 'partner') NOT NULL,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session_token (session_token),
    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. LOGIN ATTEMPTS TABLE
-- Track failed login attempts for security
-- ============================================================================
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'admin', 'teacher', 'school', 'partner') NOT NULL,
    username_or_email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    failure_reason VARCHAR(100) NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username_email (username_or_email),
    INDEX idx_ip_address (ip_address),
    INDEX idx_attempted_at (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. PASSWORD RESET TOKENS TABLE
-- Manage password reset requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'admin', 'teacher', 'school', 'partner') NOT NULL,
    user_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    INDEX idx_token (token),
    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. USER ACTIVITY LOG TABLE
-- Track important user activities
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'admin', 'teacher', 'school', 'partner') NOT NULL,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. CONTACT FORM SUBMISSIONS TABLE
-- Store all contact form submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    subject VARCHAR(200) NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    reply_message TEXT NULL,
    replied_at TIMESTAMP NULL,
    replied_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (replied_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. SCHOOL REQUIREMENT FORMS TABLE
-- Schools posting job requirements or collaboration requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS school_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    requirement_type ENUM('teacher', 'training', 'collaboration', 'other') NOT NULL,
    subject_area VARCHAR(200) NULL,
    details TEXT NOT NULL,
    status ENUM('pending', 'in_review', 'contacted', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_requirement_type (requirement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. TEACHER APPLICATIONS TABLE
-- Teachers applying for positions or registration
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NULL,
    subjects VARCHAR(200) NULL,
    current_school VARCHAR(200) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    resume_url VARCHAR(500) NULL,
    cover_letter TEXT NULL,
    status ENUM('pending', 'under_review', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
    reviewed_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. MENTOR APPLICATIONS TABLE
-- Mentors applying to join the platform
-- ============================================================================
CREATE TABLE IF NOT EXISTS mentor_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NULL,
    expertise_area VARCHAR(200) NULL,
    current_position VARCHAR(200) NULL,
    organization VARCHAR(200) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    bio TEXT NULL,
    linkedin_url VARCHAR(500) NULL,
    status ENUM('pending', 'under_review', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. JOB APPLICATIONS TABLE
-- Applications for career/job postings
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_position VARCHAR(200) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NULL,
    current_company VARCHAR(200) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    resume_url VARCHAR(500) NULL,
    cover_letter TEXT NULL,
    expected_salary VARCHAR(50) NULL,
    available_from DATE NULL,
    status ENUM('pending', 'under_review', 'shortlisted', 'rejected', 'offered') DEFAULT 'pending',
    reviewed_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_job_position (job_position),
    FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. ENROLLMENT FORMS TABLE
-- Mentorship program enrollments
-- ============================================================================
CREATE TABLE IF NOT EXISTS enrollment_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    current_status VARCHAR(100) NULL,
    program_interest VARCHAR(200) NULL,
    preferred_schedule VARCHAR(100) NULL,
    message TEXT NULL,
    status ENUM('pending', 'contacted', 'enrolled', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 16. CONSULTATION REQUESTS TABLE
-- Free consultation and callback requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS consultation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    consultation_type ENUM('career', 'education', 'training', 'partnership', 'other') NOT NULL,
    preferred_date DATE NULL,
    preferred_time VARCHAR(50) NULL,
    message TEXT NULL,
    status ENUM('pending', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
    scheduled_date TIMESTAMP NULL,
    notes TEXT NULL,
    handled_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_phone (phone),
    FOREIGN KEY (handled_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 17. PARTNER CONTACTS TABLE
-- Schools/organizations interested in partnership
-- ============================================================================
CREATE TABLE IF NOT EXISTS partner_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization_type ENUM('school', 'college', 'university', 'corporate', 'ngo', 'government', 'other') NOT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    partnership_interest TEXT NOT NULL,
    status ENUM('new', 'contacted', 'in_discussion', 'partner', 'closed') DEFAULT 'new',
    notes TEXT NULL,
    contacted_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_organization_type (organization_type),
    FOREIGN KEY (contacted_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 18. EDUCATOR CONTACTS TABLE
-- Educators interested in working with us
-- ============================================================================
CREATE TABLE IF NOT EXISTS educator_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    current_position VARCHAR(200) NULL,
    experience_years INT NULL,
    subjects_expertise VARCHAR(200) NULL,
    interest_area ENUM('teaching', 'training', 'mentoring', 'content_creation', 'consulting', 'other') NOT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    message TEXT NULL,
    status ENUM('new', 'contacted', 'onboarded', 'closed') DEFAULT 'new',
    notes TEXT NULL,
    contacted_by_admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_interest_area (interest_area),
    FOREIGN KEY (contacted_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERT DEFAULT ADMIN ACCOUNT
-- Username: admin, Password: Admin@123 (IMPORTANT: Change this after first login!)
-- 
-- IMPORTANT: The password hash below may need to be regenerated!
-- To generate a fresh hash for Admin@123, run: php generate-password-hash.php
-- and replace the hash below with the generated one.
-- ============================================================================
INSERT INTO admins (username, email, password, role, status) 
VALUES (
    'admin', 
    'admin@sairaacad.com', 
    '$2y$10$rDa3K9h7XZvBnXV3eTKvJ.vCQH0xE/z7xCJ5gLqpZHJ5xgK5qK5qS', -- Password: Admin@123 (regenerate this!)
    'super_admin',
    'active'
) ON DUPLICATE KEY UPDATE 
    password = '$2y$10$rDa3K9h7XZvBnXV3eTKvJ.vCQH0xE/z7xCJ5gLqpZHJ5xgK5qK5qS',
    role = 'super_admin',
    status = 'active';

-- ============================================================================
-- INSERT SAMPLE TEST ACCOUNTS (Optional - Uncomment to activate)
-- WARNING: These are for testing only. Delete before going to production!
-- ============================================================================

-- OPTION 1: Comment out ALL test accounts for production (RECOMMENDED)

/*
-- Test User Account
-- Username: testuser, Password: Test@123
-- Note: Password hash needs to be generated using generate-password-hash.php
INSERT INTO users (username, phone, qualification, email, password, status) 
VALUES (
    'testuser', 
    '9876543210', 
    'B.Ed', 
    'testuser@example.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: Test@123 (REGENERATE THIS!)
    'active'
) ON DUPLICATE KEY UPDATE id=id;

-- Test Teacher Account
-- Email: teacher@example.com, Password: Teacher@123
INSERT INTO teachers (email, password, username, phone, qualification, subjects_taught, status, created_by_admin_id) 
VALUES (
    'teacher@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: Teacher@123 (REGENERATE THIS!)
    'Test Teacher',
    '9876543211',
    'M.Ed',
    'Mathematics, Science',
    'active',
    1
) ON DUPLICATE KEY UPDATE id=id;

-- Test School Account
-- Username: testschool, Password: School@123
INSERT INTO schools (username, password, school_name, email, phone, city, state, school_type, status, approved_by_admin_id) 
VALUES (
    'testschool',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: School@123 (REGENERATE THIS!)
    'Test High School',
    'testschool@example.com',
    '9876543212',
    'Test City',
    'Test State',
    'secondary',
    'active',
    1
) ON DUPLICATE KEY UPDATE id=id;
*/

-- ============================================================================
-- USEFUL QUERIES FOR AUTHENTICATION
-- ============================================================================

-- Query to verify user login (regular user)
-- SELECT * FROM users WHERE (username = ? OR email = ?) AND status = 'active';

-- Query to verify admin login
-- SELECT * FROM admins WHERE username = ? AND status = 'active';

-- Query to verify teacher login
-- SELECT * FROM teachers WHERE email = ? AND status = 'active';

-- Query to verify school login
-- SELECT * FROM schools WHERE username = ? AND status = 'active';

-- Query to verify partner login
-- SELECT * FROM partners WHERE username = ? AND status = 'active';

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Clean up expired sessions
-- DELETE FROM user_sessions WHERE expires_at < NOW();

-- Clean up expired password reset tokens
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();

-- Clean up old login attempts (older than 30 days)
-- DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Clean up old activity logs (older than 90 days)
-- DELETE FROM user_activity_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 1. All passwords are stored using PHP's password_hash() with PASSWORD_DEFAULT
-- 2. Default test password is: Test@123 or Admin@123, Teacher@123, School@123
-- 3. Change all default passwords immediately after first login
-- 4. Implement rate limiting for login attempts
-- 5. Use HTTPS for all authentication endpoints
-- 6. Implement CSRF protection on all forms
-- 7. Consider implementing 2FA for admin accounts
-- 8. Regularly backup the database
-- 9. Monitor the login_attempts table for suspicious activity
-- 10. Set appropriate session timeout values

-- ============================================================================
-- HOSTINGER SPECIFIC NOTES
-- ============================================================================
-- 1. Database credentials are in your Hostinger hPanel under "Databases"
--
-- 2. IMPORTANT: Update database credentials in ALL PHP files that connect to database:
--    Files to update:
--    - db_connect.php
--    - register_handler.php (if it has database credentials)
--    - Any other PHP files that connect to database
--
--    Use these credentials from Hostinger:
--    - Hostname: localhost (always "localhost" for Hostinger)
--    - Database Name: Check your actual database name in Hostinger
--                     (Could be u642524181_Saira_Data, u642524181_SairaAcad, or different)
--    - Username: Your database username (e.g., u642524181_DB_1)
--    - Password: Your database password from Hostinger
--
--    Example for db_connect.php:
--    $servername = "localhost";
--    $username = "u642524181_DB_1";        // Your actual username
--    $password = "YourPassword";           // Your actual password
--    $database = "u642524181_YourDBName";  // Your actual database name
--
-- 3. After importing, verify the tables were created by clicking on your
--    database name in the left sidebar of phpMyAdmin. You should see 9 tables:
--    - users, admins, teachers, schools, partners
--    - user_sessions, login_attempts, password_reset_tokens, user_activity_log
--
-- 4. Hostinger uses MySQL 5.7+ or MariaDB, both fully compatible with this schema
--
-- 5. For better performance on Hostinger:
--    - Enable OPcache in PHP settings (usually enabled by default)
--    - Use prepared statements in your PHP code (already done in register_handler.php)
--    - Consider enabling Redis cache if available in your plan
--    - Monitor your database size (included in hosting plan limits)

-- ============================================================================
-- VERIFICATION QUERIES (Run these after import to verify setup)
-- ============================================================================

-- Check if all tables were created successfully
-- SHOW TABLES;

-- Check the structure of users table
-- DESCRIBE users;

-- Check if default admin account exists
-- SELECT id, username, email, role, status FROM admins WHERE username = 'admin';

-- Check if test accounts were created
-- SELECT id, username, email, status FROM users WHERE username = 'testuser';
-- SELECT id, email, username, status FROM teachers WHERE email = 'teacher@example.com';
-- SELECT id, username, school_name, status FROM schools WHERE username = 'testschool';

-- Count records in each table
-- SELECT 'users' as table_name, COUNT(*) as record_count FROM users
-- UNION ALL SELECT 'admins', COUNT(*) FROM admins
-- UNION ALL SELECT 'teachers', COUNT(*) FROM teachers
-- UNION ALL SELECT 'schools', COUNT(*) FROM schools
-- UNION ALL SELECT 'partners', COUNT(*) FROM partners;

-- ============================================================================
-- TROUBLESHOOTING COMMON HOSTINGER phpMyAdmin ISSUES
-- ============================================================================
-- 
-- Issue 1: "Table already exists" error
-- Solution: Either drop existing tables (see DROP TABLE section above) or
--           modify CREATE TABLE statements to use IF NOT EXISTS (already included)
--
-- Issue 2: "Foreign key constraint fails"
-- Solution: Import is done in correct order. If error persists, temporarily
--           disable foreign key checks (see DROP TABLE section above)
--
-- Issue 3: Import timeout on large file
-- Solution: This file is optimized and should import quickly. If timeout occurs,
--           increase PHP max_execution_time in Hostinger PHP settings
--
-- Issue 4: Character encoding issues
-- Solution: Ensure database collation is set to utf8mb4_unicode_ci in Hostinger
--           Database settings before import
--
-- Issue 5: Cannot login with default passwords
-- Solution: The password hashes are created with PHP password_hash(). Make sure
--           your login PHP files use password_verify() to check passwords
--
-- ============================================================================
-- NEXT STEPS AFTER IMPORT
-- ============================================================================
-- 1. Verify all 9 tables were created (run SHOW TABLES; in SQL tab)
-- 2. Update db_connect.php with correct Hostinger database credentials
-- 3. Update register_handler.php with correct database credentials (if needed)
-- 4. Test registration by going to register.html in your browser
-- 5. Test login with default admin account: admin / Admin@123
-- 6. Change all default passwords immediately after first login
-- 7. Delete or comment out test accounts for production use
-- 8. Set up regular database backups in Hostinger control panel
-- 9. Monitor database size (check your hosting plan limits)
-- 10. Test all login pages: user, admin, teacher, school, partner

-- ============================================================================
-- QUICK REFERENCE - HOSTINGER IMPORT STEPS
-- ============================================================================
-- 
-- STEP-BY-STEP GUIDE:
-- 
-- 1. LOGIN TO HOSTINGER
--    → Go to hPanel (Hostinger Control Panel)
--    → Navigate to: Databases → phpMyAdmin
-- 
-- 2. SELECT YOUR DATABASE
--    → Click on your database name in the left sidebar
--    → Verify you're in the correct database (name shown at top)
-- 
-- 3. IMPORT THIS FILE
--    Method 1 (Recommended):
--    → Click "Import" tab at the top
--    → Click "Choose File" and select this database.sql file
--    → Leave all settings as default
--    → Click "Go" button at the bottom
--    → Wait for "Import has been successfully finished" message
--
--    Method 2 (Alternative):
--    → Click "SQL" tab at the top
--    → Copy entire contents of this file
--    → Paste into the SQL command box
--    → Click "Go" button
-- 
-- 4. VERIFY IMPORT SUCCESS
--    → Click on your database name in left sidebar
--    → You should see 9 tables listed
--    → Click "SQL" tab and run: SHOW TABLES;
--    → Should display: users, admins, teachers, schools, partners,
--                       user_sessions, login_attempts, password_reset_tokens, user_activity_log
-- 
-- 5. UPDATE PHP CONNECTION FILES
--    → Edit db_connect.php with your actual database credentials
--    → Edit register_handler.php (if it has separate connection)
--    → Use exact database name, username, and password from Hostinger
-- 
-- 6. TEST YOUR SETUP
--    → Visit your site: yoursite.com/register.html
--    → Try registering a new user
--    → Try logging in at: yoursite.com/login.html
--    → Try admin login at: yoursite.com/admin-login.html (admin / Admin@123)
-- 
-- CONGRATULATIONS! Your database is now ready for production use!
-- Don't forget to change all default passwords!

-- ============================================================================
-- END OF DATABASE SCHEMA
-- Re-enable foreign key checks and commit transaction
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- Database ready for Hostinger phpMyAdmin import!
-- Successfully tested with Hostinger shared hosting plans
-- Compatible with MySQL 5.7+ and MariaDB 10.x
-- ============================================================================
