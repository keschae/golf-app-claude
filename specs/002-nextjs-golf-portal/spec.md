# Feature Specification: MCSGA Golf Portal (Next.js Stack)

**Feature Branch**: `002-nextjs-golf-portal`  
**Created**: 2026-01-18  
**Status**: Draft  
**Stack**: Next.js 14 + TypeScript + PostgreSQL + Tailwind CSS + Prisma

## User Scenarios & Testing *(mandatory)*

<!--
  User stories are PRIORITIZED as user journeys ordered by importance.
  Each user story/journey is INDEPENDENTLY TESTABLE.
  
  Priority Definitions:
  - P1 (MVP Core): Member authentication, course/event management, event viewing, profile
  - P2: Team management, event team registration, tee time requests
  - P3: Captain score entry, full CRUD for administrators, team score reports
  
  NOTE: User stories are identical to Laravel spec - only implementation differs
-->

### User Story 1 - Member Authentication (Priority: P1) 🎯 MVP

As a member, I want to log in to the portal using my email and password so that I can access member-only features.

**Why this priority**: Authentication is the foundation for all role-based features. Without it, no other functionality can be accessed securely.

**Independent Test**: Can be fully tested by attempting login with valid/invalid credentials and verifying session creation and role-based redirects.

**Acceptance Scenarios**:

1. **Given** a registered member with email "john@example.com", **When** they enter correct email and shared password, **Then** they are logged in and redirected to the dashboard
2. **Given** a team captain with email "captain@example.com", **When** they enter correct email and individual password, **Then** they are logged in with captain privileges visible
3. **Given** an administrator with email "admin@mcsga.org", **When** they enter correct credentials, **Then** they are logged in with full admin menu visible
4. **Given** any user, **When** they enter incorrect credentials, **Then** they see an error message and remain on login page
5. **Given** a logged-in user, **When** they click logout, **Then** their session is destroyed and they are redirected to login

---

### User Story 2 - View Upcoming Events (Priority: P1) 🎯 MVP

As a member, I want to see upcoming golf events on my dashboard so that I know when and where the next outings are scheduled.

**Why this priority**: Event visibility is the core value proposition of the portal - members need to know about upcoming events.

**Independent Test**: Can be tested by logging in as any member and verifying event cards display with correct information.

**Acceptance Scenarios**:

1. **Given** a logged-in member, **When** they view the dashboard, **Then** they see a list of upcoming events with name, date, and course
2. **Given** an event with an assigned tee time for the member's team, **When** viewing the event card, **Then** the assigned tee time is displayed
3. **Given** an event without an assigned tee time, **When** viewing the event card, **Then** "TBD" is shown for tee time
4. **Given** multiple upcoming events, **When** viewing the dashboard, **Then** events are sorted by date (nearest first)

---

### User Story 3 - View Course Details (Priority: P1) 🎯 MVP

As a member, I want to view detailed information about a golf course so that I can prepare for the event.

**Why this priority**: Course information helps members plan their attendance and know what to expect.

**Independent Test**: Can be tested by clicking "View Course Details" from an event card and verifying all course information displays.

**Acceptance Scenarios**:

1. **Given** a logged-in member viewing an event, **When** they click "View Course Details", **Then** they see the course name, description, and address
2. **Given** a course with photos, **When** viewing course details, **Then** a photo gallery is displayed
3. **Given** a course with a Google Maps URL, **When** viewing course details, **Then** a clickable link to Google Maps is shown
4. **Given** a course with additional details, **When** viewing course details, **Then** all course-specific information is displayed

---

### User Story 4 - Manage Member Profile (Priority: P1) 🎯 MVP

As a member, I want to view and edit my profile information so that my contact details are up to date.

**Why this priority**: Members need to maintain accurate contact information for event coordination.

**Independent Test**: Can be tested by navigating to profile, viewing current info, making changes, and verifying persistence.

**Acceptance Scenarios**:

1. **Given** a logged-in member, **When** they click the profile icon, **Then** they see their current profile information
2. **Given** a member viewing their profile, **When** they edit their phone number and save, **Then** the change is persisted
3. **Given** a member viewing their profile, **When** they try to change their email to an existing email, **Then** they see a validation error
4. **Given** a regular member, **When** viewing their profile, **Then** they cannot change their admin status or password

