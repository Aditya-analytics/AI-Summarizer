# Product Logic Analysis Checklist

Use this in Phase 2 to ensure thorough coverage of the codebase logic.

---

## Authentication & Authorization

- [ ] How does signup work? (email/password, OAuth, magic link?)
- [ ] How are sessions managed? (JWT, cookies, session store?)
- [ ] Where are tokens validated? (middleware, per-route, or both?)
- [ ] Are refresh tokens implemented?
- [ ] What happens when a token expires? (frontend behavior)
- [ ] Are there user roles? (admin, user, viewer, etc.)
- [ ] Are role checks applied consistently across all routes?
- [ ] Is there a password reset flow? How does it work?

---

## Data Models & Relationships

- [ ] List every DB model / collection / table
- [ ] What are the primary keys and foreign key relationships?
- [ ] Are there soft deletes or hard deletes?
- [ ] Are timestamps tracked (createdAt, updatedAt)?
- [ ] Is there any multi-tenancy? (org/workspace/team model)
- [ ] Are there any many-to-many relationships? How are they joined?
- [ ] Is data ever duplicated for performance? (denormalization)

---

## Core Business Logic

- [ ] What is the primary value action a user performs?
  (e.g., "creates a report", "runs an analysis", "submits a job")
- [ ] What happens step by step when they do that action?
  - Input validation
  - DB writes
  - External API calls
  - Background jobs triggered
  - Notifications sent
  - Dashboard updated
- [ ] Are there any multi-step workflows or wizards?
- [ ] Is there any billing/subscription logic? (Stripe, etc.)
- [ ] Are there usage limits, quotas, or rate limits?
- [ ] Are there any scheduled/cron jobs?

---

## API Design

- [ ] Are REST conventions followed? (GET reads, POST creates, PUT/PATCH updates, DELETE removes)
- [ ] Are response shapes consistent? (same success/error format everywhere)
- [ ] Is pagination implemented where needed?
- [ ] Are query params validated?
- [ ] Is there input sanitization?
- [ ] Are HTTP status codes used correctly? (201 for creation, 400 for validation, 401/403 for auth, 404 for missing, 500 for server errors)
- [ ] Is there an API versioning strategy?

---

## Frontend State & Data Flow

- [ ] How is global state managed? (Redux, Zustand, Context, etc.)
- [ ] How is server state managed? (React Query, SWR, manual fetch, etc.)
- [ ] Is there optimistic updating anywhere?
- [ ] Are API calls made from components directly or via a service layer?
- [ ] How are loading states communicated to users?
- [ ] How are errors communicated to users?
- [ ] Is there client-side caching? For how long?
- [ ] Are form states managed consistently? (react-hook-form, Formik, or ad hoc?)

---

## External Services & Integrations

- [ ] What third-party APIs are called? (list them)
- [ ] Are API keys stored securely? (env vars, not hardcoded)
- [ ] Are external calls retried on failure?
- [ ] Are there webhooks (inbound or outbound)?
- [ ] What happens if an external service is down?

---

## Error Handling

- [ ] Are all async operations wrapped in try/catch?
- [ ] Are errors logged? Where? (console, file, external service?)
- [ ] Do errors bubble up to users in a useful way?
- [ ] Are there global error handlers? (Express error middleware, React Error Boundaries)
- [ ] Are validation errors returned with field-specific messages?

---

## Performance Considerations

- [ ] Are expensive queries optimized with indexes?
- [ ] Is there any caching? (Redis, in-memory, CDN, React Query cache?)
- [ ] Are large data sets paginated?
- [ ] Is there lazy loading for heavy frontend routes/components?
- [ ] Are images and assets optimized?
- [ ] Is there any unnecessary re-rendering in the frontend?
