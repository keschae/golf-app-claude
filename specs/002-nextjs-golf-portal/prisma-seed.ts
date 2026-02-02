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
