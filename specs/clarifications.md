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

### 4. Score Entry Scope ⏳

**Issue**: Can captains enter scores for anyone who played with their team, or only permanent members?

**Resolution**: **PENDING - Requires stakeholder input**
- User will discuss with golf association members
- For now, implement for **permanent team members only** (from TEAM_MEMBERS table)
- Design the system to be extensible for "guest players" in the future

**Temporary Implementation**: Score entry form shows only members from TEAM_MEMBERS for the selected team.

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

### 6. Tee Time Request Constraints ⏳

**Issue**: No validation rules specified for tee time requests.

**Resolution**: **PENDING - Needs further specification**
- Tee times in 10-minute intervals (confirmed)
- Earliest/latest times: TBD (likely course-dependent)
- Multiple teams can request same preferred time (admin resolves conflicts)
- Teams without tee time requests: Admin can assign or leave unassigned

**Recommendation**: Add optional `tee_time_start` and `tee_time_end` fields to EVENTS table.

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

### 10. Photo Storage Limits ✅

**Issue**: No limits specified for course photos.

**Resolution**: **Maximum 3 photos per course**
- Photos stored as static links to a directory (not uploaded to database)
- Maximum 3 photos per course
- Photo URL format: `/storage/courses/{course_id}/photo_{1-3}.{ext}`
- Allowed formats: JPG, PNG, WebP
- No file size limit enforced at application level (handled by server config)

**Implementation Note**: Photos are managed as URLs pointing to a file storage location, not binary uploads.

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
-- Optional: tee_time_start TIME NULL
-- Optional: tee_time_end TIME NULL
```

### TEAM_MEMBERS Table
```sql
-- Add constraint: Only one is_primary_team = true per member_id
```

---

## Open Items

| Item | Status | Owner | Notes |
|------|--------|-------|-------|
| Score entry scope (permanent vs event-based) | Pending | User | Awaiting stakeholder discussion |
| Tee time earliest/latest constraints | Pending | User | May be course-dependent |

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-18 | Architecture Review | Initial clarifications document |
