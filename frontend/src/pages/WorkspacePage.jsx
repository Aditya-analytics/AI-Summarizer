import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, BookOpen, Loader2,
  MessageSquareText, ListChecks, NotebookPen, X,
  FileText, Link, Video, Trash2, LayoutDashboard,
  CheckCircle2, XCircle, LogOut, RefreshCw, Download,
  AlertCircle, ChevronDown, BrainCircuit
} from 'lucide-react';
import api from '../services/api';
import { readStream } from '../utils/streamReader';
import ReactMarkdown from 'react-markdown';

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
  const [showOriginal, setShowOriginal] = useState(false);
  const [rawText, setRawText] = useState('');
  const [rawTextLoading, setRawTextLoading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quiz State
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Notes State
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [notesLength, setNotesLength] = useState('detailed');

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateSummary = async () => {
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

  const fetchRawText = async () => {
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
    if (showOriginal && !rawText) fetchRawText();
  }, [showOriginal]);

  const sendMessage = async () => {
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

  const generateQuiz = async () => {
    if (!doc) return;
    setQuizLoading(true);
    setQuiz(null);
    setQuizError('');
    setScore(null);
    setAnswers({});
    try {
      const data = await api.getQuiz(doc.id, difficulty);
      setQuiz(data);
    } catch (err) {
      setQuizError(err.message || "Failed to generate quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const selectAnswer = (qIdx, opt) => {
    if (score !== null) return;
    setAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const submitQuiz = () => {
    if (!quiz) return;
    let newScore = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) newScore++;
    });
    setScore(newScore);
  };

  const generateNotes = async () => {
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

  const downloadNotes = () => {
    if (!notes) return;
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name}_Notes.md`;
    a.click();
  };

  if (!doc) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFA' }}>
        <Loader2 className="animate-spin" size={48} color="#7C3AED" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: '#FAFAFA', minHeight: '100vh', padding: '40px 60px' }}>
      
      {/* ── HEADER ── */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ws-v5-header">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14}/> {doc.type}</div>
               <div style={{ background: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>Processed</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>Share</motion.button>
               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={downloadNotes}><Download size={16}/> Export</motion.button>
               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard')} style={{ padding: '8px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#374151', cursor: 'pointer' }}><LayoutDashboard size={16}/></motion.button>
            </div>
         </div>
         <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>{doc.name}</h1>
         <div style={{ color: '#6B7280', fontSize: '14px', display: 'flex', gap: '16px' }}>
            <span>{doc.name}</span>
            <span>•</span>
            <span>ID: {doc.id}</span>
         </div>
      </motion.div>

      {/* ── TAB BAR ── */}
      <div className="ws-v5-tab-bar">
        {['summary', 'chat', 'quiz', 'notes'].map(tab => (
           <motion.button 
             key={tab} 
             whileHover={{ y: -2 }}
             className={`ws-v5-tab ${activePanel === tab ? 'active' : ''}`} 
             onClick={() => setActivePanel(tab)}>
             {tab === 'summary' && <FileText size={18}/>}
             {tab === 'chat' && <MessageSquareText size={18}/>}
             {tab === 'quiz' && <BrainCircuit size={18}/>}
             {tab === 'notes' && <BookOpen size={18}/>}
             {tab === 'chat' ? 'Q&A Chat' : tab.charAt(0).toUpperCase() + tab.slice(1)}
           </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── SUMMARY PANEL ── */}
          {activePanel === 'summary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
                   {['short', 'standard', 'detailed'].map(len => (
                     <button key={len} onClick={() => setSummaryLength(len)} style={{ padding: '6px 12px', background: summaryLength === len ? '#ffffff' : 'transparent', borderRadius: '6px', border: summaryLength === len ? '1px solid #E5E7EB' : 'none', color: summaryLength === len ? '#111827' : '#6B7280', fontWeight: 600, fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize', boxShadow: summaryLength === len ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
                       {len}
                     </button>
                   ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateSummary} disabled={summaryLoading} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                     {summaryLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Regenerate
                   </motion.button>
                   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowOriginal(!showOriginal)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                     {showOriginal ? 'Hide Original' : 'Show Original'}
                   </motion.button>
                </div>
              </div>

              <div style={{ display: 'flex', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                 {showOriginal && (
                   <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '50%', opacity: 1 }}
                    style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                       <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Original Content</h3>
                     </div>
                     <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '600px', fontSize: '14px', lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>
                       {rawTextLoading ? "Loading..." : rawText || "No content."}
                     </div>
                   </motion.div>
                 )}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                     <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>AI Summary ({summaryLength})</h3>
                   </div>
                   <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '600px', fontSize: '14px', lineHeight: 1.8, color: '#374151' }}>
                      {summaryError && <p style={{ color: 'red' }}>{summaryError}</p>}
                      {!summary && !summaryLoading && <p style={{ color: '#6B7280' }}>Click Regenerate to create a summary.</p>}
                      <div className="markdown-content">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                      </div>
                      {summaryLoading && <span className="typing-cursor">▌</span>}
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* ── CHAT PANEL ── */}
          {activePanel === 'chat' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '600px' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18}/> AI Q&A Chat</h3>
                 <button style={{ padding: '6px 12px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Save Chat</button>
              </div>
              
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '24px' }}>
                       <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '12px', color: '#111827', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
                         Hi! I'm your AI assistant. I've analyzed the document and I'm ready to answer your questions. What would you like to know?
                       </div>
                       <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Try asking:</p>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         {['What are the main topics discussed?', 'Summarize the key takeaways.', 'Are there any actionable items?'].map(q => (
                           <motion.button whileHover={{ x: 5 }} key={q} onClick={() => setChatInput(q)} style={{ padding: '12px 16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', textAlign: 'left', color: '#4B5563', fontSize: '14px', cursor: 'pointer' }}>{q}</motion.button>
                         ))}
                       </div>
                    </motion.div>
                  )}
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginBottom: '16px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ background: m.role === 'user' ? '#7C3AED' : '#F3F4F6', color: m.role === 'user' ? '#ffffff' : '#111827', padding: '12px 16px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px', whiteSpace: 'pre-wrap', border: m.isError ? '1px solid #DC2626' : 'none' }}>
                        {m.content}
                        {m.role === 'ai' && m.content === '' && chatLoading && <span className="typing-cursor">▌</span>}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
                <div style={{ display: 'flex', gap: '12px', background: '#F3F4F6', padding: '8px', borderRadius: '12px' }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} disabled={chatLoading} placeholder="Ask a question about the document..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px', fontSize: '14px' }} />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} disabled={chatLoading || !chatInput.trim()} style={{ background: '#7C3AED', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* ── QUIZ PANEL ── */}
          {activePanel === 'quiz' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BrainCircuit size={24} color="#7C3AED" />
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Test Your Knowledge</h2>
              </div>
              <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Answer AI-generated questions based on the document content</p>

              {!quiz && !quizLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '8px' }}>Select Difficulty Level</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#F9FAFB', border: '1px solid #E5E7EB', outline: 'none', color: '#111827', fontSize: '14px', marginBottom: '24px' }}>
                    <option value="easy">Easy - Basic Recall</option>
                    <option value="medium">Medium - Intermediate Understanding</option>
                    <option value="hard">Hard - Advanced Reasoning</option>
                  </select>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={generateQuiz} className="ws-v5-btn-purple" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                    Start Quiz
                  </motion.button>
                  {quizError && <p style={{ color: '#DC2626', marginTop: '16px', textAlign: 'center' }}>{quizError}</p>}
                </motion.div>
              )}

              {quizLoading && (
                <div style={{ padding: '60px', textAlign: 'center', color: '#7C3AED' }}>
                   <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto 16px' }} />
                   <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Generating Quiz...</h3>
                </div>
              )}

              {quiz && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {score !== null && (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: score / quiz.questions.length >= 0.7 ? '#dcfce7' : '#fef2f2', color: score / quiz.questions.length >= 0.7 ? '#15803d' : '#dc2626', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '16px' }}>
                        {score / quiz.questions.length >= 0.7 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        Score: {score} / {quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)
                      </motion.div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                       <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Questions</h3>
                       {score !== null && <button onClick={() => { setQuiz(null); setScore(null); setAnswers({}); }} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>}
                    </div>
                    
                    {quiz.questions.map((q, qi) => {
                      const selected = answers[qi];
                      const isSubmitted = score !== null;
                      const isCorrect = selected === q.correct_answer;

                      return (
                        <div key={qi} style={{ background: '#FAFAFA', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                          <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px', lineHeight: 1.5, color: '#111827' }}>
                            <span style={{ color: '#7C3AED', marginRight: '8px' }}>Q{qi + 1}.</span>
                            {q.question}
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {q.options.map((opt, oi) => {
                              let bg = '#ffffff';
                              let border = '1px solid #E5E7EB';
                              let color = '#374151';
                              if (selected === opt) {
                                if (!isSubmitted) { bg = '#7C3AED'; border = '1px solid #7C3AED'; color = '#ffffff'; }
                                else { bg = isCorrect ? '#F0FDF4' : '#FEF2F2'; border = isCorrect ? '1px solid #BBF7D0' : '1px solid #FECACA'; color = isCorrect ? '#16A34A' : '#DC2626'; }
                              }
                              if (isSubmitted && opt === q.correct_answer && selected !== opt) {
                                bg = '#F0FDF4'; border = '1px solid #BBF7D0'; color = '#16A34A';
                              }

                              return (
                                <motion.div key={oi} 
                                  whileHover={!isSubmitted ? { x: 5, backgroundColor: '#f3f4f6' } : {}}
                                  onClick={() => selectAnswer(qi, opt)}
                                  style={{ padding: '16px', borderRadius: '8px', cursor: isSubmitted ? 'default' : 'pointer', background: bg, border, fontSize: '14px', lineHeight: 1.5, transition: 'all 0.15s', color }}>
                                  {opt}
                                </motion.div>
                              );
                            })}
                          </div>

                          {isSubmitted && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', padding: '12px 16px', background: '#F3F4F6', borderRadius: '8px', fontSize: '13px', color: '#4B5563', lineHeight: 1.6 }}>
                              <strong style={{ color: '#111827' }}>Explanation:</strong> {q.explanation}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}

                    {score === null && Object.keys(answers).length > 0 && (
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={submitQuiz} className="ws-v5-btn-purple" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                        Submit Quiz
                      </motion.button>
                    )}
                 </motion.div>
              )}
            </div>
          )}

          {/* ── NOTES PANEL ── */}
          {activePanel === 'notes' && (
            <div style={{ display: 'flex', gap: '24px' }}>
               <div style={{ flex: 2, background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <BookOpen size={24} color="#10B981" />
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>AI-Generated Study Notes</h2>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Structured notes generated from document content</p>

                  <div style={{ background: '#ECFDF5', padding: '16px 24px', borderTop: '1px solid #A7F3D0', borderBottom: '1px solid #A7F3D0', margin: '0 -32px 24px', fontWeight: 700, color: '#065F46' }}>
                     {doc.name} - Comprehensive Study Notes
                  </div>

                  <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#374151' }}>
                      {notesError && <p style={{ color: 'red' }}>{notesError}</p>}
                      {!notes && !notesLoading && <p style={{ color: '#6B7280' }}>Click a Note Style on the right to generate.</p>}
                      <div className="markdown-content">
                        <ReactMarkdown>{notes}</ReactMarkdown>
                      </div>
                      {notesLoading && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginTop: '16px' }}><Loader2 size={16} className="animate-spin" /> Generating...</div>}
                  </div>
               </div>

               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
                     <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Download Options</h3>
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadNotes} disabled={!notes} className="ws-v5-btn-red" style={{ marginBottom: '12px', opacity: notes ? 1 : 0.5 }}><FileText size={16} /> Download PDF</motion.button>
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadNotes} disabled={!notes} className="ws-v5-btn-outline" style={{ opacity: notes ? 1 : 0.5 }}><Download size={16} /> Download Markdown</motion.button>
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigator.clipboard.writeText(notes)} disabled={!notes} className="ws-v5-btn-outline" style={{ margin: 0, opacity: notes ? 1 : 0.5 }}><LogOut size={16} /> Copy to Clipboard</motion.button>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
                     <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Note Styles</h3>
                     
                     <motion.div whileHover={{ scale: 1.02 }} onClick={() => { setNotesLength('short'); generateNotes(); }} style={{ padding: '16px', background: notesLength === 'short' ? '#EFF6FF' : '#FAFAFA', border: notesLength === 'short' ? '1px solid #BFDBFE' : '1px solid #E5E7EB', borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: notesLength === 'short' ? '#1D4ED8' : '#374151', marginBottom: '4px' }}>Short</div>
                        <div style={{ fontSize: '12px', color: notesLength === 'short' ? '#2563EB' : '#6B7280' }}>Quick reference with bullet points</div>
                     </motion.div>

                     <motion.div whileHover={{ scale: 1.02 }} onClick={() => { setNotesLength('detailed'); generateNotes(); }} style={{ padding: '16px', background: notesLength === 'detailed' ? '#FAF5FF' : '#FAFAFA', border: notesLength === 'detailed' ? '1px solid #E9D5FF' : '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: notesLength === 'detailed' ? '#7E22CE' : '#374151', marginBottom: '4px' }}>Detailed</div>
                        <div style={{ fontSize: '12px', color: notesLength === 'detailed' ? '#9333EA' : '#6B7280' }}>Comprehensive coverage with all concepts</div>
                     </motion.div>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </motion.div>
  );
};

export default WorkspacePage;

