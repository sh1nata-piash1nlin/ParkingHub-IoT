-- Add new fields to parking_events table
ALTER TABLE parking_events 
ADD COLUMN IF NOT EXISTS license_plate TEXT,
ADD COLUMN IF NOT EXISTS parking_slot TEXT,
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'IN' CHECK (event_type IN ('IN', 'OUT'));

-- Create index on event_type for faster queries
CREATE INDEX IF NOT EXISTS idx_parking_events_event_type ON parking_events(event_type);

-- Create index on parking_slot for faster queries
CREATE INDEX IF NOT EXISTS idx_parking_events_parking_slot ON parking_events(parking_slot);

