## Nova AI — Full feature specification

---

### Frontend features

**Dashboard**

The dashboard is the command centre. It opens with a stat row showing average mastery across all workspaces, total study time this month, total insights generated, and quizzes passed. Below that sits the workspace grid — cards ordered by last-accessed, each showing workspace name, source count, mastery progress bar, colour-coded accent strip, and a status tag (Active, In Progress, Near Mastered, Needs Quiz). A "New Workspace" card lives at the end of the grid as a dashed empty state. The bottom half splits into a recent activity feed (timestamped log of quiz results, source uploads, note exports) and a quick-actions panel surfacing the highest-priority next action per workspace (continue last chat, take overdue quiz, review notes).

**Sidebar navigation**

Persistent dark sidebar with logo, main nav links (Dashboard, Workspaces, Study History, Quiz Results), a pinned workspaces section showing the two most recently accessed with inline mastery bars, and a user chip at the bottom showing name, plan, and days remaining. Active page gets a teal left-border indicator. Workspace nav items show a count badge.

**Workspace hub (source management)**

Left panel of the workspace view. Shows workspace name, the mastery widget (large score number on dark card with progress bar and next-milestone hint), and the full source list. Each source has a checkbox for context toggling, a type badge (PDF / YT / Web), name, and metadata (page count or duration, index status). A live "N of M sources active" counter updates as checkboxes toggle. An "Add source" dashed button opens the source upload modal. Sources in indexing state show a pulsing indicator; indexed sources show a green "Ready" state.

**Source upload modal**

Three-tab modal: PDF upload (drag-and-drop zone with file size limit indicator), YouTube (URL input with thumbnail preview on paste), Web Article (URL input with auto-title fetch). Each tab shows upload/fetch progress inline. On completion the modal closes and the source appears in the list with "Indexing…" status.

**Workspace chat panel**

Centre panel. A toolbar with tool-mode pills (Chat, Focus Mode) and a live "Using N sources" badge. Message thread renders user and AI bubbles with distinct styling. AI bubbles include a citation chip row below each response — chips are clickable and open the source viewer. Streaming responses render token-by-token with a blinking cursor. The input area is a grow-to-fit textarea with Enter-to-send (Shift+Enter for newline) and a send button. An empty chat state prompts three suggested starter questions generated from the indexed sources.

**Source viewer (split mode)**

Activated by clicking a citation chip. Slides in as a right panel, splitting the screen 50/50 with chat. Shows the original source rendered in place — PDF rendered page by page with the cited paragraph highlighted and scrolled into view, YouTube with the player seeked to the cited timestamp, web articles with the cited section highlighted. Close button restores full-width chat.

**Quiz panel**

Right panel in workspace view, switchable from the tab bar. Difficulty selector (Easy / Medium / Hard) at top. Questions rendered as cards with the question text and three or four radio-style options. Selecting an option immediately marks it correct (green) or wrong (red) and locks the card — no second guessing. At the bottom, a score tally updates live. A "Generate new quiz" button requests a fresh set. After completion, a score summary card shows points earned and the mastery delta with a smooth animated counter.

**Smart notes panel**

Right panel, switchable from tab bar. Auto-generated structured document from the workspace sources: an executive summary paragraph, key concepts as labelled sections, a bullet-point glossary of terms, and a "connections" section linking ideas across sources. A toolbar at the top has Export to Markdown and Export to TXT buttons. Notes regenerate when sources are added or removed, with a "Regenerate" button available manually.

**Study history page**

Full-page timeline of all interactions across all workspaces. Filterable by workspace, by activity type (chat session, quiz, note export), and by date range. Each item is expandable to show detail (quiz score breakdown, message count in session). Useful for reviewing learning patterns over time.

**Quiz results page**

Table view of all past quizzes: workspace name, date, difficulty, score, and mastery delta earned. Expandable rows show the individual questions and the user's answers vs correct answers. A per-workspace filter and a difficulty filter live in the toolbar.

**Global search**

Command-palette style (Cmd+K). Searches across workspace names, source names, and indexed source content. Results grouped by type. Clicking a content result opens the workspace with the source viewer focused on that passage.

**Settings page**

Profile section (name, email, avatar), plan and billing section (current plan, usage meters for storage and API calls, upgrade CTA), notification preferences (email digest on mastery milestones), connected integrations (Notion, Obsidian webhook URL), and a danger zone for account deletion.

