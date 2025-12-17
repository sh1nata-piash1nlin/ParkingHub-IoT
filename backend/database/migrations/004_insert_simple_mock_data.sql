-- Simple mock data for quick testing
-- This creates a few parking events with realistic timestamps

-- Scenario 1: Car entered 3 hours ago, left 1 hour ago
INSERT INTO parking_events (rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
('TEST001', 'https://example.com/test1.jpg', 'TEST-001', 'A1', 'IN', NOW() - INTERVAL '3 hours'),
('TEST001', 'https://example.com/test2.jpg', 'TEST-001', 'A1', 'OUT', NOW() - INTERVAL '1 hour');

-- Scenario 2: Car entered 2 hours ago, still parked
INSERT INTO parking_events (rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
('TEST002', 'https://example.com/test3.jpg', 'TEST-002', 'B2', 'IN', NOW() - INTERVAL '2 hours');

-- Scenario 3: Car entered 30 minutes ago, still parked
INSERT INTO parking_events (rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
('TEST003', 'https://example.com/test4.jpg', 'TEST-003', 'C3', 'IN', NOW() - INTERVAL '30 minutes');

-- Scenario 4: Car entered 5 hours ago, left 4 hours ago (quick visit)
INSERT INTO parking_events (rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
('TEST004', 'https://example.com/test5.jpg', 'TEST-004', 'D4', 'IN', NOW() - INTERVAL '5 hours'),
('TEST004', 'https://example.com/test6.jpg', 'TEST-004', 'D4', 'OUT', NOW() - INTERVAL '4 hours');

-- Scenario 5: Car with no license plate info
INSERT INTO parking_events (rfid_id, image_path, license_plate, parking_slot, event_type, created_at) VALUES
('TEST005', 'https://example.com/test7.jpg', NULL, 'E5', 'IN', NOW() - INTERVAL '1 hour'),
('TEST005', 'https://example.com/test8.jpg', NULL, 'E5', 'OUT', NOW() - INTERVAL '30 minutes');

