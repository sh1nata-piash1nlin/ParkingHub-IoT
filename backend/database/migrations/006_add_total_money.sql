-- Add total_money field to parking_events table
-- This field stores the parking fee calculated as: (time_out - time_in) in minutes * 10000 VND
ALTER TABLE parking_events 
ADD COLUMN IF NOT EXISTS total_money NUMERIC(12, 2) DEFAULT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN parking_events.total_money IS 'Total parking fee in VND. Calculated as: parking_duration_minutes * 10000. Only set for OUT events.';

