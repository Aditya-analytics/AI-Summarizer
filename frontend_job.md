# 🎨 Frontend Engineering Plan: AI Learning Workspace V3

This document outlines the UI/UX implementation plan, designed to run in parallel with the Backend Engineer's `plan_v2.md` roadmap.

---

## 🧑‍💻 The Collaboration Workflow
1. **Frontend Proposes Plan:** I outline the exact UI components needed for the current Backend Phase.
2. **Backend Designs Mockup:** You (the Product Owner) provide a design image, wireframe, or aesthetic direction for those components.
3. **Frontend Executes:** I review the product owner's design — if it meets the quality bar, I build production-grade UI (micro-animations, error handling, API connections) that looks and feels like a million-dollar SaaS. Otherwise, I'll propose improvements before touching code.

---

## 🚀 Phased Frontend Roadmap

### 🛠️ Frontend Phase 0: Design System & Component Library
* **Goal:** Establish a single source of truth before any feature work begins.
* **Deliverables:**
    * Token system locked in: primary/accent hex values, spacing scale (4px base), border radius convention, shadow levels.
    * Base component library: `Button`, `Input`, `Modal`, `Toast`, `Card`, `Skeleton`, `Badge`.
    * Typography scale: Inter as primary font, defined sizes for H1–H6, body, caption, and code.
    * Color palette: Primary accent + slate/zinc neutrals, semantic colors (success, warning, error, info).
* **Why this comes first:** Every subsequent phase pulls from this system. Without it, each phase drifts visually and accumulates design debt.

---

### 🎨 Frontend Phase 1: Landing Page & Auth (Maps to Backend Phase 7)
* **Goal:** High-conversion entry point and secure authentication.
* **UI Components:**
    * Sleek Landing / Hero Page (value proposition, scroll-triggered animations).
    * Login / Signup Modals (Glassmorphism or sleek dark mode, built from Phase 0 components).
* **UX Details:** Client-side form validation, floating labels, "Signing in..." spinners, custom Toast notifications for auth errors.
* **Error States:** Invalid credentials → inline field error + toast. Network failure → toast with retry CTA. Server 500 → generic fallback message, no raw error exposed to user.
* **Security Note:** Auth tokens will be stored in `httpOnly` cookies (set by the backend), *not* `localStorage`. This eliminates the XSS attack surface. If `localStorage` is used as a temporary tradeoff during development, it must be documented as technical debt and resolved before any production release.

---

### 🎨 Frontend Phase 2: The Dashboard (Maps to Backend Phase 8 & 12)
* **Goal:** The central hub — "My Documents."
* **UI Components:**
    * Dashboard layout with sidebar navigation.
    * Drag-and-drop upload zone for PDFs.
    * Grid view of previously uploaded documents.
* **UX Details:** Upload progress bars, "Empty State" illustrations when no documents exist, smooth hover lift effects on document cards.
* **Error States:** Upload failure (size limit / wrong format) → inline error below drop zone. Failed document fetch → skeleton loaders replaced by an error card with a retry button.

---

### 🎨 Frontend Phase 3: The Playground — Q&A Chat (Maps to Backend Phase 9)
* **Goal:** The core RAG interaction zone.
* **UI Components:**
    * Split-screen layout: source document viewer on the left, chat interface on the right.
    * Chat input with auto-expanding textarea and send button.
* **UX Details:** Animated `...` typing indicator while awaiting an AI response, smooth scroll to new messages, full markdown rendering (bold, italics, code blocks, lists) for AI output.
* **Error States:** Query timeout (>15s) → indicator replaced by an error message with a retry option. Stream interrupted mid-response → partial message flagged with a warning icon and a "Response may be incomplete" label. Backend unavailable → toast notification, input disabled until connection is restored.
* **Note:** The chat layer communicates only with the backend API contract. Frontend has no awareness of, or dependency on, internal infrastructure choices (vector DB, LLM provider, etc.).

---

### 🎨 Frontend Phase 4: The Playground — Interactive Quiz (Maps to Backend Phase 10)
* **Goal:** Gamified learning evaluation.
* **UI Components:**
    * Difficulty selector toggle (Easy / Medium / Hard).
    * Clean multiple-choice card interface.
    * Results summary screen with score breakdown.
* **UX Details:** Micro-animations for correct (green pulse) / incorrect (red shake) answers, smooth horizontal slide transitions between questions, circular progress indicator for score. Celebration animation on quiz completion — subtle and skippable, appropriate for a workspace tool.
* **Error States:** Quiz generation failure → full-screen error state with a regenerate button. Answer submission failure → toast with retry, current question state preserved.

---

### 🎨 Frontend Phase 5: The Playground — Notes & Export (Maps to Backend Phase 11)
* **Goal:** Structured knowledge extraction and export.
* **UI Components:**
    * Rich text viewer for structured notes.
    * Style toggles (Quicksheet vs. Detailed).
    * Download action buttons (PDF, Markdown).
* **UX Details:** Shimmering skeleton loaders while the backend processing runs, checkmark micro-animation on successful download.
* **Error States:** Notes generation failure → error state with a retry button, no broken/empty UI. Export failure → toast notification specifying failure reason (e.g., "Export timed out — try again").

---

## 💅 Aesthetic Standard

The frontend operates from the design token system established in Phase 0. No ad-hoc styling.

- **Typography:** Inter — H1: 48px/700, H2: 32px/600, Body: 16px/400, Caption: 12px/400, Code: `JetBrains Mono` 14px.
- **Color Palette:** Primary accent `#6366F1` (Indigo-500), surface neutrals from Slate-900 → Slate-50, semantic tokens: success `#22C55E`, error `#EF4444`, warning `#F59E0B`, info `#3B82F6`.
- **Spacing Scale:** 4px base unit — 4, 8, 12, 16, 24, 32, 48, 64px.
- **Border Radius:** `sm: 4px`, `md: 8px`, `lg: 16px`, `full: 9999px`.
- **Micro-interactions:** Every interactable element — hover, active, disabled, and focus-ring states — defined at the component level in Phase 0, not patched in per feature.