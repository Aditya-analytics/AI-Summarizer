import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useWorkspace } from '../../context/WorkspaceContext';

/**
 * Enhanced Markdown component that detects [MM:SS] or [HH:MM:SS] timestamps
 * and turns them into clickable seek links for the video player.
 */
const FormattedText = ({ children, docUrl }) => {
  const { setSeekTo } = useWorkspace();

  const handleTimestampClick = (e, timestamp) => {
    e.preventDefault();
    
    // 1. Parse MM:SS or HH:MM:SS to seconds
    const parts = timestamp.replace(/[\[\]]/g, '').split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    
    // 2. Open YouTube in new tab with timestamp
    if (docUrl && (docUrl.includes('youtube.com') || docUrl.includes('youtu.be'))) {
      try {
        const url = new URL(docUrl);
        url.searchParams.set('t', seconds);
        window.open(url.toString(), '_blank');
      } catch (err) {
        console.error("Failed to parse YouTube URL", err);
      }
    }
    
    setSeekTo({ time: seconds, timestamp: Date.now() });
  };

  return (
    <div className="formatted-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
      
      <style jsx global>{`
        .formatted-text {
          font-family: var(--font-body);
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .formatted-text h1, .formatted-text h2, .formatted-text h3 {
          font-family: var(--font-display);
          color: var(--text-primary);
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 800;
        }

        .formatted-text p { margin-bottom: 16px; }
        
        /* Elegant Tables */
        .formatted-text table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 24px 0;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: var(--shadow-sm);
        }

        .formatted-text th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          color: var(--text-primary);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
        }

        .formatted-text td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .formatted-text tr:last-child td { border-bottom: none; }
        .formatted-text tr:hover td { background: #fafafa; }

        .timestamp-link {
          display: inline-flex;
          align-items: center;
          padding: 1px 6px;
          margin: 0 2px;
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.1);
          color: var(--brand-primary);
          border-radius: 4px;
          text-decoration: none;
          font-weight: 700;
          font-family: var(--font-mono);
          font-size: 0.9em;
          transition: all 0.2s;
          border: 1px solid hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.2);
        }

        .timestamp-link:hover {
          background: var(--brand-primary);
          color: white;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
};

export default FormattedText;
