# MCSGA Golf Portal - Specification Clarifications

**Created**: 2026-01-18  
**Status**: Resolved  
**Related Documents**: [`specs.md`](../specs.md), [`001-laravel-golf-portal/spec.md`](001-laravel-golf-portal/spec.md), [`002-nextjs-golf-portal/spec.md`](002-nextjs-golf-portal/spec.md)

This document captures clarifications made during the specification review process. All items have been resolved and should be incorporated into the main specifications.

---

## Resolved Clarifications

### 1. Authentication Flow ✅

**Issue**: The login flow diagram showed user selecting their type first, but this creates UX friction.

**Resolution**: **Auto-detect authentication method**
- User enters email + password on a single login form
- System checks if user exists and has an individual password → validates against it
- If user exists but has no individual password → validates against shared member password
- Single unified login experience for all users

**Implementation Note**: The login form should NOT ask users to identify their role. The system determines permissions after successful authentication.

---

### 2. Captain Role Elevation & Password ✅

**Issue**: Unclear workflow when a member becomes a team captain.

**Resolution**: **Gradual password requirement with notification**
1. Only administrators can elevate a regular member to captain role
2. Upon elevation, the member does NOT immediately need a password
3. On next login, the newly-elevated captain sees a **persistent notification banner** at the top of the screen
4. Their profile page displays a **constant reminder** to set an individual password
5. Until they set a password, they can still log in with the shared password
6. **Captain features are restricted** until they set their individual password

**UI Requirements**:
- Banner: "You've been made a Team Captain! Please set your individual password to access captain features."
- Profile page: "Set Password" button prominently displayed
- Captain menu items visible but disabled with tooltip: "Set your password to unlock"

---

### 3. Primary Team Data Model ✅

**Issue**: Redundancy between `MEMBERS.primary_team_id` and `TEAM_MEMBERS.is_primary_team`.

**Resolution**: **Consolidate to `TEAM_MEMBERS.is_primary_team` only**
- Remove `MEMBERS.primary_team_id` column from the schema
- Use `TEAM_MEMBERS.is_primary_team` boolean to designate primary team
- Enforce constraint: Only ONE `TEAM_MEMBERS` record per member can have `is_primary_team = true`
- When a member is added to their first team, automatically set `is_primary_team = true`

**Database Change Required**: Remove `primary_team_id` FK from MEMBERS table.

---

### 4. Score Entry Scope ✅

**Issue**: Can captains enter scores for anyone who played with their team, or only permanent members?

**Resolution**: **Support both permanent team members AND guest players**
- Team captains can enter scores for all permanent team members (from TEAM_MEMBERS table)
- Team captains can also add "guest players" for an event
- Guest players are temporary participants who are not permanent team members
- Guest player scores are recorded with the team for that specific event only

**Implementation**:
- Add a GUEST_SCORES table to track guest player scores per event
- Score entry form shows permanent team members plus an "Add Guest" option
- Guest players require: first name, last name, and score
- Guest players do NOT require email or full member registration

---

### 5. Event Registration Workflow ✅

**Issue**: Registration process and deadlines not specified.

**Resolution**: **Registration deadline per event**
- Events have a `registration_deadline` date field
- Teams can only register before the deadline
- After deadline, registration is closed (admin can still manually register if needed)
- Teams can unregister before the deadline

**Database Change Required**: Add `registration_deadline DATE` column to EVENTS table.

---

### 6. Tee Time Request Constraints ✅

**Issue**: No validation rules specified for tee time requests.

**Resolution**: **Event-based tee time configuration with system defaults**

**System Settings (SYSTEM_SETTINGS table)**:
- `default_tee_time_increment`: Default gap between team tee times in minutes (default: **8 minutes**)
- `default_tee_time_slots`: Maximum number of tee time slots per event (default: **100**)

**Event Configuration (EVENTS table)**:
- `tee_time_start`: Starting time for the first tee time of the event (TIME, required for tee time assignment)
- Subsequent tee times are calculated by adding the increment to the previous slot

**Tee Time Assignment Logic**:
1. First team gets `tee_time_start` (e.g., 8:00 AM)
2. Second team gets `tee_time_start + increment` (e.g., 8:08 AM with 8-minute increment)
3. Continue until all teams are assigned or max slots reached
4. Multiple teams can request same preferred time (admin resolves conflicts)
5. Teams without tee time requests: Admin can assign or leave unassigned

