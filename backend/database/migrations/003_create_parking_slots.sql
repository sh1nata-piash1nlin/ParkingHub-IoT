-- Create parking_slots table to manage parking slots
CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_name TEXT NOT NULL UNIQUE,
    row_letter TEXT NOT NULL,
    slot_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_row_slot UNIQUE(row_letter, slot_number)
);

-- Create index on slot_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_parking_slots_slot_name ON parking_slots(slot_name);

-- Create index on row_letter for faster queries
CREATE INDEX IF NOT EXISTS idx_parking_slots_row_letter ON parking_slots(row_letter);

-- Create index on is_active for filtering active slots
CREATE INDEX IF NOT EXISTS idx_parking_slots_is_active ON parking_slots(is_active);

-- Insert default parking slots (Rows A-E, each with slots 1-5)
INSERT INTO parking_slots (slot_name, row_letter, slot_number) VALUES
('A1', 'A', 1), ('A2', 'A', 2), ('A3', 'A', 3), ('A4', 'A', 4), ('A5', 'A', 5),
('B1', 'B', 1), ('B2', 'B', 2), ('B3', 'B', 3), ('B4', 'B', 4), ('B5', 'B', 5),
('C1', 'C', 1), ('C2', 'C', 2), ('C3', 'C', 3), ('C4', 'C', 4), ('C5', 'C', 5),
('D1', 'D', 1), ('D2', 'D', 2), ('D3', 'D', 3), ('D4', 'D', 4), ('D5', 'D', 5),
('E1', 'E', 1), ('E2', 'E', 2), ('E3', 'E', 3), ('E4', 'E', 4), ('E5', 'E', 5)
ON CONFLICT (slot_name) DO NOTHING;

