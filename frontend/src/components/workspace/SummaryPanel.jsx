import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  RefreshCw, 
  Settings, 
  FileText, 
  Copy, 
  Check,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryPanel = ({ 
  summary, 
  loading, 
  onGenerate, 
  length, 
  setLength, 
  error 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lengths = [
    { id: 'short', label: 'Brief' },
    { id: 'standard', label: 'Standard' },
    { id: 'detailed', label: 'Detailed' },
  ];

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="header-title">
          <div className="title-icon"><Sparkles size={18} /></div>
          <h2>AI Summary</h2>
        </div>
        
        <div className="header-actions">
          <div className="toggle-group">
            {lengths.map(l => (
              <button 
                key={l.id}
                className={`toggle-btn ${length === l.id ? 'active' : ''}`}
                onClick={() => setLength(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
          
          <button className="action-btn-primary" onClick={onGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>{summary ? 'Regenerate' : 'Generate'}</span>
          </button>
        </div>
      </div>

      <div className="panel-content glass">
        {error && (
          <div className="error-state">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        {!summary && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={40} /></div>
            <h3>No Summary Generated</h3>
            <p>Select your preferred depth and click generate to analyze this document.</p>
            <button className="btn-secondary" onClick={onGenerate}>Create Summary</button>
          </div>
        )}

        {summary && (
          <div className="markdown-wrapper">
            <div className="markdown-toolbar">
              <button className="tool-btn" onClick={handleCopy}>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{summary}</ReactMarkdown>
              {loading && <span className="typing-cursor">▌</span>}
            </div>
          </div>
        )}

        {loading && !summary && (
          <div className="loading-state">
            <Loader2 size={40} className="animate-spin" />
            <p>Nova is distilling the core insights...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .panel-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 24px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          width: 36px;
          height: 36px;
          background: var(--brand-glow);
          color: var(--brand-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-title h2 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle-group {
          background: var(--bg-surface);
          padding: 4px;
          border-radius: 10px;
          display: flex;
          border: 1px solid var(--border-subtle);
        }

        .toggle-btn {
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 6px;
          border: none;
          background: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: white;
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        .action-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--brand-gradient);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .panel-content {
          flex: 1;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 500px;
        }

        .markdown-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .markdown-toolbar {
          padding: 12px 24px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
          background: var(--bg-surface);
        }

        .tool-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .markdown-body {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          font-size: 15px;
          line-height: 1.8;
          color: var(--text-primary);
        }

        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--text-primary);
        }

        .markdown-body h1 { font-size: 24px; border-bottom: 2px solid var(--brand-glow); padding-bottom: 8px; }
        .markdown-body h2 { font-size: 20px; }
        .markdown-body h3 { font-size: 18px; }

        .markdown-body p { margin-bottom: 16px; }

        .markdown-body ul, .markdown-body ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }

        .markdown-body li { margin-bottom: 8px; }

        .markdown-body strong { color: var(--brand-primary); }
        
        .markdown-body blockquote {
          border-left: 4px solid var(--brand-primary);
          padding-left: 16px;
          margin: 16px 0;
          color: var(--text-secondary);
          font-style: italic;
        }

        .empty-state, .loading-state, .error-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          max-width: 320px;
          margin-bottom: 24px;
        }

        .btn-secondary {
          padding: 12px 32px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .typing-cursor {
          display: inline-block;
          width: 8px;
          background: var(--brand-primary);
          margin-left: 4px;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SummaryPanel;
