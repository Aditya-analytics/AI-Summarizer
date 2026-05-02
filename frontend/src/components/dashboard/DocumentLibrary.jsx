import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Globe, 
  Clock, 
  MoreVertical,
  CheckCircle2,
  BrainCircuit,
  MessageSquareText,
  FileSearch,
  ArrowRight
} from 'lucide-react';

const DocumentLibrary = ({ documents, loading, onDelete }) => {
  const navigate = useNavigate();

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText size={16} />;
      case 'youtube': return <Video size={16} />;
      case 'url': return <Globe size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const hasArtifact = (doc, type) => {
    return doc.artifacts && doc.artifacts.includes(type);
  };

  if (loading) {
    return (
      <div className="library-loading">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="library-empty">
        <div className="empty-visual">
          <FileSearch size={48} />
        </div>
        <h3>No documents analyzed yet</h3>
        <p>Upload a PDF, link an article, or paste a YouTube URL to begin your learning journey.</p>
      </div>
    );
  }

  return (
    <div className="library-container">
      <table className="library-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Uploaded</th>
            <th>Status</th>
            <th>Artifacts</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, idx) => (
            <motion.tr 
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}
              className="library-row"
            >
              <td>
                <div className="doc-name-cell">
                  <span className="doc-name">{doc.name}</span>
                </div>
              </td>
              <td>
                <span className={`type-badge ${doc.type?.toLowerCase()}`}>
                  {getTypeIcon(doc.type)}
                  {doc.type}
                </span>
              </td>
              <td>
                <span className="date-text">{new Date(doc.created_at).toLocaleDateString()}</span>
              </td>
              <td>
                <span className="status-badge processed">
                  <CheckCircle2 size={12} />
                  Processed
                </span>
              </td>
              <td>
                <div className="artifact-group">
                  {hasArtifact(doc, 'summary') && (
                    <div className="artifact-icon" title="Summary Ready">
                      <FileText size={14} />
                    </div>
                  )}
                  {hasArtifact(doc, 'quiz') && (
                    <div className="artifact-icon" title="Quiz Available">
                      <BrainCircuit size={14} />
                    </div>
                  )}
                  {hasArtifact(doc, 'notes') && (
                    <div className="artifact-icon" title="Notes Generated">
                      <MessageSquareText size={14} />
                    </div>
                  )}
                </div>
              </td>
              <td className="text-right">
                <div className="row-actions">
                  <button className="action-btn-circle" onClick={(e) => {
                    e.stopPropagation();
                    // onDelete(doc.id)
                  }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .library-container {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .library-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .library-table th {
          padding: 16px 24px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .library-row {
          cursor: pointer;
          transition: background var(--duration-fast) var(--ease-out);
        }

        .library-row:hover {
          background: var(--bg-surface);
        }

        .library-row:not(:last-child) {
          border-bottom: 1px solid var(--border-subtle);
        }

        .library-row td {
          padding: 20px 24px;
          vertical-align: middle;
        }

        .doc-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          background: var(--bg-surface);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .type-badge.pdf { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
        .type-badge.youtube { background: #fef3c7; color: #92400e; border-color: #fde68a; }
        .type-badge.url { background: #dbeafe; color: #1e40af; border-color: #bfdbfe; }

        .date-text {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }

        .status-badge.processed {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .artifact-group {
          display: flex;
          gap: 8px;
        }

        .artifact-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          color: var(--brand-primary);
        }

        .action-btn-circle {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 50%;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .action-btn-circle:hover {
          background: var(--bg-surface);
          color: var(--text-primary);
        }

        .library-empty {
          padding: 80px 40px;
          text-align: center;
          background: var(--bg-elevated);
          border: 2px dashed var(--border-subtle);
          border-radius: var(--radius-xl);
        }

        .empty-visual {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: var(--bg-surface);
          color: var(--text-muted);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .library-empty h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .library-empty p {
          color: var(--text-secondary);
          max-width: 400px;
          margin: 0 auto;
          font-size: 15px;
          line-height: 1.6;
        }

        .skeleton-row {
          height: 72px;
          background: linear-gradient(90deg, var(--bg-surface) 25%, var(--border-subtle) 50%, var(--bg-surface) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: var(--radius-md);
          margin-bottom: 12px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .text-right { text-align: right; }
      `}</style>
    </div>
  );
};

export default DocumentLibrary;
