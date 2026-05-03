import React from 'react';
import FormattedText from '../common/FormattedText';
import { 
  BookOpen, 
  Download, 
  RefreshCw, 
  Copy, 
  Check,
  Layout,
  Loader2,
  AlertCircle,
  FileCode
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import NovaLoader from '../common/NovaLoader';

const NotesPanel = ({ 
  notes, 
  loading, 
  onGenerate, 
  length, 
  setLength, 
  error,
  docUrl
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const element = document.getElementById('notes-content');
    const opt = {
      margin: 1,
      filename: `Nova_Study_Notes_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const downloadHTML = () => {
    const content = `
      <html>
        <head>
          <title>Nova Study Notes</title>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1, h2, h3 { color: #ff6b4a; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Nova Research Intelligence: Study Notes</h1>
          <hr />
          ${notes.replace(/\n/g, '<br />')}
        </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nova_Study_Notes_${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const options = [
    { id: 'short', label: 'Condensed', desc: 'Focus on bullet points and key terms' },
    { id: 'detailed', label: 'Comprehensive', desc: 'Deep dive into all concepts and examples' },
  ];

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="header-title">
          <div className="title-icon"><BookOpen size={18} /></div>
          <h2>Study Notes</h2>
        </div>
        
        <div className="header-actions">
          <button className="action-btn-primary" onClick={onGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>{notes ? 'Regenerate' : 'Generate Notes'}</span>
          </button>
        </div>
      </div>

      <div className="panel-layout">
        <div className="notes-display glass">
          {error && (
            <div className="error-state">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          )}

          {!notes && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon"><BookOpen size={40} /></div>
              <h3>Generate Structured Notes</h3>
              <p>Nova will transform the document into organized study material ready for review.</p>
              <button className="btn-secondary" onClick={onGenerate}>Create Notes</button>
            </div>
          )}

          {notes && (
            <div className="markdown-wrapper">
              <div className="markdown-toolbar">
                <div className="tool-group">
                  <button className="tool-btn" onClick={handleCopy}>
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="tool-group">
                  <button className="tool-btn" onClick={downloadHTML} title="Download HTML">
                    <FileCode size={14} />
                    <span>HTML</span>
                  </button>
                  <button className="tool-btn" onClick={downloadPDF} title="Download PDF">
                    <Download size={14} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              <div className="markdown-body" id="notes-content">
                  <FormattedText docUrl={docUrl}>{notes}</FormattedText>
                  {loading && <NovaLoader variant="writing" text="Nova is refining your notes..." />}
                </div>
            </div>
          )}

          {loading && !notes && (
            <div className="loading-state">
              <NovaLoader variant="thinking" text="Nova is structuring your study material..." />
            </div>
          )}
        </div>

        <div className="notes-config">
          <div className="config-card">
            <h3>Note Configuration</h3>
            <div className="options-list">
              {options.map(opt => (
                <button 
                  key={opt.id}
                  className={`config-opt ${length === opt.id ? 'active' : ''}`}
                  onClick={() => setLength(opt.id)}
                >
                  <div className="opt-label">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pro-tip">
            <Layout size={16} />
            <p>Our notes are optimized for active recall and spaced repetition systems.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .panel-container { height: 100%; display: flex; flex-direction: column; gap: 24px; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; }
        .header-title { display: flex; align-items: center; gap: 12px; }
        .title-icon { width: 36px; height: 36px; background: var(--bg-surface); color: var(--brand-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle); }
        .header-title h2 { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--text-primary); }
        .action-btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--brand-gradient); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; }

        .panel-layout { flex: 1; display: flex; gap: 24px; min-height: 0; }
        .notes-display { flex: 2; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); display: flex; flex-direction: column; overflow: hidden; }
        .notes-config { flex: 1; display: flex; flex-direction: column; gap: 16px; }

        .markdown-wrapper { display: flex; flex-direction: column; height: 100%; }
        .markdown-toolbar { 
          padding: 12px 24px; 
          border-bottom: 1px solid var(--border-subtle); 
          display: flex; 
          justify-content: space-between; 
          background: var(--bg-surface); 
        }
        .tool-group { display: flex; gap: 16px; }
        .tool-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--text-muted); font-weight: 600; font-size: 12px; cursor: pointer; }
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

        .config-card { padding: 24px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }
        .config-card h3 { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 20px; }
        .options-list { display: flex; flex-direction: column; gap: 12px; }
        
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

        .config-opt { text-align: left; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; }
        .config-opt:hover { border-color: var(--brand-primary); }
        .config-opt.active { background: white; border-color: var(--brand-primary); box-shadow: var(--shadow-sm); }
        .opt-label { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .opt-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

        .pro-tip { padding: 16px; background: var(--brand-glow); border-radius: var(--radius-md); display: flex; gap: 12px; color: var(--brand-primary); font-size: 12px; line-height: 1.5; font-weight: 600; }

        .empty-state, .loading-state, .error-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; }
        .empty-icon { color: var(--text-muted); margin-bottom: 24px; opacity: 0.5; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .typing-cursor { display: inline-block; width: 8px; background: var(--brand-primary); margin-left: 4px; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default NotesPanel;
