import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout & Components
import WorkspaceSidebar from '../components/layout/WorkspaceSidebar';
import SummaryPanel from '../components/workspace/SummaryPanel';
import ChatPanel from '../components/workspace/ChatPanel';
import QuizPanel from '../components/workspace/QuizPanel';
import NotesPanel from '../components/workspace/NotesPanel';
import NovaLoader from '../components/common/NovaLoader';

// Services
import api from '../services/api';
import { readStream } from '../utils/streamReader';
import { useWorkspace } from '../context/WorkspaceContext';

const WorkspacePage = () => {
  const { documents, sessionCache, updateCache, fetchDocuments } = useWorkspace();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [doc, setDoc] = useState(location.state?.doc || null);
  const [activePanel, setActivePanel] = useState(location.state?.activeTab || 'summary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Clear quiz when difficulty changes to allow new generation
  useEffect(() => {
    setQuiz(null);
  }, [difficulty]);

  // Raw Text State
  const [rawText, setRawText] = useState('');
  const [rawTextLoading, setRawTextLoading] = useState(false);

  // Reset state when document changes
  useEffect(() => {
    if (doc?.id) {
      setSummary('');
      setMessages([]);
      setQuiz(null);
      setNotes('');
      setRawText('');
      setSummaryError('');
      setQuizError('');
      setNotesError('');
    }
  }, [doc?.id]);

  // Initial Data Fetch & Artifact Rehydration
  useEffect(() => {
    // 1. If we don't have the document object yet, find it in the global list
    if (!doc && documents.length > 0) {
      const found = documents.find(d => d.id === parseInt(id));
      if (found) {
        setDoc(found);
      }
      return;
    }

    // 2. If we have the doc, proceed with rehydration
    if (doc) {
      const cache = sessionCache[doc.id];
      if (cache) {
        if (cache.summary) setSummary(cache.summary);
        if (cache.notes) setNotes(cache.notes);
        if (cache.quiz) setQuiz(cache.quiz);
      }

      // Fetch from Database ONLY if we don't have a summary yet
      if (!cache || (!cache.summary && !cache.notes)) {
        const fetchArtifacts = async () => {
          try {
            const data = await api.getArtifacts(doc.id);
            if (data.summary) setSummary(data.summary);
            if (data.notes) setNotes(data.notes);
            if (data.quiz) setQuiz(data.quiz);
            if (data.chat && data.chat.length > 0) setMessages(data.chat);

            updateCache(doc.id, {
              summary: data.summary,
              notes: data.notes,
              quiz: data.quiz
            });
          } catch (err) {
            console.error("Failed to rehydrate artifacts", err);
          }
        };
        fetchArtifacts();
      }
    }
  }, [id, doc]); // ONLY trigger when document context changes

  // Logic: Generate Summary
  const handleGenerateSummary = async () => {
    if (!doc) return;
    setSummaryLoading(true);
    setSummary('');
    setSummaryError('');
    let fullText = '';
    try {
      const reader = await api.getSummary(doc.id, summaryLength);
      await readStream(reader, (chunk) => {
        fullText += chunk;
        setSummary(prev => prev + chunk);
      });
      updateCache(doc.id, { summary: fullText });
      fetchDocuments(); // Refresh dashboard icons
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
          const lastIndex = updated.length - 1;
          // IMMUTABLE UPDATE: Copy the message object before modifying
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunk
          };
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

  // Logic: Clear Chat History
  const handleClearChat = async () => {
    if (!doc) return;
    try {
      await api.clearChat(doc.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat", err);
    }
  };

  // Logic: Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!doc) return;
    setQuizLoading(true);
    setQuiz(null);
    setQuizError('');
    let fullJson = '';
    try {
      const reader = await api.getQuiz(doc.id, difficulty);
      await readStream(reader, (chunk) => {
        fullJson += chunk;
      });

      try {
        // Robust JSON extraction: Find content between first { and last }
        const start = fullJson.indexOf('{');
        const end = fullJson.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
          throw new Error("Could not find quiz data in response.");
        }
        
        const cleanJson = fullJson.substring(start, end + 1);
        const parsed = JSON.parse(cleanJson);
        
        setQuiz(parsed);
        updateCache(doc.id, { quiz: parsed });
        fetchDocuments(); // Refresh dashboard icons
      } catch (parseErr) {
        console.error("Quiz Parse Error:", parseErr, fullJson);
        throw new Error("AI returned invalid quiz format. Please try again.");
      }
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
    let fullText = '';
    try {
      const reader = await api.getNotes(doc.id, notesLength);
      await readStream(reader, (chunk) => {
        fullText += chunk;
        setNotes(prev => prev + chunk);
      });
      updateCache(doc.id, { notes: fullText });
      fetchDocuments(); // Refresh dashboard icons
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

  if (!doc) {
    return (
      <div className="loader-full">
        <NovaLoader variant="scanning" text="Initializing Nova Workspace..." />
        <style jsx>{`
          .loader-full { height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-base); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="workspace-root">
      <WorkspaceSidebar
        activePanel={activePanel}
        setActivePanel={(panel) => {
          setActivePanel(panel);
          setIsSidebarOpen(false);
        }}
        docName={doc?.name || 'Loading...'}
        mobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="workspace-main">
        <div className="mobile-workspace-header">
          <button className="ws-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <div className="menu-icon-v2">
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </button>
          <span className="ws-active-title">{activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}</span>
        </div>
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
                  docUrl={doc?.name}
                />
              )}

              {activePanel === 'chat' && (
                <ChatPanel
                  messages={messages}
                  input={chatInput}
                  setInput={setChatInput}
                  onSend={handleSendMessage}
                  onClear={handleClearChat}
                  loading={chatLoading}
                  docUrl={doc?.name}
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
                  docUrl={doc?.name}
                />
              )}

              {activePanel === 'raw' && (
                <div className="raw-text-view glass">
                  <div className="raw-header">
                    <h2>Source Document Text</h2>
                    <p>Original unformatted text extracted from the document.</p>
                  </div>
                  <div className="raw-body">
                    {rawTextLoading ? (
                      <div className="raw-loader-container">
                        <NovaLoader variant="scanning" text="Extracting raw knowledge..." />
                      </div>
                    ) : rawText || "No content found."}
                  </div>
                  <style jsx>{`
                    .raw-text-view { background: white; border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); height: 100%; display: flex; flex-direction: column; }
                    .raw-header { padding: 32px 40px; border-bottom: 1px solid var(--border-subtle); }
                    .raw-header h2 { font-family: var(--font-display); font-size: 20px; font-weight: 800; margin-bottom: 4px; }
                    .raw-header p { font-size: 14px; color: var(--text-muted); }
                    .raw-body { flex: 1; padding: 40px; overflow-y: auto; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; color: var(--text-secondary); white-space: pre-wrap; }
                    .raw-loader-container { height: 100%; display: flex; align-items: center; justify-content: center; }
                  `}</style>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        .workspace-root { display: flex; height: 100vh; background: var(--bg-base); overflow: hidden; }
        .workspace-main { flex: 1; display: flex; flex-direction: column; min-width: 0; padding: 40px 24px; }
        .workspace-view { max-width: 1200px; width: 100%; height: 100%; margin: 0 auto; }
        .panel-wrapper { height: 100%; }
        .loader-full { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 800; color: var(--brand-primary); background: var(--bg-base); }
        
        .mobile-workspace-header { display: none; align-items: center; gap: 16px; padding: 16px 24px; background: white; border-bottom: 1px solid var(--border-subtle); position: sticky; top: 0; z-index: 10; }
        .ws-menu-btn { background: none; border: none; padding: 8px; cursor: pointer; }
        .menu-icon-v2 { width: 20px; height: 12px; display: flex; flex-direction: column; justify-content: space-between; }
        .menu-icon-v2 .line { height: 2px; width: 100%; background: var(--text-primary); border-radius: 2px; }
        .ws-active-title { font-family: var(--font-display); font-weight: 800; font-size: 16px; color: var(--text-primary); }

        @media (max-width: 1024px) {
          .workspace-main { padding: 0; }
          .workspace-view { padding: 16px; }
          .mobile-workspace-header { display: flex; }
        }
      `}</style>
    </div>
  );
};

export default WorkspacePage;
