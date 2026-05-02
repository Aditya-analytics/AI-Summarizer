---
name: nova-review
description: >
  Full-stack AI agent skill for reviewing, auditing, fixing, and redesigning a product codebase end-to-end.
  Use this skill when a user wants to: review their backend and frontend codebase, audit product (Nova or similar SaaS) logic,
  get an end-to-end implementation guide for fixes and improvements, or redesign their dashboard with AI SaaS-grade
  design, animations, and UX. Triggers on phrases like "review my codebase", "analyze backend and frontend",
  "fix and improve my product", "redesign dashboard", "audit my SaaS product", "Nova product review", or
  "agent review my code". Always use this skill when the user wants a structured, phased review-and-build workflow
  across their entire codebase — not just a single file fix.
---

# Nova Review & Redesign Skill

This skill turns the agent into a **structured full-stack product engineer** that audits, plans, fixes, and redesigns
a SaaS product codebase in disciplined phases — never doing everything at once.

---

## Core Principle: One Phase at a Time

> Never implement across phases simultaneously. Complete, confirm, then advance.

The user must explicitly approve each phase before the next begins. At the end of every phase,
present a summary and ask: **"Ready to proceed to Phase [N+1]?"**

---

## Phases Overview

| # | Phase | What Happens |
|---|-------|-------------|
| 1 | **Codebase Audit** | Read every file, map structure, identify patterns |
| 2 | **Product Logic Analysis** | Understand Nova's data flow, business rules, API contracts |
| 3 | **Issue & Improvement Report** | Bugs, missing logic, security gaps, UX debt — prioritized |
| 4 | **Implementation Guide** | Exact file-by-file plan: what to fix, rewrite, or add |
| 5 | **Dashboard Redesign** | New design system, layout, animations, components |
| 6 | **Execute & Deliver** | Implement fixes + redesign, file by file, with output |

---

## Phase 1 — Codebase Audit

**Goal**: Build a complete mental map of the codebase before touching anything.

### Steps

1. **Scan structure**
   ```bash
   find . -type f | grep -v node_modules | grep -v .git | grep -v dist | sort
   ```
   Then view the directory tree to understand layers.

2. **Identify stack** — detect from `package.json`, `requirements.txt`, `go.mod`, etc.
   - Backend: Node/Express, FastAPI, Django, Go, etc.
   - Frontend: React, Next.js, Vue, etc.
   - Database: Postgres, MongoDB, Supabase, etc.
   - Auth: JWT, NextAuth, Clerk, etc.
   - State: Redux, Zustand, React Query, etc.

3. **Read all backend files**: routes, controllers, services, models, middleware, config.

4. **Read all frontend files**: pages, components, hooks, context, API calls, styles.

5. **Map the architecture** — produce this structure in your response:
   ```
   Backend
   ├── Entry: server.js / main.py
   ├── Routes: [list]
   ├── Controllers: [list]
   ├── Services: [list]
   ├── Models / DB Schema: [list]
   └── Middleware: [list]

   Frontend
   ├── Pages / Routes: [list]
   ├── Components: [list]
   ├── API Layer: [list]
   ├── State Management: [describe]
   └── Styling: [describe]
   ```

6. **Do NOT suggest fixes yet.** Just map.

### Phase 1 Output
Present a clean **Codebase Map** with:
- Stack summary (1 paragraph)
- File tree with annotations
- Any immediately obvious anomalies (missing files, circular imports, broken references)

**Then ask**: "Phase 1 complete. Shall I proceed to Phase 2 — Product Logic Analysis?"

---

## Phase 2 — Product Logic Analysis

**Goal**: Understand what Nova *actually does* as a product — not just what the code says.

### Steps

1. **Trace the core user journey** end to end:
   - User signs up → onboards → uses core feature → sees results in dashboard
   - Map every API call, DB query, and state mutation involved

2. **Identify Nova's core entities** (e.g., User, Workspace, Project, Report, etc.)
   - How are they created, updated, deleted?
   - What are the relationships?

3. **Document every API endpoint**:
   ```
   METHOD  /path             Controller        Auth?   Purpose
   POST    /api/auth/login   authController    No      User login
   GET     /api/projects     projectController JWT     List projects
   ...
   ```

4. **Map frontend → backend connections**:
   - Which component calls which API?
   - Is data fetched on mount, on user action, or both?
   - How is loading/error/empty state handled?

5. **Identify the business logic rules**:
   - Validations (client-side and server-side)
   - Access control rules
   - Rate limits, quotas, permissions
   - Background jobs or scheduled tasks

6. **Read**: `references/analysis-checklist.md` for full list of things to check.