---

### User Story 5 - Course Management (Priority: P1) 🎯 MVP

As an administrator, I want to create and manage golf courses so that events can be associated with course information.

**Why this priority**: Courses must exist before events can be created. This is foundational data.

**Independent Test**: Can be tested by creating a new course, editing it, viewing it in the list, and deleting it.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Courses, **Then** they see a list of all courses
2. **Given** an administrator on the courses page, **When** they click "Add Course" and fill in required fields, **Then** a new course is created
3. **Given** an administrator viewing a course, **When** they enter up to 3 photo URLs, **Then** the photos are saved and displayed in order
4. **Given** an administrator, **When** they edit a course's details, **Then** the changes are saved
5. **Given** an administrator, **When** they delete a course not associated with events, **Then** the course is removed

---

### User Story 6 - Event Management (Priority: P1) 🎯 MVP

As an administrator, I want to create and manage golf events so that members can see upcoming outings.

**Why this priority**: Events are the core content of the portal. Members need to see what's scheduled.

**Independent Test**: Can be tested by creating an event, associating it with a course, and verifying it appears on member dashboards.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Events, **Then** they see a list of all events
2. **Given** an administrator, **When** they create a new event with name, date, and course, **Then** the event is created with "upcoming" status
3. **Given** an administrator, **When** they change an event's status to "completed", **Then** the event no longer appears on member dashboards
4. **Given** an administrator, **When** they edit an event's details, **Then** the changes are reflected immediately

---

### User Story 7 - Team Management for Administrators (Priority: P1) 🎯 MVP

As an administrator, I want to create teams and assign members so that the association is organized into groups.

**Why this priority**: Teams are required for event registration and tee time coordination.

**Independent Test**: Can be tested by creating a team, adding members, designating captains, and verifying relationships.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Teams, **Then** they see a list of all teams
2. **Given** an administrator, **When** they create a new team with a name, **Then** the team is created
3. **Given** an administrator viewing a team, **When** they add members to the team, **Then** the members are associated
4. **Given** an administrator, **When** they designate a member as team captain, **Then** that member gains captain privileges for the team
5. **Given** an administrator, **When** they set a member's primary team, **Then** the member's profile reflects this

---

### User Story 8 - Team Management for Captains (Priority: P1) 🎯 MVP

As a team captain, I want to manage my team's roster so that I can add or remove members.

**Why this priority**: Captains need autonomy to manage their teams without admin intervention.

**Independent Test**: Can be tested by logging in as captain, viewing team, adding/removing members.

**Acceptance Scenarios**:

1. **Given** a team captain, **When** they navigate to Captains Menu > My Team, **Then** they see their team's current roster
2. **Given** a team captain, **When** they add an existing member to their team, **Then** the member is added
3. **Given** a team captain, **When** they remove a member from their team, **Then** the member is removed
4. **Given** a team captain, **When** they try to remove themselves as captain, **Then** they see an error message

---

### User Story 9 - Event Registration (Priority: P1) 🎯 MVP

As a team captain, I want to register my team for an upcoming event so that we can participate.

**Why this priority**: Teams must register before they can request tee times.

**Independent Test**: Can be tested by captain registering team for event and verifying registration appears.

**Acceptance Scenarios**:

1. **Given** a team captain viewing an upcoming event, **When** they click "Register Team", **Then** their team is registered for the event
2. **Given** a team already registered for an event, **When** the captain views the event, **Then** they see "Already Registered"
3. **Given** a registered team, **When** any team member views the event, **Then** they see their team is registered

---

### User Story 10 - Tee Time Requests (Priority: P1) 🎯 MVP

As a team captain, I want to request a preferred tee time for my team so that we can coordinate our arrival.

**Why this priority**: Tee time coordination is essential for event logistics.

**Independent Test**: Can be tested by captain submitting request and admin viewing pending requests.

**Acceptance Scenarios**:

1. **Given** a team captain with a registered team, **When** they navigate to "Request Tee Time", **Then** they see events their team is registered for
2. **Given** a captain selecting an event, **When** they choose a preferred time and submit, **Then** a request is created with "pending" status
3. **Given** a pending request, **When** the captain views it, **Then** they see the status and requested time
4. **Given** an assigned tee time, **When** team members view the event, **Then** they see the assigned time

