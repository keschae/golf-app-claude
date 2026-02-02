# Specification Clarifications

## Password Management for Regular Members

**Date**: 2026-02-02  
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Regular members will not have the ability to create a unique individual password. The authentication system works as follows:

1. **Shared Password Storage**: The shared password is stored directly in each member's `passwordHash` field in the `members` table, not in a separate `system_settings` table.

2. **Password Update Mechanism**: When an administrator changes the shared member password, the system updates the `passwordHash` field for all users with regular member status (i.e., non-admin, non-captain).

3. **No Password Reset Process**: There is no need for a password reset process for regular members. The loose password policy serves as a deterrent to prevent unauthorized access to personal information and golf scores.

4. **Breach Response**: If there is a password breach, an administrator simply resets the shared password for all regular members.

5. **Rationale**: This policy reduces administrative overhead by eliminating support requests concerning email addresses and passwords.

### Impact on Schema

- The `passwordHash` field is now required (not optional) on the `Member` model
- No `system_settings` table is needed for storing the shared password
- The `/api/shared-password/` route handles updating passwords for all regular members

### Impact on Authentication

The NextAuth.js `authorize` function validates credentials against the member's `passwordHash` field regardless of their role. The difference is only in how the password is set:
- Regular members: `passwordHash` is set by admin via shared password update
- Admins/Captains: `passwordHash` is set individually by the user or admin

---

## Team Captain Rules

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

The team captain system has the following rules:

1. **One Team Per Captain**: An individual member can only be captain of one team at a time.

2. **Multiple Captains Per Team**: A single team can have more than one member elevated to team captain status.

3. **Captain Elevation**: Administrators have the authority to:
   - Elevate a regular member to team captain status
   - Demote a team captain back to regular member status

### Impact on Schema

The `TeamCaptain` model enforces the one-team-per-captain constraint via a unique index on `memberId`:

```prisma
model TeamCaptain {
  id        Int      @id @default(autoincrement())
  teamId    Int      @map("team_id")
  memberId  Int      @unique @map("member_id")  // Ensures one team per captain
  
  team      Team     @relation(fields: [teamId], references: [id])
  member    Member   @relation(fields: [memberId], references: [id])
  
  @@map("team_captains")
}
```

---

## Course Photo Limit

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Course photos are limited to a maximum of 3 per golf course:

1. **No Separate Table**: Photo URLs are stored directly in the `Course` model as three optional fields (`photoUrl1`, `photoUrl2`, `photoUrl3`), eliminating the need for a many-to-many relationship.

2. **Simplified Schema**: This reduces database complexity and query overhead.

### Impact on Schema

```prisma
model Course {
  id          Int       @id @default(autoincrement())
  name        String
  address     String?
  description String?
  googleMapsUrl String? @map("google_maps_url")
  photoUrl1   String?   @map("photo_url_1")
  photoUrl2   String?   @map("photo_url_2")
  photoUrl3   String?   @map("photo_url_3")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  events      Event[]

  @@map("courses")
}
```

### Impact on API

- The `/api/courses/[id]/photos/` route is no longer needed
- Photo URLs are managed directly through the `/api/courses/[id]/` PUT endpoint

---

## Event Status Values

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Events have three valid status values:
- `upcoming` - Event is scheduled and visible on member dashboards
- `completed` - Event has concluded; no longer shown on dashboard but scores remain editable
- `cancelled` - Event was cancelled; hidden from dashboard and tee times invalidated

---

## Score Data Structure

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Scores are stored as a simple total score for the game (integer). There is no hole-by-hole score tracking.

Scores can be edited by captains or administrators even after an event is marked as "completed".

---

## Tee Time Request Format

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

1. **Free-form Request**: Captains enter their preferred tee time as free-form text (not a structured DateTime). They can request multiple preferences in a text field.

2. **Admin Assignment**: The administrator reads the request notes and assigns an actual DateTime for the tee time.

3. **Status Values**: Only two statuses are needed:
   - `pending` - Request submitted, awaiting admin assignment
   - `assigned` - Admin has assigned a tee time

4. **No Rejection**: There is no "rejected" status. Every team will receive an assigned time.

5. **No Modification**: Captains cannot modify requests after submission. They can submit multiple requests (text-based preferences) but the system tracks only the latest.

---

## Guest Scores

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Guest scores are used in two scenarios:

1. **Association Member Playing with Different Team**: A member from the golf association who plays with a team other than their primary team for a specific event.

2. **Non-Member Guest**: Someone who is not a member of the association at all but participates in an event.

In both cases:
- The captain enters the guest's first name, last name, and total score
- Guest scores appear in event reports alongside regular member scores
- Guests do not have login accounts

---

## Tee Time Interval Configuration

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

The tee time interval (time between consecutive tee times) is configured per course, not as a system-wide setting. Each course record has a `teeTimeInterval` field (default 8 minutes).

When an admin assigns tee times for an event, they should follow the interval defined by the course associated with that event.

---

## Admin and Captain Dual Role

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

A member CAN be both an administrator AND a team captain simultaneously. The roles are not mutually exclusive.

The authentication code should return both roles when applicable:
- If `isAdmin` is true, the user has admin privileges
- If the user has a TeamCaptain record, they have captain privileges for that team
- A user can have both

---

## Event Registration Removal

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

Administrators can remove a team's registration from an event. Captains cannot unregister their own team. When a registration is removed:
- Any associated tee time request is also deleted
- The team's scores for that event (if any) remain but are orphaned

---

## Team Size Constraints

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

- **Minimum team size**: 2 members (golfers)
- **Maximum team size**: No explicit limit

---

## Audit Log Actions

**Date**: 2026-02-02
**Context**: Next.js Golf Portal (002-nextjs-golf-portal)

### Clarification

The audit log should capture the following actions:

1. **Authentication Events**:
   - `login` - Successful login
   - `logout` - User logout
   - `lockout` - Failed login attempts (if implemented)

2. **Data Modification Events** (for core tables: Member, Team, Event, Score, Course):
   - `create` - New record created
   - `update` - Record modified
   - `delete` - Record removed

Each log entry includes:
- Member who performed the action (if authenticated)
- Action type
- Entity type and ID
- Details (JSON with relevant changes)
- IP address (if available)
- Timestamp
