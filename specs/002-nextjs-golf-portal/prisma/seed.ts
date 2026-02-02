/**
 * Prisma Database Seed Script
 * 
 * This script populates the database with sample data for development and testing.
 * 
 * Usage:
 * 1. Add to package.json:
 *    "prisma": {
 *      "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
 *    }
 * 2. Run: npx prisma db seed
 * 
 * Default password for all users: 123456
 * The password is hashed using bcrypt.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash the default password (123456)
  const defaultPasswordHash = await bcrypt.hash('123456', 10);

  // ========================================
  // Create Members
  // ========================================
  console.log('\n📧 Creating members...');

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
  console.log('  ✓ Created admin:', admin.email);

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
  console.log('  ✓ Created captain:', captain.email);

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
  console.log('  ✓ Created member:', member.email);

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
  console.log('  ✓ Created member:', member2.email);

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
  console.log('  ✓ Created member:', member3.email);

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
  console.log('  ✓ Created member:', member4.email);

  // ========================================
  // Create Teams
  // ========================================
  console.log('\n👥 Creating teams...');

  const team1 = await prisma.team.create({
    data: {
      teamName: 'The Eagles',
      description: 'First team of the association',
      isActive: true,
    },
  });
  console.log('  ✓ Created team:', team1.teamName);

  const team2 = await prisma.team.create({
    data: {
      teamName: 'The Birdies',
      description: 'Second team of the association',
      isActive: true,
    },
  });
  console.log('  ✓ Created team:', team2.teamName);

  // ========================================
  // Assign Members to Teams
  // ========================================
  console.log('\n🔗 Assigning members to teams...');

  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, memberId: captain.id, isPrimaryTeam: true },
      { teamId: team1.id, memberId: member.id, isPrimaryTeam: true },
      { teamId: team1.id, memberId: member2.id, isPrimaryTeam: true },
      { teamId: team2.id, memberId: member3.id, isPrimaryTeam: true },
      { teamId: team2.id, memberId: member4.id, isPrimaryTeam: true },
    ],
  });
  console.log('  ✓ Assigned 5 members to teams');

  // ========================================
  // Designate Team Captains
  // ========================================
  console.log('\n⭐ Designating team captains...');

  await prisma.teamCaptain.create({
    data: {
      teamId: team1.id,
      memberId: captain.id,
    },
  });
  console.log('  ✓', captain.email, 'is captain of', team1.teamName);

  // ========================================
  // Create Courses
  // ========================================
  console.log('\n⛳ Creating courses...');

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
  console.log('  ✓ Created course:', course1.name);

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
  console.log('  ✓ Created course:', course2.name);

  // ========================================
  // Create Events
  // ========================================
  console.log('\n📅 Creating events...');

  const upcomingEvent = await prisma.event.create({
    data: {
      name: 'Spring Championship 2026',
      eventDate: new Date('2026-04-15T08:00:00'),
      courseId: course1.id,
      status: 'upcoming',
      description: 'Annual spring championship tournament',
    },
  });
  console.log('  ✓ Created event:', upcomingEvent.name, '(upcoming)');

  const completedEvent = await prisma.event.create({
    data: {
      name: 'Winter Classic 2025',
      eventDate: new Date('2025-12-10T09:00:00'),
      courseId: course2.id,
      status: 'completed',
      description: 'End of year classic tournament',
    },
  });
  console.log('  ✓ Created event:', completedEvent.name, '(completed)');

  // ========================================
  // Register Teams for Events
  // ========================================
  console.log('\n📝 Registering teams for events...');

  await prisma.eventRegistration.createMany({
    data: [
      { eventId: upcomingEvent.id, teamId: team1.id },
      { eventId: upcomingEvent.id, teamId: team2.id },
    ],
  });
  console.log('  ✓ Registered both teams for', upcomingEvent.name);

  // ========================================
  // Create Tee Time Requests
  // ========================================
  console.log('\n⏰ Creating tee time requests...');

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
  console.log('  ✓ Created tee time request for', team1.teamName, '(assigned: 8:00 AM)');

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
  console.log('  ✓ Created tee time request for', team2.teamName, '(pending)');

  // ========================================
  // Create Scores for Completed Event
  // ========================================
  console.log('\n🏌️ Creating scores for completed event...');

  await prisma.score.createMany({
    data: [
      { eventId: completedEvent.id, memberId: captain.id, teamId: team1.id, totalScore: 82, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member.id, teamId: team1.id, totalScore: 88, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member2.id, teamId: team1.id, totalScore: 91, enteredBy: captain.id },
      { eventId: completedEvent.id, memberId: member3.id, teamId: team2.id, totalScore: 79, enteredBy: admin.id },
      { eventId: completedEvent.id, memberId: member4.id, teamId: team2.id, totalScore: 85, enteredBy: admin.id },
    ],
  });
  console.log('  ✓ Created 5 scores for', completedEvent.name);

  // ========================================
  // Create Guest Score
  // ========================================
  console.log('\n👤 Creating guest score...');

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
  console.log('  ✓ Created guest score for Guest Player (95)');

  // ========================================
  // Create Audit Logs
  // ========================================
  console.log('\n📋 Creating audit logs...');

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
  console.log('  ✓ Created 3 audit log entries');

  // ========================================
  // Summary
  // ========================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ Database seeding completed successfully!');
  console.log('='.repeat(50));
  console.log('\n📊 Summary:');
  console.log('  • Members: 6 (1 admin, 1 captain, 4 regular)');
  console.log('  • Teams: 2');
  console.log('  • Courses: 2');
  console.log('  • Events: 2 (1 upcoming, 1 completed)');
  console.log('  • Scores: 5 + 1 guest');
  console.log('  • Tee Time Requests: 2');
  console.log('  • Audit Logs: 3');
  console.log('\n🔑 Login credentials:');
  console.log('  • Admin: admin@mcsga.org / 123456');
  console.log('  • Captain: captain@example.com / 123456');
  console.log('  • Member: john@example.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
