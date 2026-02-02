# Specification Review: 002-nextjs-golf-portal

**Review Date**: 2026-02-02  
**Reviewer**: Architecture Mode  
**Spec Version**: Draft

---

## Review Acceptance Checklist

### User Stories Quality

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Each story has clear Actor (As a...) | [x] | All 19 stories follow consistent format |
| 2 | Each story has clear Goal (I want...) | [x] | Goals are well-defined |
| 3 | Each story has clear Benefit (so that...) | [x] | Benefits explain business value |
| 4 | Stories are prioritized (P1/P2/P3) | [x] | Clear MVP vs post-MVP distinction |
| 5 | Acceptance scenarios use Given/When/Then | [x] | Consistent BDD format |
| 6 | Stories are independently testable | [x] | Each has "Independent Test" section |

### Data Model Completeness

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | All entities are defined | [ ] | **Event, Score, TeeTimeRequest, EventRegistration, AuditLog models missing from schema** |
| 2 | Relationships are clear | [x] | Foreign keys and relations documented |
| 3 | Required vs optional fields specified | [x] | Prisma schema uses `?` for optional |
| 4 | Primary keys defined | [x] | All use autoincrement Int |
| 5 | Unique constraints specified | [x] | Email unique, TeamCaptain.memberId unique |
| 6 | Field types are appropriate | [x] | Types match business requirements |

### Authentication & Authorization

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Authentication flow described | [x] | NextAuth.js with credentials provider |
| 2 | Roles clearly defined | [x] | Admin, Captain, Member |
| 3 | Role assignment mechanism clear | [x] | isAdmin flag, TeamCaptain table |
| 4 | Password strategy documented | [x] | Shared vs individual passwords clarified |
| 5 | Session management specified | [x] | JWT with role/team info |

### API Design

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | All endpoints listed | [x] | Route structure documented |
| 2 | HTTP methods specified | [ ] | **Only some routes have methods listed** |
| 3 | Request/response formats defined | [ ] | **Only member schema example provided** |
| 4 | Error handling described | [x] | Zod validation shown |
| 5 | Authentication requirements per endpoint | [ ] | **Not specified which routes need admin/captain/member access** |

### Success Criteria

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Criteria are measurable | [x] | Specific time/number thresholds |
| 2 | Performance targets defined | [x] | 3 seconds, 1 second, 50 users |
| 3 | Usability targets defined | [x] | 95% task completion |
| 4 | Accessibility targets defined | [x] | 320px minimum width |

### Edge Cases & Error Handling

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Edge cases documented | [x] | 8 edge cases listed |
| 2 | Conflict resolution described | [x] | Optimistic locking mentioned |
| 3 | Cascade behavior specified | [ ] | **"Should be prevented or cascade handled" is ambiguous** |

---

## Identified Ambiguities & Issues

### Critical Issues (Must Fix)

1. **Missing Prisma Models**: The schema section says "additional models" but Event, Score, TeeTimeRequest, EventRegistration, and AuditLog are not defined. These are core entities.

2. **Event Status Values**: What are the valid status values for an Event? The spec mentions "upcoming" and "completed" but doesn't define all possible states or transitions.

3. **Score Data Structure**: What fields does a Score record contain? Just `totalScore`? Are hole-by-hole scores needed?

4. **Tee Time Request Status Values**: What are the valid statuses? "Pending" and "assigned" are mentioned but what about "rejected" or "cancelled"?

### Medium Issues (Should Clarify)

5. **GuestScore Purpose**: The GuestScore model exists but there's no user story explaining when/how guests are handled. Is this for non-members playing with teams?

6. **Cascade Delete Behavior**: User Story 5 mentions deleting courses not associated with events, but what's the exact constraint? Soft delete or hard delete?

7. **Member Deletion Cascade**: What happens to scores, team memberships, and audit logs when a member is deleted? User Story 14 says "appropriate cascade handling" but doesn't specify.

8. **Tee Time Interval Configuration**: FR-010 says "8-minute intervals (configurable via system settings)" but System Settings only mentions shared password. Where is tee time interval stored?