---

### User Story 11 - Tee Time Assignment (Priority: P1) 🎯 MVP

As an administrator, I want to assign tee times to teams so that the event schedule is organized.

**Why this priority**: Administrators must be able to respond to tee time requests.

**Independent Test**: Can be tested by admin viewing requests, assigning times, and verifying team visibility.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they view pending tee time requests, **Then** they see all requests with team and preferred time
2. **Given** an administrator viewing a request, **When** they assign a time in 8-minute intervals, **Then** the request status changes to "assigned"
3. **Given** assigned tee times for an event, **When** the admin views the event schedule, **Then** they see a timeline of all assignments
4. **Given** an assigned tee time, **When** team members log in, **Then** they see their assigned time on the dashboard

---

### User Story 12 - View Personal Score History (Priority: P1) 🎯 MVP

As a member, I want to view my score history so that I can track my performance over time.

**Why this priority**: Score history is valuable personal data for members.

**Independent Test**: Can be tested by viewing score history page and verifying past scores display.

**Acceptance Scenarios**:

1. **Given** a logged-in member, **When** they navigate to "My Scores", **Then** they see a list of their scores from past events
2. **Given** a member with scores, **When** viewing score history, **Then** scores show event name, date, course, and total score
3. **Given** a member with no scores, **When** viewing score history, **Then** they see a message indicating no scores recorded

---

### User Story 13 - Captain Score Entry (Priority: P2)

As a team captain, I want to enter scores for my team members after an event so that results are recorded.

**Why this priority**: Score entry is important but not required for MVP launch.

**Independent Test**: Can be tested by captain entering scores for team and verifying persistence.

**Acceptance Scenarios**:

1. **Given** a team captain, **When** they navigate to "Enter Scores", **Then** they see events their team participated in
2. **Given** a captain selecting an event, **When** they see the score entry form, **Then** all team members are listed
3. **Given** a captain entering scores, **When** they enter valid scores and save, **Then** all scores are persisted
4. **Given** a captain, **When** they enter an invalid score (e.g., negative), **Then** they see a validation error
5. **Given** existing scores for a member, **When** the captain updates the score, **Then** the new score replaces the old one

---

### User Story 14 - Member CRUD for Administrators (Priority: P2)

As an administrator, I want full CRUD capabilities on members so that I can manage the membership roster.

**Why this priority**: Full member management is needed for ongoing administration.

**Independent Test**: Can be tested by creating, reading, updating, and deleting member records.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Members, **Then** they see a searchable list of all members
2. **Given** an administrator, **When** they create a new member with email, name, **Then** the member is created
3. **Given** an administrator, **When** they set a member as admin, **Then** the member gains admin privileges
4. **Given** an administrator, **When** they set an individual password for a member, **Then** that member can log in with their own password
5. **Given** an administrator, **When** they delete a member, **Then** the member is removed (with appropriate cascade handling)

---

### User Story 15 - Score CRUD for Administrators (Priority: P2)

As an administrator, I want full CRUD capabilities on scores so that I can correct or manage score data.

**Why this priority**: Administrators need to fix data entry errors.

**Independent Test**: Can be tested by creating, editing, and deleting score records.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Scores, **Then** they see all scores with filtering options
2. **Given** an administrator, **When** they create a score for a member/event, **Then** the score is recorded
3. **Given** an administrator, **When** they edit an existing score, **Then** the change is saved with audit log
4. **Given** an administrator, **When** they delete a score, **Then** the score is removed

---

### User Story 16 - System Settings Management (Priority: P2)

As an administrator, I want to manage system settings including the shared password so that I can control access.

**Why this priority**: Shared password management is essential for member access control.

**Independent Test**: Can be tested by changing shared password and verifying member login behavior.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > System Settings, **Then** they see configurable settings
2. **Given** an administrator, **When** they change the shared member password, **Then** all regular members must use the new password
3. **Given** a password change, **When** a member tries the old password, **Then** login fails
4. **Given** a password change, **When** a member uses the new password, **Then** login succeeds

---

### User Story 17 - Audit Log Viewing (Priority: P2)

