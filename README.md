# 🌌 Nova AI: The Cinematic Research Intelligence Hub

Nova is a state-of-the-art AI Learning Workspace designed for deep researchers and high-performance learners. It transforms scattered data (PDFs, YouTube, Web) into a mission-ready knowledge base using a high-fidelity cinematic interface.

---

## 🚀 The Nova Experience

### 🎭 Cinematic UX/UI
Nova features a unique **"NovaLoader"** system with three high-fidelity animation variants:
- **Scanning**: Visualizes real-time document ingestion and data extraction.
- **Thinking**: A pulsing "Knowledge Atom" representing complex AI reasoning.
- **Writing**: A shimmering data stream showing the synthesis of new insights.

### 🛡️ The Gauntlet (Infinity Core)
A world-first **"Infinity Stone"** integration system. Users can plug in their own Gemini API keys to unlock unlimited power, bypassing system limits with a custom cinematic activation sequence.

### 🧪 Advanced Research Toolset
- **Multi-Source RAG**: Chat with your entire workspace using Retrieval-Augmented Generation.
- **Intelligence Challenges**: Generate difficulty-aware MCQs to validate subject mastery.
- **Structured Synthesis**: Automatically distilled study notes optimized for research.
- **Mission-Hardened Backend**: Global exception handling and transaction resilience for production stability.

---

## 🛠️ Technical Architecture

### **Frontend**
- **Framework**: React 19 + Vite (Type: Module)
- **Animations**: Framer Motion 12 (High-Fidelity Transitions)
- **Icons**: Lucide React
- **Design System**: Custom HSL V4 Glassmorphism (Linear-inspired aesthetic)
- **State**: React Context API (Workspace Intelligence Management)

### **Backend**
- **Framework**: FastAPI (Python) using the Factory Pattern
- **Database**: SQLModel (SQLAlchemy + Pydantic)
- **Vector Search**: ChromaDB (Native Vector Indexing)
- **LLM Engine**: Google Gemini 2.5 Pro & Flash (Multimodal)
- **Security**: JWT Authentication (PyJWT) + Bcrypt Password Hashing

---

## 🧭 Setup & Installation

### **1. Backend (The Hub)**
```bash
# Clone the repository
git clone https://github.com/yourusername/nova-ai.git
cd AI_Summarizer

# Create and activate virtual environment
python -m venv venv
source venv/bin/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
cp .env.example .env

# Start the Hub
python -m app.main
```

### **2. Frontend (The Lab)**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚙️ Environment Variables

### **Backend (.env)**
| Key | Description |
|-----|-------------|
| `GEMINI_API_KEY` | Your primary Google AI Studio key. |
| `SECRET_KEY` | Secure random string for JWT signing. |
| `ALGORITHM` | Typically `HS256`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL (e.g., 1440). |
| `FRONTEND_URL` | Production URL (for CORS hardening). |

### **Frontend (.env)**
| Key | Description |
|-----|-------------|
| `VITE_API_BASE_URL` | Backend API URL (Local or Render). |

---

## ☁️ Deployment

### **Backend (Render)**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:create_app --host 0.0.0.0 --port $PORT --factory`

### **Frontend (Vercel)**
- **Framework**: Vite
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`

---

## 🛡️ Stability & Security
- **Error Boundaries**: Root-level UI protection with high-fidelity recovery views.
- **Transaction Resilience**: Automated database rollbacks for failed credit consumptions.
- **Global Resilience**: Backend-wide exception handling returning professional researcher feedback.

---

## 📜 License
Mission-ready under the MIT License.

**Master your research. Calibrate your Gauntlet. Welcome to Nova.**
