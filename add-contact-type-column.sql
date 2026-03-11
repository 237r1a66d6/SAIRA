-- Add contact_type column to contact_submissions table
-- This allows filtering between partner and educator messages
-- Run this SQL in phpMyAdmin

ALTER TABLE contact_submissions 
ADD COLUMN contact_type ENUM('general', 'partner', 'educator') DEFAULT 'general' 
AFTER message;

-- Add index for better query performance
ALTER TABLE contact_submissions 
ADD INDEX idx_contact_type (contact_type);

-- Update existing records (optional - sets all existing to 'general')
UPDATE contact_submissions 
SET contact_type = 'general' 
WHERE contact_type IS NULL;
