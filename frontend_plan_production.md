# Frontend Production & Dashboard UI/UX Plan

## Overview
This document serves as the master plan for finalizing the Nova AI dashboard interface and aligning the backend API responses. The goal is to deliver a premium, AI-SaaS-grade learning workspace.

## Bugs & Issues Identified
1. **Backend Artifacts Mapping (`app/routers/summarize.py`):**
   - **Bug:** The `/summarization/documents` endpoint returns `artifacts: [o.style for o in d.output]`. This returns styles (e.g., `"standard"`, `"short"`) instead of the artifact types (`"summary"`, `"notes"`, `"quiz"`).
   - **Impact:** The frontend badges (which check for `'summary'`, `'quiz'`) do not render correctly.
2. **Dashboard Inline Styles (`frontend/src/pages/Dashboard.jsx`):**
   - **Bug/Tech Debt:** The dashboard relies almost entirely on hardcoded inline styles.
   - **Impact:** Difficult to maintain, prevents reuse of the V4 design system, and limits advanced CSS interactions (like hover states and glassmorphism).
3. **Upload UX Disconnect:**
   - **Bug/UX Flaw:** After ingestion and streaming finishes, the modal displays the text but forces the user to manually click "Done", find the newly created document, and click it to open the workspace.
   - **Impact:** Breaks the flow of a modern, seamless AI application.

---

## Wireframing & Design System (Dashboard AI SaaS)

The dashboard will follow a modern, bright white and lite orange/pink (Nova theme) aesthetic with deep shadows and clean typography.

### 1. Sidebar Navigation
- **Visuals:** Pure white background (`#ffffff`), 1px right border (`var(--border)`).
- **Elements:**
  - Top: Brand Logo (Sparkles Icon) + "Nova" text.
  - Middle: Navigation Links ("Overview", "Landing Page") with active state highlighting (light orange background with bold text).
  - Bottom: User Profile section showing Name and "Pro Plan" badge, plus a Logout icon.

### 2. Main Content Area
- **Visuals:** Off-white background (`#FAFAFA`) to make the white cards pop.
- **Header:**
  - Left: Welcome back greeting (`<h1>`) and a subtitle.
  - Right: Primary "New Document" button (`var(--accent)` gradient, glowing box-shadow).
- **Stats Grid:**
  - 3 Cards (Documents Processed, PDFs Analyzed, Web & Media).
  - Styling: Pure white, rounded corners (`20px`), subtle borders matching their specific icon color (orange, purple, blue), and a soft shadow (`0 10px 30px rgba(0,0,0,0.03)`).
- **Recent Documents List:**
  - List of cards representing uploaded files.
  - Each card features: Source Type Badge, Document Title, Date, and Artifact Badges (Summary, Quiz, Notes).
  - Hover Effect: Card slightly lifts (`transform: translateY(-2px)`) with an enhanced shadow.

### 3. Ingestion Modal
- **Visuals:** Glassmorphism overlay (dark semi-transparent), with a crisp white modal centered.
- **Interactions:** Tab switching between PDF, URL, and YouTube.
- **Streaming State:** When uploading, display a sleek animated loader. Once streaming completes, automatically redirect to the workspace.

---

## Phase-Wise Implementation Plan

### Phase 1: Backend Data Alignment
**Goal:** Fix the `artifacts` array returned by the FastAPI backend.
1. Navigate to `app/routers/summarize.py`.
2. Locate the `get_documents` endpoint.
3. Update the list comprehension:
   ```python
   "artifacts": list(set([
       k for o in d.output for k in ["summary", "notes", "quiz"] if getattr(o, k, None)
   ]))
   ```
4. Test the API to ensure `artifacts` now returns `['summary']` instead of `['standard']`.

### Phase 2: Design System CSS Refactoring
**Goal:** Move inline styles to `index.css`.
1. Define new layout classes in `index.css` under a new section `/* ─── DASHBOARD V4 ─── */`.
2. Add classes: `.dash-layout`, `.dash-sidebar`, `.dash-main`, `.dash-stat-card`, `.dash-doc-card`.
3. Introduce CSS variables for the exact theme colors and shadows.

### Phase 3: Dashboard.jsx Component Rebuild
**Goal:** Apply the new CSS classes and improve the UX flow.
1. Remove inline styles from `Dashboard.jsx` and replace them with `className`.
2. Update the `handleStream` function:
   - On successful completion, automatically fetch the new documents, identify the newly created document, and use `navigate('/workspace/' + newDoc.id)` to transition the user smoothly.
3. Enhance the Empty State UI with an animated SVG illustration.

### Phase 4: Polish and Performance
**Goal:** Finalize the "Wow" factor.
1. Add micro-animations (e.g., pulsing loader during AI ingestion).
2. Ensure responsive behavior (collapsing sidebar on smaller screens if necessary).
3. Validate all interactive elements have correct focus and hover states.