As an administrator, I want to view audit logs so that I can track system activity and changes.

**Why this priority**: Audit logs are important for accountability but not MVP-critical.

**Independent Test**: Can be tested by performing actions and verifying they appear in logs.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they navigate to Admin > Audit Logs, **Then** they see a list of system activities
2. **Given** audit logs, **When** filtering by date range, **Then** only matching entries are shown
3. **Given** audit logs, **When** filtering by user, **Then** only that user's actions are shown
4. **Given** audit logs, **When** filtering by action type, **Then** only matching actions are shown

---

### User Story 18 - Event Scoring Report (Priority: P3)

As an administrator or captain, I want to view a scoring report for an event so that I can see all results.

**Why this priority**: Reports are valuable but can be added after core functionality.

**Independent Test**: Can be tested by selecting an event and viewing the generated report.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they select an event for reporting, **Then** they see all scores ranked
2. **Given** a team captain, **When** they view a report for an event their team participated in, **Then** they see the full report
3. **Given** a scoring report, **When** viewing, **Then** it shows rank, member name, team, and score
4. **Given** a scoring report, **When** viewing, **Then** it shows total participants and average score

---

### User Story 19 - Teams and Members Report (Priority: P3)

As an administrator, I want to view a report of all teams and their members so that I can see the organization structure.

**Why this priority**: Organizational reports are useful but not MVP-critical.

**Independent Test**: Can be tested by generating the report and verifying all teams/members display.

**Acceptance Scenarios**:

1. **Given** an administrator, **When** they generate the Teams and Members report, **Then** all teams are listed
2. **Given** the report, **When** viewing a team, **Then** all members are shown with captain designation
3. **Given** the report, **When** viewing a member, **Then** their primary team is indicated

---

### Edge Cases

- What happens when a member belongs to multiple teams? → They can view all teams but have one primary team
- What happens when a captain is removed from a team? → They lose captain privileges and are demoted to regular member
- What happens when a member is promoted to captain of a second team? → Rejected; a member can only captain one team
- What happens when multiple members are designated captains for the same team? → Allowed; teams can have multiple captains
- What happens when an event is cancelled? → Status changes, event hidden from dashboard, tee times cancelled
- What happens when a course is deleted that has events? → Deletion should be prevented or cascade handled
- What happens with concurrent score entry? → Optimistic locking with conflict resolution
- What happens if shared password is changed while members are logged in? → JWT tokens remain valid until expiry; passwordHash updated for all regular members

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via email and password (individual or shared)
- **FR-002**: System MUST enforce role-based access control (Admin, Captain, Member)
- **FR-003**: System MUST display upcoming events on member dashboard
- **FR-004**: System MUST allow administrators to manage courses with up to 3 photos
- **FR-005**: System MUST allow administrators to manage events with status tracking
- **FR-006**: System MUST allow administrators to manage teams and assign captains
- **FR-007**: System MUST allow team captains to manage their team roster
- **FR-008**: System MUST allow team captains to register teams for events
- **FR-009**: System MUST allow team captains to request tee times
- **FR-010**: System MUST allow administrators to assign tee times based on the course's tee time interval (default 8 minutes)
- **FR-011**: System MUST display assigned tee times to team members
- **FR-012**: System MUST allow team captains to enter scores for team members
- **FR-013**: System MUST allow members to view their personal score history
- **FR-014**: System MUST allow administrators to update the shared password for all regular members
- **FR-015**: System MUST log all authentication and data modification events
- **FR-016**: System MUST generate event scoring reports
- **FR-017**: System MUST generate teams and members reports

### Key Entities

- **Member**: Individual user with email, name, phone, role (admin/captain/member), team associations
- **Team**: Group of members with name, description, captain designations
- **Course**: Golf course with name, address, up to 3 photo URLs, Google Maps link, details
- **Event**: Golf outing with name, date, course reference, status
- **Score**: Member's score at an event, entered by captain or admin
- **Tee Time Request**: Captain's request for preferred time, admin's assignment
- **Audit Log**: Record of system actions for accountability

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Members can log in and view dashboard within 3 seconds
- **SC-002**: Administrators can create a complete event (with course) in under 5 minutes
- **SC-003**: Team captains can enter all team scores in under 2 minutes
- **SC-004**: System handles 50 concurrent users without performance degradation
- **SC-005**: All CRUD operations complete within 1 second
- **SC-006**: Mobile users can access all features on screens 320px and wider
- **SC-007**: 95% of users can complete primary tasks without assistance