**Onboarding flow (post-auth)**

Three-step guided flow shown only on first login. Step 1: name the first workspace. Step 2: add at least one source (drop zone is foregrounded, everything else greyed). Step 3: send the first chat message. Progress dots show position. Completion triggers a welcome toast and lands on the workspace view.

---

### Backend features

**Authentication and user management**

JWT-based auth with refresh tokens. OAuth via Google and GitHub. Email/password with bcrypt hashing. Magic link login as an alternative. Rate limiting on auth endpoints. Password reset flow. Session management with device list and revocation.

**Workspace CRUD**

Create, read, update, delete workspaces. Each workspace belongs to a user and stores name, colour accent, created/updated timestamps, and an archived flag. Soft delete so workspaces can be recovered. A workspace has many sources and many quiz sessions.

**Source ingestion pipeline**

PDF: accept upload, store to S3/R2, extract text with PyMuPDF, chunk by paragraph with a 512-token target and 64-token overlap, generate embeddings with `text-embedding-3-small`, store chunks in ChromaDB with metadata `{source_id, workspace_id, page_number, char_offset}`. Status field transitions: `uploading → processing → indexed → error`.

YouTube: accept URL, validate with yt-dlp, fetch transcript via `youtube-transcript-api` (fallback to Whisper transcription if captions unavailable), chunk by 30-second windows, embed and store with `{timestamp_start, timestamp_end}` metadata.

Web article: accept URL, fetch and clean with Trafilatura, extract title and author metadata, chunk and embed same as PDF pipeline. Detect paywalled or JavaScript-rendered pages and return a clear error rather than indexing empty content.

Index status webhook: frontend polls `GET /sources/{id}/status` with exponential backoff, or subscribes via WebSocket for real-time status push.

**RAG chat endpoint**

`POST /chat/stream` accepts `{workspace_id, query, source_ids[], conversation_history[]}`. Embeds the query, queries ChromaDB filtered to the provided source IDs, retrieves top-6 chunks by cosine similarity, re-ranks with a cross-encoder for precision, builds a context-injected prompt, and streams the LLM response via SSE. Each completed stream logs the interaction to the interactions table for mastery calculation. Citations are extracted post-stream by matching response sentences to source chunks and returned as a separate `citations` event on the SSE stream.

**Conversation persistence**

All messages (user and AI) saved to Postgres with `{workspace_id, role, content, citations[], created_at, token_count}`. Conversation history passed on every request up to a context window limit (last 20 messages or 8k tokens, whichever comes first). History browsable via `GET /workspaces/{id}/messages`.

**Quiz generation**

`POST /quiz/generate` accepts `{workspace_id, source_ids[], difficulty, count}`. Uses a structured prompt to generate MCQs grounded in the indexed content, returning JSON with `{question, options[], correct_index, source_reference}`. Difficulty maps to question type: Easy = recall, Medium = comprehension, Hard = application and synthesis across multiple sources. Questions are stored so the same quiz can be reviewed later.

**Quiz submission and mastery engine**

`POST /quiz/{id}/submit` accepts answers array, calculates score, and triggers mastery recalculation. Mastery formula: chat interactions (capped at 30 points, logarithmic curve so the first few sessions matter most), quiz performance (up to 50 points, weighted by difficulty — hard quiz pass is worth 3× an easy pass), notes viewed (10 points flat), source breadth ratio (up to 10 points based on how many sources the user has queried). Score is capped at 100, stored per workspace, and exposed transparently to the user with a breakdown.

**Smart notes generation**

`POST /notes/generate` triggers a multi-step LLM pipeline: first pass summarises each source independently, second pass synthesises across sources into a structured document (summary, key concepts, glossary, cross-source connections). Result stored as Markdown in Postgres. `GET /notes/{workspace_id}/export?format=md|txt` returns the file with appropriate Content-Disposition header for download.

**Storage**

Postgres for all relational data (users, workspaces, sources metadata, messages, quiz sessions, mastery scores). ChromaDB (self-hosted) or Pinecone for vector embeddings. S3-compatible object storage (AWS S3 or Cloudflare R2) for raw uploaded files. Redis for session cache, rate limiting, and job queues.

**Background job system**

