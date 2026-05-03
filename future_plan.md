# Nova V3: Future Intelligence Roadmap

This document outlines the strategic technical and functional evolution of Nova from a document summarizer to a comprehensive **Research Intelligence System**.

---

## 🎯 Vision for V3
Nova V3 aims to solve the "Context Gap" in AI research by moving beyond simple text processing into multi-modal understanding, precision retrieval, and adaptive learning workflows.

---

## 🚀 Priority 1: Multi-Modal Ingestion (The "Visionary" Engine)
*   **Goal:** Bridge the gap between text and visual data (charts, diagrams, formulas).
*   **Implementation:**
    *   Integrate a **Vision LLM** (e.g., `llava`, `moondream`, or `vision-capable models` via Ollama) during the ingestion pipeline.
    *   Detect non-text regions in PDFs/Images and generate natural language descriptions.
    *   Store visual descriptions in the Vector Store (ChromaDB) to enable querying of visual content.
*   **User Value:** Ask "Explain the diagram on page 5" and get an accurate technical response.

## 🧠 Priority 2: Advanced RAG (Precision Retrieval)
*   **Goal:** Increase answer accuracy and eliminate hallucinations.
*   **Implementation:**
    *   **Hybrid Search:** Combine Vector Semantic Search (Chroma) with Keyword Search (BM25) to catch specific nomenclature and technical codes.
    *   **Cross-Encoder Re-Ranking:** Implement a two-stage retrieval process. Retrieve top 10 chunks -> Re-rank them using a specialized re-ranker model -> Send top 3 to LLM.
    *   **Dynamic Chunking:** Move from fixed-size chunks to **Semantic Chunking** that breaks text at logical thematic boundaries.
*   **User Value:** 40% more accurate answers for complex research queries.

## 💬 Priority 3: Persistent Memory & Context
*   **Goal:** Enable deep, multi-turn conversations about documents.
*   **Implementation:**
    *   **Summary Buffer Memory:** Implement a sliding window that summarizes previous conversation turns to maintain context without hitting LLM tokens limits.
    *   **Document-Relative State:** Store chat history per document in PostgreSQL to allow resuming research sessions days later.
*   **User Value:** "Tell me more about that second point" actually works across multiple turns.

## 🎓 Priority 4: Adaptive Learning (Proactive Tutoring)
*   **Goal:** Move from passive output to active mastery.
*   **Implementation:**
    *   **Weakness Analysis:** Track failed quiz attempts in the database.
    *   **Remedial Generation:** Automatically generate "Refresher Notes" specifically targeting topics the user struggled with in quizzes.
    *   **Spaced Repetition:** Implement a notification system to remind users to review key concepts at optimal intervals.
*   **User Value:** Nova doesn't just summarize; it ensures you actually *learn* the material.

## ⚙️ Priority 5: Infrastructure & Scale
*   **Goal:** Production-grade stability.
*   **Implementation:**
    *   **Task Queues (Celery/Arq):** Offload heavy embedding tasks to background workers to keep the UI snappy during large document ingestion.
    *   **Full Streaming UI:** Ensure Summaries and Quizzes stream word-by-word like Chat for a "zero-wait" feel.
    *   **Offline-First Focus:** Maximize local processing via Ollama to emphasize Nova's "Privacy First" advantage.

---

## 🛠 Next Steps
1.  **Phase 1 (Precision)**: Implement Hybrid Search & Re-ranking.
2.  **Phase 2 (Memory)**: Implement persistent per-document chat history.
3.  **Phase 3 (Vision)**: Prototype Visual RAG for diagram-heavy PDFs.
