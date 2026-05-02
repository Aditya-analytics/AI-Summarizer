# 🎨 Frontend Status & Roadmap

This document serves as the guide for the frontend state of Nova AI.

---

## ✅ Current Status (What's Built)
- **Landing Page**: Fully responsive, glassmorphic design with auth-state awareness.
- **Auth System**: `AuthPage` with Login/Register toggle and basic JWT storage logic.
- **Dashboard (V4)**: Workspace grid, "New Workspace" creation flow, and basic stat cards.
- **Workspace Hub**: Multi-source sidebar, selective intelligence checkboxes, and "Research Hub" overview.
- **Chat Interface**: Stream-ready UI with citation support and suggested queries.
- **Learning Tools**: Interactive `QuizPage` and `NotesPage` with Markdown/TXT export.
- **Global Context**: `WorkspaceContext` manages active workspaces, sources, and basic mastery.

---

## 🛠️ Remaining Implementation (The Guide)

### 1. The "Power User" Workspace (High Priority)
- [ ] **Split-Screen Viewer**: Redesign `WorkspacePage` to show the source content (PDF/URL) on the right side of the chat.
- [ ] **Source Metadata**: Update the sidebar to display page counts for PDFs and duration for YouTube videos.
- [ ] **Indexing Animation**: Refine the sidebar transition from `indexing...` to `Ready` with a pulse animation.

### 2. Dashboard Polish & Continuity
- [ ] **Real-Time Stats**: Connect the Dashboard stat row to the backend Mastery Engine.
- [ ] **Workspace Tags**: Implement `Active`, `Near Mastered`, and `Needs Quiz` badges on workspace cards.
- [ ] **Activity Feed**: Add the sidebar feed showing recent study activity across all projects.

### 3. Global Features
- [ ] **Cmd+K Palette**: Build the global command palette for lightning-fast workspace switching.
- [ ] **Onboarding**: Implement the 3-step walkthrough for first-time users.
- [ ] **Settings**: Create the profile and usage metering page.

### 4. Collaboration & Sharing (New)
- [ ] **Share Modal**: Build the UI to invite friends via email and set access levels (Viewer/Editor).
- [ ] **Member List**: Show who has access to the workspace in the sidebar.
- [ ] **Shared Notifications**: Add alerts when a friend adds a source or completes a quiz in a shared workspace.

---

## 🏗️ Implementation Order
1. **Split-Screen Viewer** (Critical for research parity with NotebookLM).
2. **Real-Time Stats & Dashboard Polish**.
3. **Collaboration UI (Share Modal)**.
4. **Onboarding Flow**.
5. **Command Palette (Cmd+K)**.
