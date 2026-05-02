import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, Search, Bell,
  UploadCloud, Link as LinkIcon, Video, LogOut, X, BarChart3,
  MessageSquareText, Loader2,
  ChevronRight, PlusCircle, Globe,
  Clock, Award, BrainCircuit, Home,
  FolderOpen, Layers, CheckCircle2, TrendingUp,
  FileText, Trash2, AlertCircle, Plus, MoreVertical, Download
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { SkeletonList } from '../components/Skeleton';
import api from '../services/api';
import { readStream } from '../utils/streamReader';

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents, loading, error, deleteDocument, addDocument, fetchDocuments } = useWorkspace();
  const [activeTab, setActiveTab] = useState('home');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState('pdf'); // 'pdf' | 'url' | 'youtube'
  const [urlInput, setUrlInput] = useState('');
  const [summaryLength, setSummaryLength] = useState('standard');
  const [language, setLanguage] = useState('English');
  const [isUploading, setIsUploading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const userEmail = localStorage.getItem('nova_user_email') || 'User';
  const userName = userEmail.split('@')[0];

  const handleLogout = () => {
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user_email');
    navigate('/auth');
  };

  const resetModal = () => {
    setUrlInput('');
    setStreamingText('');
    setUploadError('');
    setIsUploading(false);
  };

  const handleStream = async (readerPromise, sourceName) => {
    setIsUploading(true);
    setStreamingText('');
    setUploadError('');
    try {
      const reader = await readerPromise;
      await readStream(
        reader,
        (chunk) => setStreamingText(prev => prev + chunk),
        async () => {
          await fetchDocuments();
          setIsUploading(false);
          const docs = await api.getDocuments();
          if (docs && docs.length > 0) {
             const newDoc = docs[0];
             navigate(`/workspace/${newDoc.id}`, { state: { doc: newDoc, activeTab: 'summary' } });
          }
        }
      );
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Is Ollama running?');
      setIsUploading(false);
    }
  };

  const handlePdfUpload = async (file) => {
    if (!file) return;
    await handleStream(api.uploadPdf(file, summaryLength, language), file.name);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    if (uploadTab === 'url') {
      await handleStream(api.summarizeUrl(urlInput, summaryLength, language), urlInput);
    } else {
      await handleStream(api.summarizeYoutube(urlInput, summaryLength, language), urlInput);
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'PDF') return <FileText size={16} />;
    if (type === 'YOUTUBE') return <Video size={16} />;
    if (type === 'URL') return <LinkIcon size={16} />;
    return <FileText size={16} />;
  };

  const getTypeBadgeStyle = (type) => {
    if (type === 'PDF') return { bg: '#fee2e2', color: '#b91c1c' }; // red
    if (type === 'YOUTUBE') return { bg: '#f3e8ff', color: '#7e22ce' }; // purple
    if (type === 'URL') return { bg: '#dbeafe', color: '#1d4ed8' }; // blue
    return { bg: '#f3f4f6', color: '#374151' }; // gray
  };

  const hasArtifact = (doc, type) => {
    return doc.artifacts && doc.artifacts.includes(type);
  };

  return (
    <div className="dash-root-v4" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Upload Modal Redesigned */}
      {showUploadModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(243,244,246,0.9)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }} onClick={() => { if (!isUploading) { setShowUploadModal(false); resetModal(); } }}>
          <div className="ingest-modal-v5 animate-fade-up" style={{ background: 'transparent', maxWidth: '900px', width: '100%', padding: '0' }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Upload Content</h1>
              <p style={{ color: '#4B5563', fontSize: '15px' }}>Choose your input method and customize the output</p>
            </div>

            {/* Error */}
            {uploadError && (
              <div style={{ marginBottom: '24px', border: '1px solid #FECACA', display: 'flex', gap: '10px', alignItems: 'center', color: '#DC2626', fontSize: '14px', background: '#FEF2F2', padding: '16px', borderRadius: '12px', fontWeight: 500 }}>
                <AlertCircle size={18} /> {uploadError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left Column: Input Method */}
              <div style={{ flex: 2 }}>
                <div className="ws-v5-tab-bar" style={{ marginBottom: '20px' }}>
                  {['text', 'url', 'youtube', 'pdf'].map(tab => (
                    <button key={tab} onClick={() => { setUploadTab(tab); setUrlInput(''); setStreamingText(''); }}
                      className={`ws-v5-tab ${uploadTab === tab ? 'active' : ''}`}>
                      {tab === 'text' && <FileText size={16}/>}
                      {tab === 'url' && <LinkIcon size={16}/>}
                      {tab === 'youtube' && <Video size={16}/>}
                      {tab === 'pdf' && <UploadCloud size={16}/>}
                      {tab === 'pdf' ? 'File' : tab === 'url' ? 'URL' : tab === 'youtube' ? 'YouTube' : 'Text'}
                    </button>
                  ))}
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                    {uploadTab === 'pdf' ? 'Upload Document' : uploadTab === 'url' ? 'Submit URL' : uploadTab === 'youtube' ? 'YouTube Video' : 'Paste Text'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
                    {uploadTab === 'pdf' ? 'Upload PDF files for processing' : 'Enter the link to summarize'}
                  </p>

                  {uploadTab === 'pdf' && (
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '60px 20px',
                        textAlign: 'center', cursor: isUploading ? 'not-allowed' : 'pointer',
                        background: '#F9FAFB', transition: 'all 0.2s'
                      }}>
                      <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
                        onChange={e => handlePdfUpload(e.target.files[0])} />
                      <UploadCloud size={48} style={{ margin: '0 auto 16px', color: '#6B7280', display: 'block' }} />
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Drop your file here</p>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>or</p>
                      <button style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, color: '#374151' }}>Browse Files</button>
                      <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '16px' }}>Supports PDF (Max 50MB)</p>
                    </div>
                  )}

                  {(uploadTab === 'url' || uploadTab === 'youtube' || uploadTab === 'text') && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder={uploadTab === 'url' ? 'https://article.com/...' : uploadTab === 'youtube' ? 'https://youtube.com/watch?v=...' : 'Paste text here...'}
                        disabled={isUploading}
                        style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#F9FAFB', color: '#111827', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                        onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Output Settings */}
              <div style={{ flex: 1, background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Output Settings</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Customize how you want the content processed</p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Summary Style</label>
                  <select value={summaryLength} onChange={e => setSummaryLength(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#F9FAFB', border: '1px solid #E5E7EB', outline: 'none', color: '#111827', fontSize: '14px' }}>
                    <option value="short">Short - Key points only</option>
                    <option value="standard">Standard - Balanced overview</option>
                    <option value="detailed">Detailed - Comprehensive</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#F9FAFB', border: '1px solid #E5E7EB', outline: 'none', color: '#111827', fontSize: '14px' }}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Streaming Summary Preview overlay inside modal */}
            {(isUploading || streamingText) && (
              <div style={{ marginTop: '24px', background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', maxHeight: '200px', overflowY: 'auto' }}>
                <p style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {isUploading ? 'AI is processing content...' : '✅ Processing complete'}
                </p>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{streamingText}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button 
                onClick={() => { setShowUploadModal(false); resetModal(); }}
                style={{ padding: '12px 24px', background: '#ffffff', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={handleUrlSubmit} 
                disabled={isUploading || (uploadTab !== 'pdf' && !urlInput.trim())}
                className="ws-v5-btn-purple">
                Process Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>Nova</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--surface-2)', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }}>
            <LayoutDashboard size={18} /> Overview
          </div>
          <div style={{ padding: '10px 12px', borderRadius: '8px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }} onClick={() => navigate('/')}>
            <Home size={18} /> Landing Page
          </div>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)' }}>
              {userName[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', textTransform: 'capitalize' }}>{userName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Pro Plan</p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={handleLogout}><LogOut size={18} /></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        
        {/* Header matching inspiration */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' }}>Welcome back, {userName}</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Here's what's happening with your learning today</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary-gradient" 
            onClick={() => { setShowUploadModal(true); resetModal(); }}>
            <Plus size={18} /> New Document
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
          {[
            { label: 'Documents Processed', val: documents.length, icon: <FolderOpen size={18} color="var(--primary)" />, border: '#fed7aa', sub: '+12% from last month', trend: true },
            { label: 'PDFs Analyzed', val: documents.filter(d => d.type === 'PDF').length, icon: <FileText size={18} color="#a855f7" />, border: '#e9d5ff', sub: 'Total PDF documents' },
            { label: 'Web & Media', val: documents.filter(d => d.type !== 'PDF').length, icon: <Globe size={18} color="#3b82f6" />, border: '#bfdbfe', sub: 'URLs and YouTube videos' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="dash-stat-card" 
              style={{ border: `2px solid ${stat.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</h3>
                {stat.icon}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)' }}>{stat.val}</div>
              <p style={{ fontSize: '12px', color: stat.trend ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontWeight: 600 }}>
                {stat.trend && <TrendingUp size={14} />} {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Document List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>Recent Documents</h2>
          </div>

          {error && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#ef4444', fontSize: '14px', padding: '16px', background: '#fef2f2', borderRadius: '12px', marginBottom: '24px', fontWeight: 500 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <SkeletonList count={3} />
            ) : documents.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <FolderOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No documents yet</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Upload a PDF, paste a URL or YouTube link to get started.</p>
                <button onClick={() => { setShowUploadModal(true); resetModal(); }} style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={16} /> Add Your First Source
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                {documents.map((doc, i) => {
                  const typeStyle = getTypeBadgeStyle(doc.type);
                  return (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      layout
                      className="dash-doc-card" 
                      onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <span style={{ 
                            background: typeStyle.bg, color: typeStyle.color, padding: '4px 10px', borderRadius: '6px', 
                            fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' 
                          }}>
                            {getTypeIcon(doc.type)} {doc.type.toUpperCase()}
                          </span>
                          <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                            Completed
                          </span>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{doc.name}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Source ID: {doc.id}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                            <Clock size={14} /> {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {hasArtifact(doc, 'summary') && (
                              <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>Summary</span>
                            )}
                            {hasArtifact(doc, 'quiz') && (
                              <span style={{ background: '#f5f3ff', color: '#6d28d9', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>Quiz</span>
                            )}
                            {hasArtifact(doc, 'notes') && (
                              <span style={{ background: '#f0fdf4', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>Notes</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                         <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: '#fef2f2' }}
                          whileTap={{ scale: 0.9 }}
                          style={{ padding: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '8px' }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${doc.name}"? This removes all associated notes and quizzes.`)) {
                              deleteDocument(doc.id);
                            }
                          }}>
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default Dashboard;