Celery with Redis as broker for all async indexing work. Jobs: `index_pdf`, `index_youtube`, `index_web`, `generate_notes`, `send_mastery_milestone_email`. Each job has retry logic (3 attempts with exponential backoff) and dead-letter logging. Job status exposed via `GET /jobs/{id}`.

**LLM abstraction layer**

A single `LLMClient` interface with two implementations: `OpenAIClient` (GPT-4o for production) and `OllamaClient` (Llama 3 for local dev). Swap via environment variable. Both implement `stream(prompt) → AsyncGenerator` and `complete(prompt) → str`. Embedding model is always OpenAI `text-embedding-3-small` (1536 dimensions) for consistency.

**Usage metering**

Track per-user: storage used (MB), API tokens consumed this billing period, number of sources indexed, number of quiz sessions. Enforce plan limits with 429 responses and clear error messages. Expose usage via `GET /account/usage` for the settings page meters.

**Webhook integrations**

Notion: on note export, optionally push Markdown to a user-configured Notion page via the Notion API. Obsidian: generate a `.md` file compatible with Obsidian vault structure (YAML frontmatter with tags, workspace name, date). Both configured with user-provided API keys stored encrypted in Postgres.

---

### UX features and principles

**Progressive disclosure**

New users see a simplified workspace view with only Chat visible. Quiz and Smart Notes tabs unlock after the first chat session completes. This prevents overwhelm while guiding users naturally through the Source-to-Mastery pipeline in the correct order.

**Context toggle feedback loop**

When a user unchecks a source, the chat input placeholder updates to reflect the narrowed context ("Asking across 2 sources — Shor's Paper and IBM Roadmap"). When all sources are unchecked, the input is disabled with a tooltip: "Select at least one source to chat." This makes the toggle feel consequential and educational.

**Streaming response UX**

AI responses stream token-by-token with a blinking cursor on the active word. A "Stop generating" button appears during streaming. Citations appear only after streaming completes, fading in as a separate row. Never show a loading spinner for chat — partial text is always more useful than a spinner.

**Mastery milestone toasts**

At 25%, 50%, 75%, and 100% mastery, a non-intrusive toast appears at the bottom right with the milestone, a one-line note on what drove it ("You passed 3 hard quizzes"), and a suggested next action ("Try exporting your notes"). These replace generic notifications with meaningful, contextual feedback.

**Empty states as onboarding**

Every empty state has a specific CTA. Empty workspace: "Add your first source to get started" with three source-type buttons inline. Empty quiz panel: "Take your first quiz to start building your mastery score" with a generate button. Empty notes: "Generate smart notes once you've chatted with at least one source." Never show a generic "Nothing here yet."

**Keyboard-first navigation**

Cmd+K opens global search. Cmd+Enter sends chat messages. Escape closes modals and the source viewer. J/K to navigate quiz options. Tab-navigable quiz cards. All interactive elements have visible focus rings. This is critical for the researcher audience who lives on keyboards.

**Error states with recovery paths**

Source indexing failure shows the source item in red with a specific reason ("Paywall detected — paste article text manually" or "YouTube captions unavailable — we're transcribing with Whisper, check back in 2 minutes"). Never a generic "Something went wrong." RAG uncertainty: when the AI cannot find relevant content in the selected sources, it responds "I couldn't find clear evidence of this in your selected sources. Try enabling more sources or rephrasing your question" — never hallucinate.

**Mobile responsiveness**

On screens under 768px, the three-column workspace view collapses: the source sidebar becomes a bottom sheet triggered by a "Sources" button, the right panel (quiz/notes) becomes a full-screen overlay, and the chat is full width. The dashboard workspace grid goes to a single column. The sidebar becomes a bottom navigation bar with four icon buttons.

**Accessibility**

All interactive elements have ARIA labels. Citation chips are keyboard-focusable and have descriptive labels ("Jump to Shor's Paper, page 4"). Mastery score changes are announced via ARIA live regions. Colour is never the only differentiator — status tags use text labels alongside colour. Quiz correct/wrong states use icons (checkmark, X) in addition to colour. Minimum tap target size 44×44px throughout.

**Perceived performance**

Workspace cards and stat numbers render with skeleton loaders (not spinners) on first load. Source list renders immediately with metadata, index status loads asynchronously. Chat history renders the last 10 messages immediately on workspace open, older messages load on scroll. Smart notes show a cached version instantly and refresh in the background if sources have changed since last generation.