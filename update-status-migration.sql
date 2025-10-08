-- Migration Script: Update Consultation Request Status Values
-- This script converts old status values to new ones
-- Run this if you have existing data with old status values

-- Update 'new' status to 'pending'
UPDATE consultation_requests 
SET status = 'pending' 
WHERE status = 'new';

-- Update 'in_progress' status to 'pending'
UPDATE consultation_requests 
SET status = 'pending' 
WHERE status = 'in_progress';

-- Update 'closed' status to 'responded'
UPDATE consultation_requests 
SET status = 'responded' 
WHERE status = 'closed';

-- Verify the changes
SELECT status, COUNT(*) as count 
FROM consultation_requests 
GROUP BY status;

-- Expected output:
-- status     | count
-- -----------|------
-- pending    | X
-- responded  | Y