## Next.js-Specific Implementation Notes

### Authentication Strategy

```typescript
// Use NextAuth.js with credentials provider
// Custom logic for shared password vs individual password

// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Find member by email
        const member = await prisma.member.findUnique({
          where: { email: credentials.email },
          include: { teamMembers: true, teamCaptains: true }
        });

        if (!member || !member.isActive) return null;

        // 2. All members have a passwordHash field
        //    - Regular members: passwordHash contains the shared password (updated by admin)
        //    - Admins/Captains: passwordHash contains their individual password
        const isValidPassword = await bcrypt.compare(credentials.password, member.passwordHash);

        if (!isValidPassword) return null;

        // 3. Return user with role information
        //    Note: A member can be BOTH admin AND captain simultaneously
        const roles: string[] = ['member'];  // Everyone is at least a member
        if (member.isAdmin) roles.push('admin');
        if (member.teamCaptains.length > 0) roles.push('captain');
        
        return {
          id: member.id,
          email: member.email,
          name: `${member.firstName} ${member.lastName}`,
          roles: roles,  // Array of roles: ['member'], ['member', 'admin'], ['member', 'captain'], or ['member', 'admin', 'captain']
          captainOfTeamId: member.teamCaptains[0]?.teamId || null,  // Team ID if captain
          teams: member.teamMembers.map(tm => ({ id: tm.teamId, isPrimary: tm.isPrimaryTeam })),
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add roles and team info to JWT
      if (user) {
        token.roles = user.roles;
        token.captainOfTeamId = user.captainOfTeamId;
        token.teams = user.teams;
      }
      return token;
    },
    async session({ session, token }) {
      // Add roles and team info to session
      session.user.roles = token.roles;
      session.user.captainOfTeamId = token.captainOfTeamId;
      session.user.teams = token.teams;
      return session;
    }
  }
};
```

### Key Packages

| Package | Purpose |
|---------|---------|
| `next-auth` | Authentication with credentials provider |
| `prisma` | Type-safe ORM for PostgreSQL |
| `@tanstack/react-query` | Server state management and caching |
| `zod` | Schema validation for forms and API |
| `sharp` | Image processing for course photos |
| `tailwindcss` | Utility-first CSS |
| `@radix-ui/react-*` | Accessible UI primitives |
| `react-hook-form` | Form handling with validation |

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Member {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  firstName     String    @map("first_name")
  lastName      String    @map("last_name")
  phone         String?
  passwordHash  String    @map("password_hash") // Required for all members: shared password for regular members, individual for admins/captains
  isAdmin       Boolean   @default(false) @map("is_admin")
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Primary team is determined via TeamMember.isPrimaryTeam flag
  teamMembers   TeamMember[]
  teamCaptains  TeamCaptain[]
  scores        Score[]
  auditLogs     AuditLog[]
  teeTimeRequests TeeTimeRequest[] @relation("RequestedBy")
  teeTimeAssignments TeeTimeRequest[] @relation("AssignedBy")
  scoresEntered Score[] @relation("EnteredBy")
  guestScoresEntered GuestScore[] @relation("GuestScoresEntered")

  @@map("members")
}

model Team {
  id          Int       @id @default(autoincrement())
  teamName    String    @map("team_name")
  description String?
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  teamMembers    TeamMember[]
  teamCaptains   TeamCaptain[]
  eventRegistrations EventRegistration[]
  teeTimeRequests TeeTimeRequest[]
  scores         Score[]
  guestScores    GuestScore[]

  @@map("teams")
}

model TeamMember {
  id            Int       @id @default(autoincrement())
  teamId        Int       @map("team_id")
  memberId      Int       @map("member_id")
  isPrimaryTeam Boolean   @default(false) @map("is_primary_team")
  joinedAt      DateTime  @default(now()) @map("joined_at")

  team          Team      @relation(fields: [teamId], references: [id])
  member        Member    @relation(fields: [memberId], references: [id])

  @@unique([teamId, memberId])
  @@map("team_members")
}

