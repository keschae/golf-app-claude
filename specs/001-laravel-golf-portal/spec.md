# Feature Specification: MCSGA Golf Portal (Laravel Stack)

**Feature Branch**: `001-laravel-golf-portal`  
**Created**: 2026-01-18  
**Status**: Draft  
**Stack**: PHP/Laravel + MySQL + Tailwind CSS + Livewire

## User Scenarios & Testing *(mandatory)*

<!--
  User stories are PRIORITIZED as user journeys ordered by importance.
  Each user story/journey is INDEPENDENTLY TESTABLE.
  
  Priority Definitions:
  - P1 (MVP Core): Member authentication, course/event management, event viewing, profile, team management, tee time requests
  - P2: Captain score entry, full CRUD for administrators
  - P3: Team score reports
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
3. **Given** an administrator viewing a course, **When** they enter photo URLs, **Then** the photos are saved and displayed in order
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
- What happens when a captain is removed from a team? → They lose captain privileges for that team only
- What happens when an event is cancelled? → Status changes, event hidden from dashboard, tee times cancelled
- What happens when a course is deleted that has events? → Deletion should be prevented or cascade handled
- What happens with concurrent score entry? → Last write wins with audit trail
- What happens if shared password is changed while members are logged in? → Existing sessions remain valid until expiry

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via email and password (individual or shared)
- **FR-002**: System MUST enforce role-based access control (Admin, Captain, Member)
- **FR-003**: System MUST display upcoming events on member dashboard
- **FR-004**: System MUST allow administrators to manage courses with photos
- **FR-005**: System MUST allow administrators to manage events with status tracking
- **FR-006**: System MUST allow administrators to manage teams and assign captains
- **FR-007**: System MUST allow team captains to manage their team roster
- **FR-008**: System MUST allow team captains to register teams for events
- **FR-009**: System MUST allow team captains to request tee times
- **FR-010**: System MUST allow administrators to assign tee times in 8-minute intervals (configurable via system settings)
- **FR-011**: System MUST display assigned tee times to team members
- **FR-012**: System MUST allow team captains to enter scores for team members
- **FR-013**: System MUST allow members to view their personal score history
- **FR-014**: System MUST allow administrators to set the shared member password
- **FR-015**: System MUST log all authentication and data modification events
- **FR-016**: System MUST generate event scoring reports
- **FR-017**: System MUST generate teams and members reports

### Key Entities

- **Member**: Individual user with email, name, phone, role (admin/captain/member), team associations
- **Team**: Group of members with name, description, captain designations
- **Course**: Golf course with name, address, photos, Google Maps link, details
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

## Laravel-Specific Implementation Notes

### Authentication Strategy

```php
// Use Laravel Breeze with custom guard for shared password
// Members table has nullable password_hash
// System settings stores shared_member_password

// Custom authentication logic:
// 1. Check if user has individual password → use it
// 2. Otherwise → validate against shared password
```

### Key Packages

| Package | Purpose |
|---------|---------|
| `laravel/breeze` | Authentication scaffolding |
| `spatie/laravel-permission` | Role management (admin, captain, member) |
| `livewire/livewire` | Reactive UI components |
| `intervention/image` | Course photo processing |
| `spatie/laravel-activitylog` | Audit logging |

### Database Migrations

All 13 tables from specs.md Section 3 will be created as Laravel migrations with:
- Eloquent models with relationships
- Form requests for validation
- Policies for authorization

### Directory Structure

```
laravel-golf-portal/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   ├── Captain/
│   │   │   └── Member/
│   │   ├── Livewire/
│   │   └── Requests/
│   ├── Models/
│   ├── Policies/
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── views/
│       ├── admin/
│       ├── captain/
│       ├── member/
│       └── components/
└── tests/
    ├── Feature/
    └── Unit/
```
