import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  Video,
  FileText,
  Loader2,
  AlertCircle,
  Settings2,
  ChevronRight,
  Globe,
  Sparkles
} from 'lucide-react';

const IngestModal = ({ isOpen, onClose, onIngest, isUploading, streamingText, error }) => {
  const [activeTab, setActiveTab] = useState('pdf'); // pdf | url | youtube | text
  const [inputValue, setInputValue] = useState('');
  const [summaryLength, setSummaryLength] = useState('standard');
  const [language, setLanguage] = useState('English');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const validateInput = () => {
    if (activeTab === 'url') {
      if (!inputValue.startsWith('http')) return 'URL must start with http:// or https://';
    }
    if (activeTab === 'youtube') {
      const isShorts = inputValue.includes('/shorts/');
      const isStandard = inputValue.includes('v=') || inputValue.includes('youtu.be/');
      if (!isShorts && !isStandard) return 'Invalid YouTube URL format';
    }
    if (activeTab === 'text') {
      if (inputValue.length < 50) return 'Content too short. Paste at least 50 chars.';
    }
    return null;
  };

  const handleSubmit = () => {
    const errorMsg = validateInput();
    if (errorMsg) {
      console.log("LOG: Validation Error:", errorMsg);
      return;
    }

    onIngest({ type: activeTab, value: inputValue, length: summaryLength, language });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        console.log('LOG: Invalid file type uploaded.');
        return;
      }
      onIngest({ type: 'pdf', file, length: summaryLength, language });
    }
  };

  const tabs = [
    { id: 'pdf', label: 'File', icon: UploadCloud },
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'youtube', label: 'YouTube', icon: Video },
    { id: 'text', label: 'Text', icon: FileText },
  ];

  return (
    <div className="modal-root">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content glass"
      >
        <button className="close-btn" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <div className="header-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h2>Ingest New Content</h2>
            <p>Select a source and customize your learning output.</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="tabs-container">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="main-config">
            <div className="input-section">
              {activeTab === 'pdf' ? (
                <div
                  className="drop-zone"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={40} className="drop-icon" />
                  <p className="drop-text">Click or drag PDF to upload</p>
                  <p className="drop-subtext">Maximum file size: 50MB</p>
                </div>
              ) : (
                <div className="input-field-group">
                  <label className="input-label">
                    {activeTab === 'url' ? 'Article URL' : activeTab === 'youtube' ? 'YouTube Video URL' : 'Paste Text Content'}
                  </label>
                  {activeTab === 'text' ? (
                    <textarea
                      className="input-textarea"
                      placeholder="Paste your content here..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  ) : (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="input-text"
                        placeholder={activeTab === 'url' ? 'https://example.com/article' : 'https://youtube.com/watch?v=...'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      />
                      <button className="input-submit-btn" onClick={() => handleSubmit()}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="settings-section">
              <div className="settings-header">
                <Settings2 size={16} />
                <span>Output Config</span>
              </div>

              <div className="setting-item">
                <label>Summary Depth</label>
                <select value={summaryLength} onChange={e => setSummaryLength(e.target.value)}>
                  <option value="short">Short (Bullets)</option>
                  <option value="standard">Standard (Overview)</option>
                  <option value="detailed">Detailed (Deep Dive)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {(isUploading || streamingText) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="streaming-preview"
              >
                <div className="preview-header">
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Nova is processing...</span>
                    </>
                  ) : (
                    <span>✅ Ingestion & Analysis Complete</span>
                  )}
                </div>
                <div className="preview-content progress-steps">
                  {streamingText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isUploading}>Cancel</button>
          {activeTab !== 'pdf' && (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isUploading || !inputValue.trim()}
              style={{ cursor: isUploading || !inputValue.trim() ? 'not-allowed' : 'pointer' }}
            >
              Process Content
            </button>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .modal-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 100%;
          max-width: 800px;
          background: var(--bg-elevated);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          position: relative;
          z-index: 1001;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--bg-surface);
          color: var(--text-primary);
        }

        .modal-header {
          padding: 32px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: var(--brand-gradient);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .modal-header h2 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .modal-header p {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .modal-body {
          padding: 32px 40px;
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .tab-btn.active {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          box-shadow: 0 4px 12px var(--brand-glow);
        }

        .main-config {
          display: flex;
          gap: 32px;
        }

        .input-section {
          flex: 2;
        }

        .drop-zone {
          height: 200px;
          border: 2px dashed var(--border-muted);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          cursor: pointer;
          transition: all 0.2s;
        }

        .drop-zone:hover {
          border-color: var(--brand-primary);
          background: white;
        }

        .drop-icon {
          color: var(--brand-primary);
          margin-bottom: 16px;
          opacity: 0.7;
        }

        .drop-text {
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .drop-subtext {
          font-size: 12px;
          color: var(--text-muted);
        }

        .input-field-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
        }

        .input-text {
          flex: 1;
          padding: 14px 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text-primary);
        }

        .input-text:focus {
          border-color: var(--brand-primary);
          background: white;
        }

        .input-submit-btn {
          width: 48px;
          background: var(--brand-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .input-textarea {
          width: 100%;
          height: 200px;
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          resize: none;
        }

        .settings-section {
          flex: 1;
          padding: 24px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-item label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .setting-item select {
          padding: 10px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
        }

        .streaming-preview {
          margin-top: 24px;
          background: white;
          border: 1px solid hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.2);
          border-radius: var(--radius-md);
          padding: 20px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--brand-primary);
          margin-bottom: 12px;
        }

        .preview-content {
          font-size: 13px;
          line-height: 1.8;
          color: var(--text-secondary);
          white-space: pre-wrap;
          max-height: 150px;
          overflow-y: auto;
          font-family: var(--font-mono);
        }

        .progress-steps {
          color: var(--brand-primary);
        }

        .error-banner {
          margin-top: 24px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
        }

        .modal-footer {
          padding: 24px 40px;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .btn-primary {
          padding: 12px 24px;
          background: var(--brand-gradient);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default IngestModal;
