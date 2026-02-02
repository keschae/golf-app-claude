-- =====================================================
-- SQLite Seed Data for MCSGA Golf Portal
-- =====================================================
-- 
-- Usage:
--   sqlite3 prisma/dev.db < prisma/seed.sql
--
-- Default password for all users: 123456
-- Password hash generated with bcrypt (10 rounds)
-- =====================================================

-- Note: The password hash below is the bcrypt hash of '123456'
-- In production, regenerate this hash using: bcrypt.hash('123456', 10)

-- =====================================================
-- Members (6 users)
-- =====================================================
-- ID 1: Admin
-- ID 2: Captain
-- ID 3-6: Regular members

INSERT INTO members (email, first_name, last_name, phone, password_hash, is_admin, is_active, created_at, updated_at)
VALUES 
  ('admin@mcsga.org', 'Admin', 'User', '555-0100', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 1, 1, datetime('now'), datetime('now')),
  ('captain@example.com', 'Captain', 'Smith', '555-0101', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('john@example.com', 'John', 'Doe', '555-0102', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('jane@example.com', 'Jane', 'Wilson', '555-0103', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('bob@example.com', 'Bob', 'Johnson', '555-0104', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('alice@example.com', 'Alice', 'Brown', '555-0105', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now'));

-- =====================================================
-- Teams (2 teams)
-- =====================================================
-- ID 1: The Eagles
-- ID 2: The Birdies

INSERT INTO teams (team_name, description, is_active, created_at, updated_at)
VALUES 
  ('The Eagles', 'First team of the association', 1, datetime('now'), datetime('now')),
  ('The Birdies', 'Second team of the association', 1, datetime('now'), datetime('now'));

-- =====================================================
-- Team Members
-- =====================================================
-- Team 1 (The Eagles): Captain, John, Jane
-- Team 2 (The Birdies): Bob, Alice

INSERT INTO team_members (team_id, member_id, is_primary_team, joined_at)
VALUES 
  (1, 2, 1, datetime('now')),  -- captain@example.com -> The Eagles (primary)
  (1, 3, 1, datetime('now')),  -- john@example.com -> The Eagles (primary)
  (1, 4, 1, datetime('now')),  -- jane@example.com -> The Eagles (primary)
  (2, 5, 1, datetime('now')),  -- bob@example.com -> The Birdies (primary)
  (2, 6, 1, datetime('now'));  -- alice@example.com -> The Birdies (primary)

-- =====================================================
-- Team Captains
-- =====================================================
-- Captain Smith is captain of The Eagles

INSERT INTO team_captains (team_id, member_id, created_at)
VALUES (1, 2, datetime('now'));  -- captain@example.com is captain of The Eagles

-- =====================================================
-- Courses (2 courses)
-- =====================================================
-- ID 1: Pine Valley Golf Club (8-min tee time interval)
-- ID 2: Lakeside Country Club (10-min tee time interval)

INSERT INTO courses (name, address, description, google_maps_url, photo_url_1, photo_url_2, photo_url_3, tee_time_interval, created_at, updated_at)
VALUES 
  ('Pine Valley Golf Club', '123 Golf Course Road, Springfield, IL 62701', 'A beautiful 18-hole championship course nestled among ancient pines.', 'https://maps.google.com/?q=Pine+Valley+Golf+Club', 'https://example.com/photos/pine-valley-1.jpg', 'https://example.com/photos/pine-valley-2.jpg', NULL, 8, datetime('now'), datetime('now')),
  ('Lakeside Country Club', '456 Lakeview Drive, Chicago, IL 60601', 'Scenic course with water hazards on 12 holes.', 'https://maps.google.com/?q=Lakeside+Country+Club', 'https://example.com/photos/lakeside-1.jpg', NULL, NULL, 10, datetime('now'), datetime('now'));

-- =====================================================
-- Events (2 events)
-- =====================================================
-- ID 1: Spring Championship 2026 (upcoming) at Pine Valley
-- ID 2: Winter Classic 2025 (completed) at Lakeside

INSERT INTO events (name, event_date, course_id, status, description, created_at, updated_at)
VALUES 
  ('Spring Championship 2026', '2026-04-15 08:00:00', 1, 'upcoming', 'Annual spring championship tournament', datetime('now'), datetime('now')),
  ('Winter Classic 2025', '2025-12-10 09:00:00', 2, 'completed', 'End of year classic tournament', datetime('now'), datetime('now'));

-- =====================================================
-- Event Registrations
-- =====================================================
-- Both teams registered for the upcoming Spring Championship

INSERT INTO event_registrations (event_id, team_id, registered_at)
VALUES 
  (1, 1, datetime('now')),  -- The Eagles registered for Spring Championship
  (1, 2, datetime('now')); -- The Birdies registered for Spring Championship

-- =====================================================
-- Tee Time Requests
-- =====================================================
-- The Eagles: assigned 8:00 AM
-- The Birdies: pending

INSERT INTO tee_time_requests (event_id, team_id, request_notes, assigned_time, status, requested_by, assigned_by, created_at, updated_at)
VALUES 
  (1, 1, 'Prefer 8:00 AM or 8:30 AM if available. Early morning works best for our team.', '2026-04-15 08:00:00', 'assigned', 2, 1, datetime('now'), datetime('now')),
  (1, 2, 'Any time after 9:00 AM is fine.', NULL, 'pending', 5, NULL, datetime('now'), datetime('now'));

-- =====================================================
-- Scores (for Winter Classic 2025 - completed event)
-- =====================================================
-- Team 1 scores entered by captain (member_id 2)
-- Team 2 scores entered by admin (member_id 1)

INSERT INTO scores (event_id, member_id, team_id, total_score, entered_by, created_at, updated_at)
VALUES 
  (2, 2, 1, 82, 2, datetime('now'), datetime('now')),  -- Captain Smith: 82
  (2, 3, 1, 88, 2, datetime('now'), datetime('now')),  -- John Doe: 88
  (2, 4, 1, 91, 2, datetime('now'), datetime('now')),  -- Jane Wilson: 91
  (2, 5, 2, 79, 1, datetime('now'), datetime('now')),  -- Bob Johnson: 79 (best score!)
  (2, 6, 2, 85, 1, datetime('now'), datetime('now'));  -- Alice Brown: 85

-- =====================================================
-- Guest Scores
-- =====================================================
-- A guest played with The Eagles at Winter Classic

INSERT INTO guest_scores (event_id, team_id, first_name, last_name, total_score, entered_by, created_at, updated_at)
VALUES (2, 1, 'Guest', 'Player', 95, 2, datetime('now'), datetime('now'));

-- =====================================================
-- Audit Logs
-- =====================================================
-- Sample audit entries

INSERT INTO audit_logs (member_id, action, entity_type, entity_id, details, ip_address, created_at)
VALUES 
  (1, 'login', 'auth', NULL, '{"success":true}', '192.168.1.1', datetime('now')),
  (1, 'create', 'event', 1, '{"name":"Spring Championship 2026"}', '192.168.1.1', datetime('now')),
  (2, 'create', 'score', NULL, '{"eventId":2,"count":3}', '192.168.1.2', datetime('now'));

-- =====================================================
-- Verification Queries (optional - uncomment to verify)
-- =====================================================
-- SELECT 'Members:' as entity, COUNT(*) as count FROM members;
-- SELECT 'Teams:' as entity, COUNT(*) as count FROM teams;
-- SELECT 'Team Members:' as entity, COUNT(*) as count FROM team_members;
-- SELECT 'Team Captains:' as entity, COUNT(*) as count FROM team_captains;
-- SELECT 'Courses:' as entity, COUNT(*) as count FROM courses;
-- SELECT 'Events:' as entity, COUNT(*) as count FROM events;
-- SELECT 'Event Registrations:' as entity, COUNT(*) as count FROM event_registrations;
-- SELECT 'Tee Time Requests:' as entity, COUNT(*) as count FROM tee_time_requests;
-- SELECT 'Scores:' as entity, COUNT(*) as count FROM scores;
-- SELECT 'Guest Scores:' as entity, COUNT(*) as count FROM guest_scores;
-- SELECT 'Audit Logs:' as entity, COUNT(*) as count FROM audit_logs;
