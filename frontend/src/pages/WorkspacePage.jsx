import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout & Components
import WorkspaceSidebar from '../components/layout/WorkspaceSidebar';
import SummaryPanel from '../components/workspace/SummaryPanel';
import ChatPanel from '../components/workspace/ChatPanel';
import QuizPanel from '../components/workspace/QuizPanel';
import NotesPanel from '../components/workspace/NotesPanel';

// Services
import api from '../services/api';
import { readStream } from '../utils/streamReader';

const WorkspacePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [doc, setDoc] = useState(location.state?.doc || null);
  const [activePanel, setActivePanel] = useState(location.state?.activeTab || 'summary');
  
  // Summary State
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState('standard');
  const [summaryError, setSummaryError] = useState('');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Quiz State
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  // Notes State
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [notesLength, setNotesLength] = useState('detailed');

  // Raw Text State
  const [rawText, setRawText] = useState('');
  const [rawTextLoading, setRawTextLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    if (!doc && id) {
      const fetchDoc = async () => {
        try {
          const docs = await api.getDocuments();
          const found = docs.find(d => d.id === parseInt(id));
          if (found) setDoc(found);
        } catch (err) {
          console.error("Failed to fetch document", err);
        }
      };
      fetchDoc();
    }
  }, [id, doc]);

  // Logic: Generate Summary
  const handleGenerateSummary = async () => {
    if (!doc) return;
    setSummaryLoading(true);
    setSummary('');
    setSummaryError('');
    try {
      const reader = await api.getSummary(doc.id, summaryLength);
      await readStream(reader, (chunk) => setSummary(prev => prev + chunk));
    } catch (err) {
      setSummaryError(err.message || "Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // Logic: Send Chat Message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !doc) return;
    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    
    const aiMsg = { role: 'ai', content: '' };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const reader = await api.askQuestion(doc.id, chatInput);
      await readStream(reader, (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunk;
          return updated;
        });
      });
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Error: " + err.message;
        updated[updated.length - 1].isError = true;
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  };

  // Logic: Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!doc) return;
    setQuizLoading(true);
    setQuizError('');
    try {
      const data = await api.getQuiz(doc.id, difficulty);
      setQuiz(data);
    } catch (err) {
      setQuizError(err.message || "Failed to generate quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  // Logic: Generate Notes
  const handleGenerateNotes = async () => {
    if (!doc) return;
    setNotesLoading(true);
    setNotes('');
    setNotesError('');
    try {
      const reader = await api.getNotes(doc.id, notesLength);
      await readStream(reader, (chunk) => setNotes(prev => prev + chunk));
    } catch (err) {
      setNotesError(err.message || "Failed to generate notes.");
    } finally {
      setNotesLoading(false);
    }
  };

  // Logic: Fetch Raw Text
  const handleFetchRawText = async () => {
    if (!doc || rawText) return;
    setRawTextLoading(true);
    try {
      const data = await api.getRawText(doc.id);
      setRawText(data.raw_text);
    } catch (err) {
      console.error("Failed to fetch raw text", err);
    } finally {
      setRawTextLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'raw') handleFetchRawText();
  }, [activePanel]);

  if (!doc) return <div className="loader-full">Loading Nova Workspace...</div>;

  return (
    <div className="workspace-root">
      <WorkspaceSidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel} 
        docName={doc.name} 
      />

      <main className="workspace-main">
        <div className="workspace-view">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="panel-wrapper"
            >
              {activePanel === 'summary' && (
                <SummaryPanel 
                  summary={summary} 
                  loading={summaryLoading} 
                  onGenerate={handleGenerateSummary}
                  length={summaryLength}
                  setLength={setSummaryLength}
                  error={summaryError}
                />
              )}

              {activePanel === 'chat' && (
                <ChatPanel 
                  messages={messages} 
                  input={chatInput} 
                  setInput={setChatInput} 
                  onSend={handleSendMessage}
                  loading={chatLoading}
                />
              )}

              {activePanel === 'quiz' && (
                <QuizPanel 
                  quiz={quiz}
                  loading={quizLoading}
                  onGenerate={handleGenerateQuiz}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  error={quizError}
                />
              )}

              {activePanel === 'notes' && (
                <NotesPanel 
                  notes={notes}
                  loading={notesLoading}
                  onGenerate={handleGenerateNotes}
                  length={notesLength}
                  setLength={setNotesLength}
                  error={notesError}
                />
              )}

              {activePanel === 'raw' && (
                <div className="raw-text-view glass">
                  <div className="raw-header">
                    <h2>Source Document Text</h2>
                    <p>Original unformatted text extracted from the document.</p>
                  </div>
                  <div className="raw-body">
                    {rawTextLoading ? "Parsing content..." : rawText || "No content found."}
                  </div>
                  <style jsx>{`
                    .raw-text-view { background: white; border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); height: 100%; display: flex; flex-direction: column; }
                    .raw-header { padding: 32px 40px; border-bottom: 1px solid var(--border-subtle); }
                    .raw-header h2 { font-family: var(--font-display); font-size: 20px; font-weight: 800; margin-bottom: 4px; }
                    .raw-header p { font-size: 14px; color: var(--text-muted); }
                    .raw-body { flex: 1; padding: 40px; overflow-y: auto; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; color: var(--text-secondary); white-space: pre-wrap; }
                  `}</style>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        .workspace-root { display: flex; height: 100vh; background: var(--bg-base); overflow: hidden; }
        .workspace-main { flex: 1; display: flex; flex-direction: column; min-width: 0; padding: 40px; }
        .workspace-view { max-width: 1200px; width: 100%; height: 100%; margin: 0 auto; }
        .panel-wrapper { height: 100%; }
        .loader-full { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 800; color: var(--brand-primary); background: var(--bg-base); }
      `}</style>
    </div>
  );
};

export default WorkspacePage;
