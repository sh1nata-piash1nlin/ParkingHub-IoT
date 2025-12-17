-- Create parking_events table
CREATE TABLE IF NOT EXISTS parking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfid_id TEXT NOT NULL,
    image_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on rfid_id for faster queries
CREATE INDEX IF NOT EXISTS idx_parking_events_rfid_id ON parking_events(rfid_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_parking_events_created_at ON parking_events(created_at DESC);

