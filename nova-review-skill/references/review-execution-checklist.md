# Nova Review Execution Checklist

Use this checklist when running the full reviewer workflow end-to-end.

---

## 1) Pre-Run Setup

- [ ] Confirm project scope (frontend, backend, or both).
- [ ] Confirm branch and working context.
- [ ] Confirm reference files are available:
  - `references/analysis-checklist.md`
  - `references/issue-categories.md`
  - `references/dashboard-design-system.md`
  - `agents/backend-reviewer.md`
  - `agents/frontend-reviewer.md`

---

## 2) Scope and Counting Rules

- [ ] Include source, config, migrations (if backend), and tests relevant to behavior.
- [ ] Exclude generated/vendor artifacts (`node_modules`, build output, coverage, cache).
- [ ] Count only intentionally reviewed files/components/pages/hooks in report totals.

---

## 3) Phase 2 Contract Checks

- [ ] API contract table includes method/path/auth/controller/entity/caller/success/error shape.
- [ ] Frontend-to-API trace exists for critical user flows.
- [ ] Business rules include enforcement point and evidence.
- [ ] Assumptions are marked with confidence and verification notes.

---

## 4) Phase 3 Contract Checks

- [ ] Every issue uses canonical schema:
  - `IssueID`, `Category`, `Code`, `Severity`, `Confidence`
  - `Evidence` (file/line/note)
  - `Trace` (flow + optional entity/api/route/component)
  - `Description`, `Impact`, `Recommendation`
- [ ] Issues are sorted by severity then category.
- [ ] Severity summary and category summary are included.
- [ ] Traceability map is included.

---

## 5) Phase 4 Contract Checks

- [ ] Every task maps to one or more `ISSUE` IDs.
- [ ] Each task includes: dependencies, complexity, acceptance check, risk if deferred, owner track.
- [ ] Execution order is dependency-safe.

---

## 6) Dashboard Track (Phase 5/Track E) Checks

- [ ] Design token set is defined (color/type/spacing/radius/shadow).
- [ ] Layout architecture is defined (sidebar/topbar/content hierarchy + breakpoints).
- [ ] UX state matrix exists for key views (loading/empty/success/error/recovery).
- [ ] Accessibility checklist exists (keyboard/focus/labels/contrast).
- [ ] Motion safety notes exist (purpose, duration/easing, reduced-motion fallback, performance guardrails).

---

## 7) Final Quality Gate

- [ ] Frontend and backend reports are schema-compatible.
- [ ] No ambiguous issue format references remain.
- [ ] Reviewed files list is present.
- [ ] Top risks section is present.
- [ ] Reports are concise but auditable.
