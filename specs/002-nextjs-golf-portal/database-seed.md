# Database Seed Data

This document describes the sample data to be used for development and testing.

## Default Password

All sample users use the password: `123456`

This password should be hashed using bcrypt before storing in the database.

## How to Generate the Seed

### Option 1: Use Prisma Seed (Recommended)

1. Create a file `prisma/seed.ts` with the content from the seed script below
2. Add to `package.json`:
   ```json
   "prisma": {
     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
   }
   ```
3. Run: `npx prisma db seed`

### Option 2: SQLite Direct SQL

If using SQLite, you can execute the SQL statements in the section below directly.

---

## Seed Data Overview

### Members (6 users)

| Email | First Name | Last Name | Role | Team |
|-------|------------|-----------|------|------|
| admin@mcsga.org | Admin | User | Administrator | - |
| captain@example.com | Captain | Smith | Captain | The Eagles |
| john@example.com | John | Doe | Member | The Eagles |
| jane@example.com | Jane | Wilson | Member | The Eagles |
| bob@example.com | Bob | Johnson | Member | The Birdies |
| alice@example.com | Alice | Brown | Member | The Birdies |

### Teams (2 teams)

| Team Name | Description | Captain |
|-----------|-------------|---------|
| The Eagles | First team of the association | Captain Smith |
| The Birdies | Second team of the association | (none) |

### Courses (2 courses)

| Name | Address | Tee Time Interval |
|------|---------|-------------------|
| Pine Valley Golf Club | 123 Golf Course Road, Springfield, IL 62701 | 8 minutes |
| Lakeside Country Club | 456 Lakeview Drive, Chicago, IL 60601 | 10 minutes |

### Events (2 events)

| Name | Date | Course | Status |
|------|------|--------|--------|
| Spring Championship 2026 | April 15, 2026 | Pine Valley | upcoming |
| Winter Classic 2025 | December 10, 2025 | Lakeside | completed |

---

## Prisma Seed Script