9. **Audit Log Content**: What actions are logged? What data is captured per log entry? User Story 17 mentions filtering by "action type" but types aren't defined.

### Minor Issues (Nice to Have)

10. **Photo Gallery Display**: How should multiple photos be displayed? Carousel? Grid? Thumbnails?

11. **Score Validation Range**: What's a valid score? The spec mentions "negative" is invalid but doesn't specify min/max.

12. **Email Validation**: Is there a specific email format required? Domain restrictions?

13. **Phone Number Format**: Any format requirements for phone numbers?

---

## Questions Requiring Clarification

1. **Can a member be both an admin AND a team captain?** The role determination in auth code uses if/else which makes roles mutually exclusive.

2. **What happens when a team captain's team is deleted?** Do they lose captain status entirely?

3. **Can an event have no course associated?** The schema should clarify if courseId is required.

4. **Is there a limit on team size?** Minimum/maximum members per team?

5. **Can a team unregister from an event?** No user story covers this.

6. **Can tee time requests be modified after submission?** The captain can only view status, not change requests.

7. **What's the behavior when event status changes from "upcoming" to "completed"?** Are scores still editable?

---

## Recommendations

### Schema Additions Needed

```prisma
model Event {
  id          Int       @id @default(autoincrement())
  name        String
  eventDate   DateTime  @map("event_date")
  courseId    Int       @map("course_id")
  status      String    @default("upcoming")  // Define enum: upcoming, completed, cancelled
  description String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  course      Course    @relation(fields: [courseId], references: [id])
  registrations EventRegistration[]
  teeTimeRequests TeeTimeRequest[]
  scores      Score[]
  guestScores GuestScore[]

  @@map("events")
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

model EventRegistration {
  id          Int       @id @default(autoincrement())
  eventId     Int       @map("event_id")
  teamId      Int       @map("team_id")
  registeredAt DateTime @default(now()) @map("registered_at")

  event       Event     @relation(fields: [eventId], references: [id])
  team        Team      @relation(fields: [teamId], references: [id])

  @@unique([eventId, teamId])  // Team can only register once per event
  @@map("event_registrations")
}

model TeeTimeRequest {
  id              Int       @id @default(autoincrement())
  eventId         Int       @map("event_id")
  teamId          Int       @map("team_id")
  requestedTime   DateTime  @map("requested_time")
  assignedTime    DateTime? @map("assigned_time")
  status          String    @default("pending")  // pending, assigned, rejected
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

model AuditLog {
  id          Int       @id @default(autoincrement())
  memberId    Int?      @map("member_id")
  action      String    // login, logout, create, update, delete
  entityType  String    @map("entity_type")  // member, team, event, score, etc.
  entityId    Int?      @map("entity_id")
  oldValue    Json?     @map("old_value")
  newValue    Json?     @map("new_value")
  ipAddress   String?   @map("ip_address")
  createdAt   DateTime  @default(now()) @map("created_at")

  member      Member?   @relation(fields: [memberId], references: [id])

  @@map("audit_logs")
}
```

### API Route Authorization Matrix Needed

| Route | GET | POST | PUT | DELETE | Required Role |
|-------|-----|------|-----|--------|---------------|
| /api/members | Admin | Admin | - | - | Admin |
| /api/members/[id] | Admin | - | Admin | Admin | Admin |
| /api/teams | Admin,Captain | Admin | - | - | Admin |
| /api/courses | All | Admin | - | - | Authenticated |
| /api/events | All | Admin | Admin | Admin | Authenticated |
| /api/scores | Admin,Captain | Admin,Captain | - | Admin | Admin,Captain |

---

## Summary

**Overall Assessment**: The specification is well-structured with good user story coverage, but missing critical schema definitions for core entities. The authentication and role system is clear after recent clarifications.

**Ready for Implementation**: No - Missing schema definitions should be added first.

**Priority Actions**:
1. Add complete Prisma models for Event, Score, TeeTimeRequest, EventRegistration, AuditLog
2. Define status enums for Event and TeeTimeRequest
3. Clarify cascade delete behavior
4. Add API route authorization matrix