**Database Changes Required**:
- Add to EVENTS: `tee_time_start TIME NULL`
- Add to SYSTEM_SETTINGS: `default_tee_time_increment` = '8'
- Add to SYSTEM_SETTINGS: `default_tee_time_slots` = '100'

---

### 7. Score Validation Range ✅

**Issue**: "Reasonable score range" not defined.

**Resolution**: **40-250 inclusive**
- Minimum: 40 (covers exceptional rounds)
- Maximum: 250 (covers beginners and high-handicap players)
- Validation error if score outside this range
- Admin can override if needed (with audit log entry)

---

### 8. Deletion Behavior ✅

**Issue**: Soft delete vs hard delete not specified.

**Resolution**: **Context-dependent deletion rules**

| Entity | Deletion Rule |
|--------|---------------|
| **Members** | Soft delete - mark as `is_active = false`, preserve all history (scores, team memberships, audit logs) |
| **Teams** | Soft delete - mark as `is_active = false`, preserve history |
| **Events** | Hard delete ONLY if no registrations or tee times exist; otherwise prevent deletion |
| **Courses** | Hard delete ONLY if no events reference it; otherwise prevent deletion |
| **Scores** | Hard delete allowed (with audit log) |
| **Tee Time Requests** | Hard delete allowed (with audit log) |

**Database Change Required**: Add `is_active BOOLEAN DEFAULT TRUE` to MEMBERS and TEAMS tables.

---

### 9. Session Timeout ✅

**Issue**: "Appropriate timeout" not specified.

**Resolution**: **30 minutes of inactivity**
- Session expires after 30 minutes of no activity
- User is redirected to login page with message: "Your session has expired. Please log in again."
- No "Remember Me" option for Phase 1 (can be added in Phase 2)

---

### 10. Photo Storage ✅

**Issue**: No limits specified for course photos and unclear if upload or URL entry.

**Resolution**: **URL-based photo references with maximum 3 photos per course**
- Photos are specified via URL entry (not file upload)
- URLs can point to:
  - Local paths on the hosting server (e.g., `/images/courses/pine-valley-1.jpg`)
  - External websites (e.g., `https://example.com/golf-course.jpg`)
- Maximum 3 photos per course
- Allowed formats: JPG, PNG, WebP (validated by file extension in URL)
- No file size limit enforced (external URLs are not validated for size)

**Implementation Note**: Administrators enter URLs directly in the course form. The system does NOT handle file uploads for photos in Phase 1.

---

### 11. Report Sorting ✅

**Issue**: Default sort order for Event Scoring Report not specified.

**Resolution**: **Sort by team name alphabetically (A-Z) as default**
- Event Scoring Report default sort: Team name (A-Z), then member name (A-Z) within team
- Optional sort toggles available: by score (ascending), by member name
- Teams and Members Report: Sort by team name (A-Z)

---

## Schema Updates Required

Based on these clarifications, the following schema changes are needed:

### MEMBERS Table
```sql
-- Remove: primary_team_id column
-- Add: is_active BOOLEAN DEFAULT TRUE
```

### TEAMS Table
```sql
-- Add: is_active BOOLEAN DEFAULT TRUE
```

### EVENTS Table
```sql
-- Add: registration_deadline DATE NULL
-- Add: tee_time_start TIME NULL (starting time for first tee time)
```

### TEAM_MEMBERS Table
```sql
-- Add constraint: Only one is_primary_team = true per member_id
```

### GUEST_SCORES Table (NEW)
```sql
CREATE TABLE GUEST_SCORES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL REFERENCES EVENTS(id),
    team_id INT NOT NULL REFERENCES TEAMS(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    total_score INT NOT NULL,
    entered_by INT NOT NULL REFERENCES MEMBERS(id),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

### SYSTEM_SETTINGS Table (Additional Entries)
```sql
-- Add setting: default_tee_time_increment = '8' (minutes)
-- Add setting: default_tee_time_slots = '100'
```

---

## Open Items

| Item | Status | Owner | Notes |
|------|--------|-------|-------|
| ~~Score entry scope~~ | ✅ Resolved | - | Guest players supported |
| ~~Tee time constraints~~ | ✅ Resolved | - | Event start time + system default increment |

**All open items have been resolved.**

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-18 | Architecture Review | Initial clarifications document |
| 2026-01-19 | Architecture Review | Resolved: Score entry scope (guest players), Tee time constraints (8-min default increment, event start time), Report sorting (team name A-Z), Photo storage (URL-based) |
