# ⚙️ Backend Status & Roadmap

This document serves as the guide for the backend state of Nova AI.

---

## ✅ Current Status (What's Built)
- **Auth Layer**: `routers/auth.py` handles basic registration and JWT token generation.
- **Ingestion Stubs**: `youtube_service.py` (transcript) and `scraper_service.py` (web) for basic content retrieval.
- **LLM Integration**: `llm_service.py` implements a basic wrapper for Ollama/LLM calls.
- **Summarization**: `routers/summarize.py` handles basic text summarization requests.
- **API Models**: `schemas.py` defines core Pydantic models for auth and summarization.

---

## 🛠️ Remaining Implementation (The Guide)

### 1. The Knowledge Engine (High Priority)
- [ ] **RAG Pipeline**: Implement `services/pipeline.py` to handle chunking, embedding, and retrieval from a vector database.
- [ ] **Vector Database**: Integrate **ChromaDB** to store source embeddings for each workspace.
- [ ] **Streaming Chat (SSE)**: Convert the chat endpoint to support Server-Sent Events with Post-Stream citation generation.

### 2. Multi-Source Persistence
- [ ] **Workspace/Source CRUD**: Implement full Postgres logic to save Workspace-Source relationships (User -> Workspace -> Sources).
- [ ] **Async Indexing**: Integrate **Celery + Redis** to handle document indexing in the background.

### 3. The Learning Logic
- [ ] **Mastery Engine**: Implement the mathematical formula for calculating mastery based on interactions and quiz scores.
- [ ] **Quiz Generator**: Build the logic to generate MCQs from multiple source chunks via the LLM.
- [ ] **Synthesis Engine**: Implement the logic to create "Smart Notes" that aggregate information across all workspace sources.

### 4. Collaboration & Permissions (New)
- [ ] **RBAC (Access Control)**: Implement `UserWorkspace` link table with roles (`owner`, `editor`, `viewer`).
- [ ] **Invitation Logic**: Build the service to invite users by email and generate unique access links.
- [ ] **Shared State Persistence**: Ensure chat history and mastery are synced across all members of a workspace.

---

## 🏗️ Implementation Order
1. **Workspace/Source Persistence** (Critical for saving research sessions).
2. **ChromaDB & RAG Pipeline** (Primary feature).
3. **Collaboration Logic & Permissions**.
4. **Streaming Chat & Citations**.
5. **Mastery Engine & Background Jobs**.
