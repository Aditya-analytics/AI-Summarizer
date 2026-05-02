import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Printer, Share2, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const NotesViewer = ({ title, content, created_at, styleType, setStyleType }) => {
  const contentRef = useRef(null);

  const handleDownloadPdf = () => {
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: `${title || 'Nova-Notes'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="notes-viewer animate-fade-up">
      <header className="notes-header">
        <div className="notes-header-left">
          <div className="notes-icon-box">
            <FileText size={20} className="text-pink-500" />
          </div>
          <div className="notes-header-info">
            <h2>{title}</h2>
            <p>Last updated: {new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="notes-actions">
          <div className="style-toggle-group">
            <button 
              onClick={() => setStyleType('Quicksheet')}
              className={styleType === 'Quicksheet' ? 'active' : ''}
            >
              Quicksheet
            </button>
            <button 
              onClick={() => setStyleType('Detailed')}
              className={styleType === 'Detailed' ? 'active' : ''}
            >
              Detailed
            </button>
          </div>
          
          <button className="btn-notes-action"><Printer size={16} /> Print</button>
          <button className="btn-notes-action"><Share2 size={16} /> Share</button>
          <button className="btn-notes-pdf" onClick={handleDownloadPdf}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </header>

      <main className="notes-doc-wrapper">
        <div className="notes-doc" ref={contentRef}>
          <h1 className="notes-doc-title">{title}</h1>
          <div className="notes-meta-row">
            <span className="notes-badge">Study Notes</span>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
               • {new Date(created_at).toLocaleDateString()} • {styleType} Mode
            </span>
          </div>
          <div className="notes-divider"></div>

          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotesViewer;