```typescript
/**
 * Prisma Database Seed Script
 * 
 * This script populates the database with sample data for development and testing.
 * Run with: npx prisma db seed
 * 
 * Default password for all users: 123456
 * The password is hashed using bcrypt.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash the default password (123456)
  const defaultPasswordHash = await bcrypt.hash('123456', 10);

  // Create Members
  const admin = await prisma.member.create({
    data: {
      email: 'admin@mcsga.org',
      firstName: 'Admin',
      lastName: 'User',
      phone: '555-0100',
      passwordHash: defaultPasswordHash,
      isAdmin: true,
      isActive: true,
    },
  });
  console.log('Created admin:', admin.email);

  const captain = await prisma.member.create({
    data: {
      email: 'captain@example.com',
      firstName: 'Captain',
      lastName: 'Smith',
      phone: '555-0101',
      passwordHash: defaultPasswordHash,
      isAdmin: false,
      isActive: true,
    },
  });
  console.log('Created captain:', captain.email);

  const member = await prisma.member.create({
    data: {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-0102',
      passwordHash: defaultPasswordHash,
      isAdmin: false,
      isActive: true,
    },
  });
  console.log('Created member:', member.email);

  // Create additional members for teams
  const member2 = await prisma.member.create({
    data: {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Wilson',
      phone: '555-0103',
      passwordHash: defaultPasswordHash,
      isAdmin: false,
      isActive: true,
    },
  });

  const member3 = await prisma.member.create({
    data: {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '555-0104',
      passwordHash: defaultPasswordHash,
      isAdmin: false,
      isActive: true,
    },
  });

  const member4 = await prisma.member.create({
    data: {
      email: 'alice@example.com',
      firstName: 'Alice',
      lastName: 'Brown',
      phone: '555-0105',
      passwordHash: defaultPasswordHash,
      isAdmin: false,
      isActive: true,
    },
  });

  // Create Teams
  const team1 = await prisma.team.create({
    data: {
      teamName: 'The Eagles',
      description: 'First team of the association',
      isActive: true,
    },
  });
  console.log('Created team:', team1.teamName);

  const team2 = await prisma.team.create({
    data: {
      teamName: 'The Birdies',
      description: 'Second team of the association',
      isActive: true,
    },
  });
  console.log('Created team:', team2.teamName);

  // Assign members to teams
  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, memberId: captain.id, isPrimaryTeam: true },
      { teamId: team1.id, memberId: member.id, isPrimaryTeam: true },
      { teamId: team1.id, memberId: member2.id, isPrimaryTeam: true },
      { teamId: team2.id, memberId: member3.id, isPrimaryTeam: true },
      { teamId: team2.id, memberId: member4.id, isPrimaryTeam: true },
    ],
  });
  console.log('Assigned members to teams');

  // Designate captain
  await prisma.teamCaptain.create({
    data: {
      teamId: team1.id,
      memberId: captain.id,
    },
  });
  console.log('Designated captain for team:', team1.teamName);

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      name: 'Pine Valley Golf Club',
      address: '123 Golf Course Road, Springfield, IL 62701',
      description: 'A beautiful 18-hole championship course nestled among ancient pines.',
      googleMapsUrl: 'https://maps.google.com/?q=Pine+Valley+Golf+Club',
      photoUrl1: 'https://example.com/photos/pine-valley-1.jpg',
      photoUrl2: 'https://example.com/photos/pine-valley-2.jpg',
      photoUrl3: null,
      teeTimeInterval: 8,
    },
  });
  console.log('Created course:', course1.name);

  const course2 = await prisma.course.create({
    data: {
      name: 'Lakeside Country Club',
      address: '456 Lakeview Drive, Chicago, IL 60601',
      description: 'Scenic course with water hazards on 12 holes.',
      googleMapsUrl: 'https://maps.google.com/?q=Lakeside+Country+Club',
      photoUrl1: 'https://example.com/photos/lakeside-1.jpg',
      photoUrl2: null,
      photoUrl3: null,
      teeTimeInterval: 10,
    },
  });
  console.log('Created course:', course2.name);

  // Create Events
  const upcomingEvent = await prisma.event.create({
    data: {
      name: 'Spring Championship 2026',
      eventDate: new Date('2026-04-15T08:00:00'),
      courseId: course1.id,
      status: 'upcoming',
      description: 'Annual spring championship tournament',
    },
  });
  console.log('Created event:', upcomingEvent.name);

  const completedEvent = await prisma.event.create({
    data: {
      name: 'Winter Classic 2025',
      eventDate: new Date('2025-12-10T09:00:00'),
      courseId: course2.id,
      status: 'completed',
      description: 'End of year classic tournament',
    },
  });
  console.log('Created event:', completedEvent.name);

  // Register teams for upcoming event
  await prisma.eventRegistration.createMany({
    data: [
      { eventId: upcomingEvent.id, teamId: team1.id },
      { eventId: upcomingEvent.id, teamId: team2.id },
    ],
  });
  console.log('Registered teams for upcoming event');

  // Create tee time request for upcoming event
  await prisma.teeTimeRequest.create({
    data: {
      eventId: upcomingEvent.id,
      teamId: team1.id,
      requestNotes: 'Prefer 8:00 AM or 8:30 AM if available. Early morning works best for our team.',
      assignedTime: new Date('2026-04-15T08:00:00'),
      status: 'assigned',
      requestedBy: captain.id,
      assignedBy: admin.id,
    },
  });
  console.log('Created tee time request for team:', team1.teamName);

  await prisma.teeTimeRequest.create({
    data: {
      eventId: upcomingEvent.id,
      teamId: team2.id,
      requestNotes: 'Any time after 9:00 AM is fine.',
      assignedTime: null,
      status: 'pending',
      requestedBy: member3.id,
      assignedBy: null,
    },
  });

  // Create scores for completed event
  await prisma.score.createMany({
    data: [
      { eventId: completedEvent.id, memberId: captain.id, teamId: team1.id, totalScore: 82, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member.id, teamId: team1.id, totalScore: 88, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member2.id, teamId: team1.id, totalScore: 91, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member3.id, teamId: team2.id, totalScore: 79, enteredBy: admin.id },
      { eventId: completedEvent.id, memberId: member4.id, teamId: team2.id, totalScore: 85, enteredBy: admin.id },
    ],
  });
  console.log('Created scores for completed event');

  // Create a guest score for completed event
  await prisma.guestScore.create({
    data: {
      eventId: completedEvent.id,
      teamId: team1.id,
      firstName: 'Guest',
      lastName: 'Player',
      totalScore: 95,
      enteredBy: captain.id,
    },
  });
  console.log('Created guest score');

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        memberId: admin.id,
        action: 'login',
        entityType: 'auth',
        entityId: null,
        details: JSON.stringify({ success: true }),
        ipAddress: '192.168.1.1',
      },
      {
        memberId: admin.id,
        action: 'create',
        entityType: 'event',
        entityId: upcomingEvent.id,
        details: JSON.stringify({ name: upcomingEvent.name }),
        ipAddress: '192.168.1.1',
      },
      {
        memberId: captain.id,
        action: 'create',
        entityType: 'score',
        entityId: null,
        details: JSON.stringify({ eventId: completedEvent.id, count: 3 }),
        ipAddress: '192.168.1.2',
      },
    ],
  });
  console.log('Created audit logs');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## SQLite Direct SQL Statements

If you prefer to seed the database using raw SQL (for SQLite), use the following statements:

```sql
-- Note: Password hash below is bcrypt hash of '123456'
-- You'll need to generate this hash: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy

-- Members
INSERT INTO members (email, first_name, last_name, phone, password_hash, is_admin, is_active, created_at, updated_at)
VALUES 
  ('admin@mcsga.org', 'Admin', 'User', '555-0100', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 1, 1, datetime('now'), datetime('now')),
  ('captain@example.com', 'Captain', 'Smith', '555-0101', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('john@example.com', 'John', 'Doe', '555-0102', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('jane@example.com', 'Jane', 'Wilson', '555-0103', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('bob@example.com', 'Bob', 'Johnson', '555-0104', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now')),
  ('alice@example.com', 'Alice', 'Brown', '555-0105', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrGjfKbm9kV6lxu8.T4kCnMvMqP7Gy', 0, 1, datetime('now'), datetime('now'));

-- Teams
INSERT INTO teams (team_name, description, is_active, created_at, updated_at)
VALUES 
  ('The Eagles', 'First team of the association', 1, datetime('now'), datetime('now')),
  ('The Birdies', 'Second team of the association', 1, datetime('now'), datetime('now'));

-- Team Members (assumes member IDs 1-6 and team IDs 1-2)
INSERT INTO team_members (team_id, member_id, is_primary_team, joined_at)
VALUES 
  (1, 2, 1, datetime('now')),  -- captain@example.com -> The Eagles
  (1, 3, 1, datetime('now')),  -- john@example.com -> The Eagles
  (1, 4, 1, datetime('now')),  -- jane@example.com -> The Eagles
  (2, 5, 1, datetime('now')),  -- bob@example.com -> The Birdies
  (2, 6, 1, datetime('now'));  -- alice@example.com -> The Birdies

-- Team Captains
INSERT INTO team_captains (team_id, member_id, created_at)
VALUES (1, 2, datetime('now'));  -- captain@example.com is captain of The Eagles

-- Courses
INSERT INTO courses (name, address, description, google_maps_url, photo_url_1, photo_url_2, photo_url_3, tee_time_interval, created_at, updated_at)
VALUES 
  ('Pine Valley Golf Club', '123 Golf Course Road, Springfield, IL 62701', 'A beautiful 18-hole championship course', 'https://maps.google.com/?q=Pine+Valley+Golf+Club', 'https://example.com/photos/pine-valley-1.jpg', 'https://example.com/photos/pine-valley-2.jpg', NULL, 8, datetime('now'), datetime('now')),
  ('Lakeside Country Club', '456 Lakeview Drive, Chicago, IL 60601', 'Scenic course with water hazards', 'https://maps.google.com/?q=Lakeside+Country+Club', 'https://example.com/photos/lakeside-1.jpg', NULL, NULL, 10, datetime('now'), datetime('now'));

-- Events
INSERT INTO events (name, event_date, course_id, status, description, created_at, updated_at)
VALUES 
  ('Spring Championship 2026', '2026-04-15 08:00:00', 1, 'upcoming', 'Annual spring championship tournament', datetime('now'), datetime('now')),
  ('Winter Classic 2025', '2025-12-10 09:00:00', 2, 'completed', 'End of year classic tournament', datetime('now'), datetime('now'));

-- Event Registrations
INSERT INTO event_registrations (event_id, team_id, registered_at)
VALUES 
  (1, 1, datetime('now')),
  (1, 2, datetime('now'));

-- Tee Time Requests
INSERT INTO tee_time_requests (event_id, team_id, request_notes, assigned_time, status, requested_by, assigned_by, created_at, updated_at)
VALUES 
  (1, 1, 'Prefer 8:00 AM or 8:30 AM if available', '2026-04-15 08:00:00', 'assigned', 2, 1, datetime('now'), datetime('now')),
  (1, 2, 'Any time after 9:00 AM is fine.', NULL, 'pending', 5, NULL, datetime('now'), datetime('now'));

-- Scores (for completed event)
INSERT INTO scores (event_id, member_id, team_id, total_score, entered_by, created_at, updated_at)
VALUES 
  (2, 2, 1, 82, 2, datetime('now'), datetime('now')),
  (2, 3, 1, 88, 2, datetime('now'), datetime('now')),
  (2, 4, 1, 91, 2, datetime('now'), datetime('now')),
  (2, 5, 2, 79, 1, datetime('now'), datetime('now')),
  (2, 6, 2, 85, 1, datetime('now'), datetime('now'));

-- Guest Scores
INSERT INTO guest_scores (event_id, team_id, first_name, last_name, total_score, entered_by, created_at, updated_at)
VALUES (2, 1, 'Guest', 'Player', 95, 2, datetime('now'), datetime('now'));

-- Audit Logs
INSERT INTO audit_logs (member_id, action, entity_type, entity_id, details, ip_address, created_at)
VALUES 
  (1, 'login', 'auth', NULL, '{"success":true}', '192.168.1.1', datetime('now')),
  (1, 'create', 'event', 1, '{"name":"Spring Championship 2026"}', '192.168.1.1', datetime('now')),
  (2, 'create', 'score', NULL, '{"eventId":2,"count":3}', '192.168.1.2', datetime('now'));
```

---

## Using SQLite with Prisma

To use SQLite instead of PostgreSQL:

1. Update `prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Generate Prisma client and create database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Seed the database:
   ```bash
   npx prisma db seed
   ```

Or use the SQLite shell:
```bash
sqlite3 prisma/dev.db < seed.sql
```