model TeamCaptain {
  id        Int       @id @default(autoincrement())
  teamId    Int       @map("team_id")
  memberId  Int       @unique @map("member_id")  // One team per captain enforced
  createdAt DateTime  @default(now()) @map("created_at")

  team      Team      @relation(fields: [teamId], references: [id])
  member    Member    @relation(fields: [memberId], references: [id])

  @@map("team_captains")
}

model Course {
  id              Int       @id @default(autoincrement())
  name            String
  address         String?
  description     String?
  googleMapsUrl   String?   @map("google_maps_url")
  photoUrl1       String?   @map("photo_url_1")  // Max 3 photos stored inline
  photoUrl2       String?   @map("photo_url_2")
  photoUrl3       String?   @map("photo_url_3")
  teeTimeInterval Int       @default(8) @map("tee_time_interval")  // Minutes between tee times
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  events          Event[]

  @@map("courses")
}

model Event {
  id          Int       @id @default(autoincrement())
  name        String
  eventDate   DateTime  @map("event_date")
  courseId    Int       @map("course_id")
  status      String    @default("upcoming")  // upcoming, completed, cancelled
  description String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  course              Course              @relation(fields: [courseId], references: [id])
  eventRegistrations  EventRegistration[]
  teeTimeRequests     TeeTimeRequest[]
  scores              Score[]
  guestScores         GuestScore[]

  @@map("events")
}

model EventRegistration {
  id           Int       @id @default(autoincrement())
  eventId      Int       @map("event_id")
  teamId       Int       @map("team_id")
  registeredAt DateTime  @default(now()) @map("registered_at")

  event        Event     @relation(fields: [eventId], references: [id])
  team         Team      @relation(fields: [teamId], references: [id])

  @@unique([eventId, teamId])  // Team can only register once per event
  @@map("event_registrations")
}

model TeeTimeRequest {
  id              Int       @id @default(autoincrement())
  eventId         Int       @map("event_id")
  teamId          Int       @map("team_id")
  requestNotes    String?   @map("request_notes")  // Free-form text for preferred times
  assignedTime    DateTime? @map("assigned_time")
  status          String    @default("pending")  // pending, assigned
  requestedBy     Int       @map("requested_by")
  assignedBy      Int?      @map("assigned_by")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  event           Event     @relation(fields: [eventId], references: [id])
  team            Team      @relation(fields: [teamId], references: [id])
  requestedByMember Member  @relation("RequestedBy", fields: [requestedBy], references: [id])
  assignedByMember Member?  @relation("AssignedBy", fields: [assignedBy], references: [id])

  @@unique([eventId, teamId])  // One request per team per event
  @@map("tee_time_requests")
}

model Score {
  id          Int       @id @default(autoincrement())
  eventId     Int       @map("event_id")
  memberId    Int       @map("member_id")
  teamId      Int       @map("team_id")
  totalScore  Int       @map("total_score")
  enteredBy   Int       @map("entered_by")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  event       Event     @relation(fields: [eventId], references: [id])
  member      Member    @relation(fields: [memberId], references: [id])
  team        Team      @relation(fields: [teamId], references: [id])
  enteredByMember Member @relation("EnteredBy", fields: [enteredBy], references: [id])

  @@unique([eventId, memberId])  // One score per member per event
  @@map("scores")
}

model GuestScore {
  id          Int       @id @default(autoincrement())
  eventId     Int       @map("event_id")
  teamId      Int       @map("team_id")
  firstName   String    @map("first_name")
  lastName    String    @map("last_name")
  totalScore  Int       @map("total_score")
  enteredBy   Int       @map("entered_by")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  event       Event     @relation(fields: [eventId], references: [id])
  team        Team      @relation(fields: [teamId], references: [id])
  enteredByMember Member @relation("GuestScoresEntered", fields: [enteredBy], references: [id])

  @@map("guest_scores")
}

