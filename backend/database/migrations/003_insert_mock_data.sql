-- Mock data for testing parking history
-- This script inserts sample parking events with various scenarios

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM parking_events;

-- RFID Card: ABC123 - Complete session (IN and OUT)
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'ABC123', 'https://example.com/image1.jpg', 'ABC-1234', 'Slot-A1', 'IN', NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), 'ABC123', 'https://example.com/image2.jpg', 'ABC-1234', 'Slot-A1', 'OUT', NOW() - INTERVAL '2 hours');

-- RFID Card: XYZ789 - Still parked (only IN event)
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'XYZ789', 'https://example.com/image3.jpg', 'XYZ-7890', 'Slot-B2', 'IN', NOW() - INTERVAL '1 hour');

-- RFID Card: DEF456 - Multiple sessions
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'DEF456', 'https://example.com/image4.jpg', 'DEF-4567', 'Slot-C3', 'IN', NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), 'DEF456', 'https://example.com/image5.jpg', 'DEF-4567', 'Slot-C3', 'OUT', NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), 'DEF456', 'https://example.com/image6.jpg', 'DEF-4567', 'Slot-C3', 'IN', NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), 'DEF456', 'https://example.com/image7.jpg', 'DEF-4567', 'Slot-C3', 'OUT', NOW() - INTERVAL '30 minutes');

-- RFID Card: GHI012 - No license plate (N/A)
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'GHI012', 'https://example.com/image8.jpg', NULL, 'Slot-D4', 'IN', NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), 'GHI012', 'https://example.com/image9.jpg', NULL, 'Slot-D4', 'OUT', NOW() - INTERVAL '1 hour');

-- RFID Card: JKL345 - No parking slot assigned
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'JKL345', 'https://example.com/image10.jpg', 'JKL-3456', NULL, 'IN', NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), 'JKL345', 'https://example.com/image11.jpg', 'JKL-3456', NULL, 'OUT', NOW() - INTERVAL '4 hours');

-- RFID Card: MNO678 - Recent entry, still parked
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'MNO678', 'https://example.com/image12.jpg', 'MNO-6789', 'Slot-E5', 'IN', NOW() - INTERVAL '15 minutes');

-- RFID Card: PQR901 - Old completed session (yesterday)
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'PQR901', 'https://example.com/image13.jpg', 'PQR-9012', 'Slot-F6', 'IN', NOW() - INTERVAL '1 day' + INTERVAL '2 hours'),
(gen_random_uuid(), 'PQR901', 'https://example.com/image14.jpg', 'PQR-9012', 'Slot-F6', 'OUT', NOW() - INTERVAL '1 day');

-- RFID Card: STU234 - Multiple entries today
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'STU234', 'https://example.com/image15.jpg', 'STU-2345', 'Slot-G7', 'IN', NOW() - INTERVAL '7 hours'),
(gen_random_uuid(), 'STU234', 'https://example.com/image16.jpg', 'STU-2345', 'Slot-G7', 'OUT', NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), 'STU234', 'https://example.com/image17.jpg', 'STU-2345', 'Slot-H8', 'IN', NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), 'STU234', 'https://example.com/image18.jpg', 'STU-2345', 'Slot-H8', 'OUT', NOW() - INTERVAL '45 minutes');

-- RFID Card: VWX567 - Long parking session
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'VWX567', 'https://example.com/image19.jpg', 'VWX-5678', 'Slot-I9', 'IN', NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), 'VWX567', 'https://example.com/image20.jpg', 'VWX-5678', 'Slot-I9', 'OUT', NOW() - INTERVAL '10 hours');

-- RFID Card: YZA890 - Very recent, still parked
INSERT INTO parking_events (id, rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
(gen_random_uuid(), 'YZA890', 'https://example.com/image21.jpg', 'YZA-8901', 'Slot-J10', 'IN', NOW() - INTERVAL '5 minutes');

-- Summary of mock data:
-- Total: 20 events
-- Active sessions (still parked): XYZ789, MNO678, YZA890 (3 cards)
-- Completed sessions: ABC123, DEF456 (2 sessions), GHI012, JKL345, PQR901, STU234 (2 sessions), VWX567 (7 completed sessions)
-- Various scenarios: with/without license plates, with/without parking slots, multiple sessions per card

