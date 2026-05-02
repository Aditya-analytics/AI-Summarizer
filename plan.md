# Implementation Plan: AI Summarizer V2

This plan outlines the approach, required libraries, and step-by-step execution to implement the advanced features discussed in our roadmap.

## User Review Required
> [!IMPORTANT]
> Please review this chronological plan. The steps are ordered from easiest (highest fast-impact UI wins) to the most complex (parsing documents). Let me know if you approve this order before we begin execution!

---

## Proposed Changes

### Phase 1: Frontend Polish & Dynamic Prompts
This phase focuses on making the visual output look like a premium application and allowing basic prompt modifications.

**Approach & Steps:**
1. Update `frontend.html` with **marked.js** to convert the raw streamed text from Ollama into beautiful, readable HTML tags (bolding, lists, headers).
2. Add UI controls: a dropdown for "Summary Tone" (Professional, ELI5) and a slider for "Length".
3. Update FastAPI `Prompt` Pydantic model to receive those new variables, and dynamically inject them into `SYSTEM_PROMPT`.

**Libraries Used:**
- `marked.js` (Frontend, via CDN)
- `FastAPI`, `Pydantic` (Backend)

---

### Phase 2: URL & Web-Scraping Support
This phase handles the logic for a user pasting a regular Wikipedia or news article link instead of raw text.

**Approach & Steps:**
1. Add a logic gate in the backend: if the input is a valid URL, trigger the web-scraper.
2. Fetch the HTML page and extract only the meaningful article text (ignoring navbars and sidebars).
3. Feed the scraped text directly into the existing summarization function.

**Libraries Used:**
- `beautifulsoup4` (DOM Parsing)
- `httpx` (Async HTTP fetching)
- `validators` (Checking if string is a URL)

---

### Phase 3: YouTube Video Summarization
This phase captures the extremely popular use-case of summarizing long podcasts or videos.

**Approach & Steps:**
1. Add logic to identify `youtube.com` or `youtu.be` links.
2. Parse the Video ID from the URL.
3. Automatically download the video's auto-generated subtitle transcript.
4. Merge the transcript timestamps into one unified paragraph and send to Ollama.

**Libraries Used:**
- `youtube-transcript-api` (Extremely fast, no heavy web scraping needed)

---

### Phase 4: Document Upload Processing (PDFs & Documents)
This phase introduces the drag-and-drop feature for handling physical files.

**Approach & Steps:**
1. Build a separate `/upload` FastAPI endpoint that expects an `UploadFile`.
2. Depending on the file extension (`.pdf` or `.docx`), use the respective library to parse out the raw text.
3. Once the text is extracted, process it exactly like the previous phases.
4. Update the frontend with a simple drag-and-drop file zone.

**Libraries Used:**
- `PyMuPDF` (Fastest and most accurate library for PDF text extraction)
- `python-docx` (For Word Document extraction)
- `python-multipart` (Required for FastAPI file uploads)

---

### Phase 5: Backend Concurrency (Async Refactor)
This phase scales your backend to survive heavy traffic.

**Approach & Steps:**
1. Remove the synchronous `requests` library in `llm.py`.
2. Implement `httpx.AsyncClient()` so the FastAPI event-loop never freezes when chatting with Ollama.
3. This is pure code-design optimization; the user will not see a difference except for performance at scale.

**Libraries Used:**
- `httpx` (Async HTTP library standard)

## Verification Plan
1. **Manual Testing Phase 1**: Select different tone modifiers and verify Ollama respects the new tone. Check if markdown renders correctly.
2. **Manual Testing Phase 2-4**: Paste URLs, file-uploads, and YouTube links. Monitor FastAPI logs to verify the correct parser was cleanly invoked, followed by a valid stream response.
3. **Async Test**: Run multiple HTTP requests simultaneously to ensure `httpx` safely multiplexes requests to Ollama without server deadlocks.