### Phase 2 Output
Produce a **Product Logic Document**:
- Nova Product Summary (what it does, for whom)
- Entity map (list of core data models and their relationships)
- Full API contract table
- Frontend → API connection map
- Business logic rules list

**Then ask**: "Phase 2 complete. Shall I proceed to Phase 3 — Issue & Improvement Report?"

---

## Phase 3 — Issue & Improvement Report

**Goal**: Honestly catalog everything wrong or suboptimal — without fixing yet.

### Categories to check

Read `references/issue-categories.md` for the full checklist. Key areas:

**Backend**
- [ ] Missing input validation
- [ ] Unhandled async errors (no try/catch)
- [ ] N+1 queries or missing DB indexes
- [ ] Hardcoded secrets or config in code
- [ ] Missing auth guards on protected routes
- [ ] Inconsistent response shapes across endpoints
- [ ] No request rate limiting
- [ ] Missing logging/observability

**Frontend**
- [ ] API errors shown to users with no handling
- [ ] Missing loading states
- [ ] No optimistic updates where expected
- [ ] Props drilling vs proper state management
- [ ] Broken or missing mobile responsiveness
- [ ] No error boundaries
- [ ] Dead code / unused components
- [ ] Inconsistent component naming patterns

**Architecture**
- [ ] Business logic leaking into components
- [ ] Duplicated code that should be abstracted
- [ ] Missing environment config separation (dev/prod)
- [ ] No test coverage

**Product UX**
- [ ] Confusing flows in the dashboard
- [ ] Missing empty states
- [ ] Missing feedback on user actions (toasts, confirmations)
- [ ] Navigation that doesn't match user expectations

### Issue Format

For each issue found, record:
```
ISSUE-[N]
Category: [SEC | BE | BA | PERF | FE | FA | UX]
Code: [e.g., SEC-003]
Severity: Critical | High | Medium | Low
Confidence: High | Medium | Low
Evidence:
  - File: path/to/file.js
  - Line: N (or range)
  - Note: [short proof from code/behavior]
Trace:
  - Flow: [e.g., signup -> dashboard -> workspace]
  - Entity: [optional, e.g., User, Workspace]
  - API: [optional, e.g., POST /api/auth/login]
Description: What is wrong
Impact: What breaks or degrades because of this
Recommendation: One-line description of the fix intent (no code yet)
```

### Phase 3 Output
Produce a **prioritized issue list** sorted by Severity, grouped by category.
Include a count: `X Critical, Y High, Z Medium, W Low`.
Also include category counts: `SEC: N, BE: N, BA: N, PERF: N, FE: N, FA: N, UX: N`.
Include a traceability section mapping:
- issue -> user flow
- issue -> entity (if applicable)
- issue -> API (if applicable)

**Then ask**: "Phase 3 complete. I found [N] issues. Shall I proceed to Phase 4 — Implementation Guide?"

---

## Phase 4 — Implementation Guide

**Goal**: A precise, file-by-file battle plan. No code yet — just the plan.

### Structure

Group the plan into tracks that can be worked in parallel or sequence:

**Track A — Critical Fixes** (security, broken core flows)
**Track B — Backend Improvements** (validation, error handling, performance)
**Track C — Frontend Fixes** (state, errors, loading states)
**Track D — Architecture Cleanup** (abstractions, env config, code organization)
**Track E — Dashboard Redesign** (handled in Phase 5)

For each item:
```
TASK-[N] | Track [X] | Priority [1-10]
File(s): path/to/file.js
ISSUE refs: ISSUE-3, ISSUE-7
What to do: [1-3 sentence description of the change]
Dependencies: TASK-[M] must complete first (if any)
Estimated complexity: Small (< 30 min) | Medium (30-90 min) | Large (90+ min)
AcceptanceCheck: [how to verify task completion]
RiskIfDeferred: [impact if this task is postponed]
OwnerTrack: [A | B | C | D | E]
```

### Phase 4 Output
Present the full implementation plan as a table, then grouped by track.
Include a **recommended execution order** respecting dependencies.

**Then ask**: "Phase 4 complete. Shall I proceed to Phase 5 — Dashboard Redesign?"

---

## Phase 5 — Dashboard Redesign

**Goal**: Design and spec a world-class AI SaaS dashboard — before writing a line of code.

Read `references/dashboard-design-system.md` before starting this phase.

### Design Principles for Nova Dashboard

1. **AI SaaS Aesthetic** — dark-first, data-dense, purposeful. Think Linear, Vercel, Raycast, Supabase.
2. **Information Hierarchy** — most important metrics always above the fold
3. **Purposeful Motion** — transitions that communicate state, not just look pretty
4. **Progressive Disclosure** — don't overwhelm; surface details on demand
5. **Keyboard-first** — power users expect shortcuts
6. **Responsive** — but optimized for desktop (primary use case for most SaaS dashboards)

