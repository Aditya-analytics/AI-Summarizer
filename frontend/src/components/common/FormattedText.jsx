import React from 'react';
import ReactMarkdown from 'react-markdown';
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

  // Custom renderer for text nodes to detect timestamps
  const renderers = {
    text: ({ value }) => {
      // Non-capturing group for the optional hour part
      const timestampRegex = /\[(?:(?:\d{1,2}:)?\d{1,2}:\d{2})\]/g;
      
      const matches = value.match(timestampRegex);
      if (!matches) return value;

      const parts = value.split(timestampRegex);
      const result = [];
      
      parts.forEach((part, i) => {
        result.push(part);
        if (i < matches.length) {
          const timestamp = matches[i];
          result.push(
            <a 
              key={i} 
              href="#" 
              className="timestamp-link"
              onClick={(e) => handleTimestampClick(e, timestamp)}
            >
              {timestamp}
            </a>
          );
        }
      });
      return result;
    }
  };

  return (
    <div className="formatted-text">
      <ReactMarkdown components={renderers}>
        {children}
      </ReactMarkdown>
      
      <style jsx global>{`
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