model AuditLog {
  id          Int       @id @default(autoincrement())
  memberId    Int?      @map("member_id")
  action      String    // login, logout, lockout, create, update, delete
  entityType  String    @map("entity_type")  // member, team, event, score, course, etc.
  entityId    Int?      @map("entity_id")
  details     String?   // JSON string with old/new values
  ipAddress   String?   @map("ip_address")
  createdAt   DateTime  @default(now()) @map("created_at")

  member      Member?   @relation(fields: [memberId], references: [id])

  @@map("audit_logs")
}
```

### API Routes Structure

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── members/
│   │   ├── route.ts          # GET (list), POST (create)
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE
│   ├── teams/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       └── members/
│   │           └── route.ts  # Team member management
│   ├── courses/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts      # Photo URLs managed directly via PUT
│   ├── events/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── register/
│   │       │   └── route.ts
│   │       └── tee-times/
│   │           └── route.ts
│   ├── scores/
│   │   └── route.ts
│   ├── shared-password/
│   │   └── route.ts          # PUT (update shared password for all regular members)
│   └── audit-logs/
│       └── route.ts
```

### API Authorization Matrix

| Route | GET | POST | PUT | DELETE | Required Role |
|-------|-----|------|-----|--------|---------------|
| /api/auth/[...nextauth] | All | All | - | - | Public |
| /api/members | Admin | Admin | - | - | Admin |
| /api/members/[id] | Admin | - | Admin | Admin | Admin |
| /api/teams | Auth | Admin | - | - | Authenticated |
| /api/teams/[id] | Auth | - | Admin/Captain* | Admin | Authenticated |
| /api/teams/[id]/members | Admin/Captain* | Admin/Captain* | - | Admin/Captain* | Admin or Team Captain |
| /api/courses | Auth | Admin | - | - | Authenticated |
| /api/courses/[id] | Auth | - | Admin | Admin | Authenticated |
| /api/events | Auth | Admin | - | - | Authenticated |
| /api/events/[id] | Auth | - | Admin | Admin | Authenticated |
| /api/events/[id]/register | Auth | Captain* | - | Admin | Captain for team |
| /api/events/[id]/tee-times | Auth | Captain* | Admin | - | Varies |
| /api/scores | Admin/Captain* | Admin/Captain* | Admin/Captain* | Admin | Admin or Captain |
| /api/shared-password | - | - | Admin | - | Admin |
| /api/audit-logs | Admin | - | - | - | Admin |

*Captain = Only for their own team

### Directory Structure

```
nextjs-golf-portal/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx              # Member dashboard
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── scores/
│   │   │   └── page.tsx
│   │   ├── captain/
│   │   │   ├── team/
│   │   │   │   └── page.tsx
│   │   │   ├── tee-times/
│   │   │   │   └── page.tsx
│   │   │   └── enter-scores/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── members/
│   │   │   │   └── page.tsx
│   │   │   ├── teams/
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   └── page.tsx
│   │   │   ├── courses/
│   │   │   │   └── page.tsx
│   │   │   ├── scores/
│   │   │   │   └── page.tsx
│   │   │   ├── shared-password/
│   │   │   │   └── page.tsx
│   │   │   └── audit-logs/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── [... API routes]
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── forms/                    # Form components
│   ├── tables/                   # Data table components
│   └── layout/                   # Layout components
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── validations/              # Zod schemas
│   └── utils.ts                  # Utility functions
├── hooks/
│   └── use-*.ts                  # Custom React hooks
├── types/
│   └── index.ts                  # TypeScript types
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── tests/
    ├── e2e/                      # Playwright tests
    └── unit/                     # Jest tests
```

### Type Safety Example

```typescript
// types/index.ts
import { z } from "zod";

export const memberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  isAdmin: z.boolean().default(false),
  isActive: z.boolean().default(true),
  // Note: Primary team is managed via TeamMember.isPrimaryTeam, not on Member
});

export type MemberInput = z.infer<typeof memberSchema>;

// API route with validation
// app/api/members/route.ts
import { NextResponse } from "next/server";
import { memberSchema } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const validated = memberSchema.safeParse(body);
  
  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.flatten() },
      { status: 400 }
    );
  }
  
  const member = await prisma.member.create({
    data: validated.data,
  });
  
  return NextResponse.json(member, { status: 201 });
}
```

### React Query Integration

```typescript
// hooks/use-events.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      return res.json();
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: EventInput) => {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
```
