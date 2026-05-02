# Issue Categories & Taxonomy

Use this in Phase 3 to classify and score every issue found in the codebase.

---

## Severity Levels

| Level | Definition | Example |
|-------|-----------|---------|
| **Critical** | Data loss, security breach, or complete feature failure | Unprotected admin route, SQL injection, tokens in source code |
| **High** | Feature broken or severely degraded for users | API crashes on valid input, auth always fails, data not saved |
| **Medium** | Feature works but poorly, or may fail in certain conditions | No error message on 500, missing loading state, memory leak |
| **Low** | Minor quality issue, won't affect most users | Dead code, inconsistent naming, console.log in prod |

---

## Category: Security

- **SEC-001** — Secret keys / API tokens hardcoded in source files
- **SEC-002** — Environment variables committed to version control
- **SEC-003** — Missing authentication on protected route
- **SEC-004** — Missing authorization check (user can access other users' data)
- **SEC-005** — No input sanitization (XSS or injection risk)
- **SEC-006** — Insecure direct object reference (IDOR)
- **SEC-007** — JWT not verified / not expiring
- **SEC-008** — Sensitive data returned in API response unnecessarily (e.g., password hash)
- **SEC-009** — CORS configured too broadly (`*`)
- **SEC-010** — No rate limiting on auth endpoints

---

## Category: Backend Bugs

- **BE-001** — Unhandled promise rejection / missing try-catch
- **BE-002** — Incorrect HTTP status code returned
- **BE-003** — Missing required field validation
- **BE-004** — Race condition in concurrent operations
- **BE-005** — DB transaction missing (partial writes possible)
- **BE-006** — Duplicate DB writes on retry
- **BE-007** — Incorrect query (wrong filter, missing join)
- **BE-008** — Endpoint returns wrong data shape vs what frontend expects
- **BE-009** — Logic error in business rule
- **BE-010** — Missing cascade delete / orphaned records

---

## Category: Backend Architecture

- **BA-001** — Business logic in route handler (should be in service layer)
- **BA-002** — DB queries in controller (should be in model/repository)
- **BA-003** — Duplicated logic across multiple routes
- **BA-004** — No separation of config from code
- **BA-005** — Missing request logging / no observability
- **BA-006** — No global error handler / middleware
- **BA-007** — Inconsistent response envelope (some routes return `{data}`, others return raw)
- **BA-008** — Blocking synchronous operations in async context
- **BA-009** — No database connection pooling

---

## Category: Performance

- **PERF-001** — N+1 query problem (queries inside loops)
- **PERF-002** — Missing database index on filtered/sorted column
- **PERF-003** — Fetching entire table when only a subset needed
- **PERF-004** — Large payload returned when only fields needed
- **PERF-005** — No pagination on list endpoints
- **PERF-006** — Redundant API calls (same data fetched multiple times)
- **PERF-007** — No caching where appropriate
- **PERF-008** — Unnecessary re-renders / useEffect with bad dependency array
- **PERF-009** — Large bundle size (no code splitting)
- **PERF-010** — Images not optimized / no lazy loading

---

## Category: Frontend Bugs

- **FE-001** — API error not caught, component crashes
- **FE-002** — Missing loading state (UI jumps / flickers)
- **FE-003** — Missing empty state (blank screen when no data)
- **FE-004** — Form submits multiple times (no debounce / disabled state)
- **FE-005** — Stale data displayed (cache not invalidated after mutation)
- **FE-006** — Navigation broken / wrong redirect after action
- **FE-007** — Component not cleaning up (event listeners, intervals)
- **FE-008** — Race condition in useEffect (older request resolves after newer)
- **FE-009** — Broken on mobile / viewport issues
- **FE-010** — Accessible only partially (missing aria labels, focus traps)

---

## Category: Frontend Architecture

- **FA-001** — API calls made directly in component (should use hooks or services)
- **FA-002** — Props drilling more than 2 levels deep
- **FA-003** — State that should be global stored in local component
- **FA-004** — Inconsistent component naming (some PascalCase, some camelCase)
- **FA-005** — No error boundary around critical sections
- **FA-006** — Hardcoded strings (should be constants or i18n)
- **FA-007** — Dead code / unused components or imports
- **FA-008** — Inline styles mixed with CSS modules / Tailwind inconsistently
- **FA-009** — Component doing too much (God component — should be split)
- **FA-010** — No consistent pattern for form handling

---

## Category: UX Debt

- **UX-001** — No feedback on user action (button click with no response)
- **UX-002** — Destructive action with no confirmation dialog
- **UX-003** — Error message too technical / not human-readable
- **UX-004** — Success message missing after important action
- **UX-005** — Broken or confusing user flow (user gets stuck)
- **UX-006** — Important information buried / poor information hierarchy
- **UX-007** — Inconsistent interaction patterns (some actions open modal, others navigate)
- **UX-008** — No way to undo an action
- **UX-009** — Page title / breadcrumbs not updated on navigation
- **UX-010** — No onboarding / empty state guidance for new users

---

## Scoring Template

When recording issues, use this format:

```
ISSUE-[N]
Category: [SEC | BE | BA | PERF | FE | FA | UX]
Code: [e.g., SEC-003]
Severity: Critical | High | Medium | Low
File: path/to/file.ts (line N)
Description: [What is wrong — be specific]
Impact: [Who/what is affected and how]
Fix: [One sentence — what the correct behavior should be]
```