### Redesign Steps

1. **Audit current dashboard**
   - Screenshot or describe each screen/view
   - List what data is shown and why
   - Identify what's missing vs what's cluttered

2. **Define the Design System**
   ```
   Colors:
     Background:    #0A0A0F (near-black)
     Surface:       #111118
     Border:        #1E1E2E
     Primary:       [brand color]
     Accent:        [highlight color]
     Text primary:  #F0F0FF
     Text muted:    #6B6B8A

   Typography:
     Display: [chosen font] — headings, metric values
     Body:    [chosen font] — labels, descriptions
     Mono:    [chosen font] — data, code, IDs

   Spacing: 4px base unit, scale: 4, 8, 12, 16, 24, 32, 48, 64

   Radius: 4px (inputs), 8px (cards), 12px (modals)

   Shadows: layered — ambient + direct
   ```

3. **Define Layout Architecture**
   - Sidebar nav (collapsed/expanded states)
   - Top bar (breadcrumbs, global search, user menu)
   - Main content area (grid vs flex layout)
   - Command palette (Cmd+K)

4. **Define Animations**
   - Page transitions: fade + slight vertical shift (150ms ease-out)
   - Data loading: skeleton shimmer → content (200ms stagger)
   - Sidebar: width transition (200ms cubic-bezier)
   - Cards: hover lift (transform: translateY(-2px), shadow increase)
   - Counters: number increment animation on mount
   - Charts: draw-in on mount (600ms ease-out)
   - Toasts: slide in from bottom-right (250ms spring)

5. **Spec each dashboard view**:
   - Main dashboard / home
   - Data/analytics view
   - Settings
   - [any product-specific views found in Phase 1-2]

### Phase 5 Output
Produce a full **Dashboard Design Spec**:
- Design system tokens (colors, type, spacing)
- Layout diagram (ASCII or described)
- Component inventory with behavior spec
- Animation spec table
- UX state matrix (loading, empty, success, error for each key view)
- Accessibility checklist (keyboard flow, focus order, aria, contrast)
- Motion safety notes (reduced-motion behavior and performance guardrails)
- One reference implementation: the main dashboard card/layout as code

**Then ask**: "Phase 5 complete. Ready to execute? I'll implement fixes and redesign track by track. Which track do you want first: A (Critical Fixes), B (Backend), C (Frontend), D (Architecture), or E (Dashboard)?"

---

## Phase 6 — Execute

**Goal**: Implement. One track at a time. One task at a time.

### Rules for Execution

1. **Always show the task reference** before implementing: `Implementing TASK-[N]...`
2. **Read the current file** before editing — never overwrite from memory
3. **Show a diff summary** after each file change: what was removed, what was added, why
4. **Test commands** — after backend changes, show the curl/test to verify
5. **After each task**, confirm: "TASK-[N] complete. Next: TASK-[N+1] — [description]. Proceed?"
6. **Dashboard track (E)** — use the design spec from Phase 5; read `references/dashboard-design-system.md`

### Execution Format per Task

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK-[N] | Track [X] | [Priority]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File: path/to/file

BEFORE (problem):
[brief description or key snippet]

CHANGE:
[implementation]

WHY: [one sentence rationale]

VERIFY: [test command or manual check]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Agent Behavior Rules

These apply across all phases:

- **Never skip a phase** — each phase builds context for the next
- **Never assume** — if a file's purpose is unclear, read it before drawing conclusions
- **Never hallucinate endpoints or component names** — always verify against actual code
- **Preserve intent** — when fixing code, understand what it was trying to do first
- **Flag uncertainty** — if you're unsure about a business rule, surface it in the report
- **Comment your changes** — all new/modified code should have a brief inline comment
- **One file at a time** in Phase 6 — don't batch-modify multiple files in one response
- **Keep responses focused** — per phase, produce only that phase's output
- **Scope reviews correctly** — include source/config/tests; exclude generated/vendor files (`node_modules`, build output, coverage, cache)
- **Use explicit counts** — when reporting file/component counts, include only intentionally reviewed artifacts

---

## Reference Files

Load these when indicated in the phase instructions:

| File | When to Read |
|------|-------------|
| `references/analysis-checklist.md` | Phase 2 — full logic analysis checklist |
| `references/issue-categories.md` | Phase 3 — complete issue taxonomy |
| `references/dashboard-design-system.md` | Phase 5 + Phase 6 Track E |
| `agents/backend-reviewer.md` | If backend is complex (>20 files) |
| `agents/frontend-reviewer.md` | If frontend is complex (>30 components) |
