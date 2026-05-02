# ✨ Nova AI: The Research Intelligence Workspace

Nova AI is a professional-grade learning and research platform that transforms scattered data into structured knowledge. Inspired by systems like NotebookLM, Nova allows users to aggregate diverse sources—PDFs, YouTube videos, and web articles—into **Intelligence Workspaces** for multi-dimensional analysis.

---

## 🧠 Product Philosophy

The core of Nova is the **"Source-to-Mastery" Pipeline**. Unlike simple summarizers that treat documents as one-off tasks, Nova treats them as persistent knowledge assets. The goal is not just to "read" a document, but to **master** it through AI-driven interaction, validation, and synthesis.

---

## 🚀 Key Features

### 1. Multi-Source Research Hub
- **Workspaces as Containers**: Group related materials (e.g., "Quantum Computing Research") into a single workspace.
- **Selective Intelligence**: Use checkboxes to toggle specific sources on/off, allowing the AI to focus its context on exactly what you need.
- **Source Viewer**: Side-by-side preview of original PDFs and videos within the workspace.

### 2. AI Analysis Suite
- **Contextual Chat (RAG)**: Chat with your entire workspace. The AI provides verified answers with source citations.
- **Adaptive Quizzing**: Generate difficulty-aware (Easy/Medium/Hard) MCQs to test your understanding.
- **Smart Synthesis (Notes)**: Automatically generate structured study guides and export them to Markdown or Text formats.

### 3. Mastery Tracking & Gamification
- **Mastery Scores**: Every workspace tracks your learning progress (0-100%) based on your interactions and quiz results.
- **Study Stats**: Global dashboard tracking study time, total insights generated, and active research sessions.

---

## 🔄 The Nova Workflow

1. **Ingest**: Create a new Workspace and upload multiple sources (PDF, URL, YouTube).
2. **Process**: Nova AI indexes the sources, creating a searchable vector knowledge base.
3. **Interact**: Use the **Workspace Chat** to synthesize information across all selected sources.
4. **Validate**: Take an AI-generated **Quiz** to verify your knowledge and increase your Mastery score.
5. **Output**: Review the **Smart Notes** and export your structured findings for external use.

---

## 🛠️ Technical Architecture

### Frontend (The Specification)
- **Core**: React (Vite) with a modular Component-Based Architecture.
- **State Management**: `WorkspaceContext` (React Context API) handles multi-source state, mastery logic, and cross-tool navigation.
- **Styling**: Vanilla CSS with a "Linear-style" premium aesthetic, glassmorphism, and data-forward grids.
- **Icons**: Lucide-React for professional, consistent visual language.

### Backend (The Engine - To be implemented)
- **Framework**: FastAPI (Python) using the Factory Pattern.
- **Intelligence**: RAG (Retrieval-Augmented Generation) pipeline.
- **Vector Storage**: ChromaDB / Pinecone for source indexing.
- **LLM**: Framework-agnostic integration (Ollama for local, OpenAI for cloud).

---

## 🧭 The User Journey: A Deep Dive into the Research Flow

Nova AI is built around a frictionless, high-velocity research workflow. Here is how you use it to master any subject:

### 1. The Entry (Onboarding & Dashboard)
- **First Impression**: Land on the sleek, glassmorphic Landing Page to understand Nova's core value.
- **The Command Center**: After logging in, you land on the **Dashboard**. Here, you see your global stats (Average Mastery, Total Study Time).
- **Initialization**: Click **"New Workspace"** to create a dedicated container for a new project (e.g., "Deep Learning Study").

### 2. Constructing the Knowledge Base (The Hub)
- **Adding Sources**: Inside your new workspace, use the sidebar to upload PDFs, paste YouTube links, or add Web Articles. 
- **AI Indexing**: Watch as the AI "indexes" your materials. This isn't just a file upload; Nova is building a vector-based understanding of every word and frame in your sources.

### 3. Selective Intelligence (The "Context" Toggle)
- **Granular Focus**: Use the **Checkboxes** next to your sources. If you want to compare two specific papers, check only those two. Nova’s AI will ignore the rest, ensuring zero "context noise" in its answers.
- **Side-by-Side Reading**: Click the **"Eye"** icon to open the **Source Viewer**. You can now read the original source text side-by-side with the AI Chat.

### 4. Multi-Dimensional Interaction
- **Workspace Chat**: Ask the AI to synthesize findings across your entire workspace. Click **Citations** in the AI responses to jump directly to the source proof.
- **Validation (The Quiz)**: When you feel ready, switch to the **Quiz Tool**. Choose your difficulty (Hard) to truly test your knowledge.
- **Synthesis (Smart Notes)**: Open the **Notes Tool** to see a beautifully structured overview of the workspace's core concepts.

### 5. Finalizing & Exporting
- **Mastery Recognition**: Observe your **Mastery Score** increase as you interact with the AI and pass quizzes.
- **Knowledge Export**: Export your smart notes to **Markdown** or **TXT** to integrate them into your personal second brain (Notion, Obsidian, etc.).

---

## 🎯 The North Star
By the end of a session in Nova, a user should be able to rebuild their entire backend from scratch, explain every architectural decision, and demonstrate 100% mastery of the research materials they ingested.
