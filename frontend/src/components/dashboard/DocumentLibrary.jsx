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
  ArrowRight,
  Trash2
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
    if (type === 'summary') return doc.has_summary;
    if (type === 'quiz') return doc.has_quiz;
    if (type === 'notes') return doc.has_notes;
    return false;
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

  return (
    <>
      {(!documents || documents.length === 0) ? (
        <div className="library-empty">
          <div className="empty-visual">
            <FileSearch size={48} />
          </div>
          <h3>No documents analyzed yet</h3>
          <p>Upload a PDF, link an article, or paste a YouTube URL to begin your learning journey.</p>
        </div>
      ) : (
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
              {(Array.isArray(documents) ? documents : []).map((doc, idx) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="library-row"
                >
                  <td onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
                    <div className="doc-name-cell">
                      <span className="doc-name">{doc.name}</span>
                    </div>
                  </td>
                  <td onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
                    <span className={`type-badge ${doc.type?.toLowerCase()}`}>
                      {getTypeIcon(doc.type)}
                      {doc.type}
                    </span>
                  </td>
                  <td onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
                    <span className="date-text">{new Date(doc.created_at).toLocaleDateString()}</span>
                  </td>
                  <td onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
                    <span className="status-badge processed">
                      <CheckCircle2 size={12} />
                      Processed
                    </span>
                  </td>
                  <td onClick={() => navigate(`/workspace/${doc.id}`, { state: { doc } })}>
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
                      <button
                        className="action-btn-circle delete"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log("LOG: Delete button clicked for doc:", doc.id);
                          onDelete(doc.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .library-container {
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .library-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .library-table th {
          padding: 20px 24px;
          font-size: 11px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .library-row {
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .library-row:hover {
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.02);
        }

        .library-row:not(:last-child) {
          border-bottom: 1px solid var(--border-subtle);
        }

        .library-row td {
          padding: 24px;
          vertical-align: middle;
        }

        .doc-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 15px;
          letter-spacing: -0.01em;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid var(--border-subtle);
        }

        .type-badge.pdf { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
        .type-badge.youtube { background: #fffbeb; color: #d97706; border-color: #fef3c7; }
        .type-badge.url { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }

        .date-text {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-badge.processed {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .artifact-group {
          display: flex;
          gap: 8px;
        }

        .artifact-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          color: var(--brand-primary);
          transition: all 0.2s;
        }

        .artifact-icon:hover {
          border-color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        .action-btn-circle {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn-circle:hover {
          background: white;
          color: var(--text-primary);
          border-color: var(--border-subtle);
          box-shadow: var(--shadow-sm);
        }

        .action-btn-circle.delete:hover {
          background: #fff1f2;
          color: #e11d48;
          border-color: #fecdd3;
        }

        .library-empty {
          padding: 120px 40px;
          text-align: center;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .library-empty::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: var(--brand-glow);
          opacity: 0.15;
          filter: blur(60px);
          border-radius: 50%;
          z-index: 0;
        }

        .empty-visual {
          position: relative;
          z-index: 1;
          width: 90px;
          height: 90px;
          margin: 0 auto 32px;
          background: var(--bg-surface);
          color: var(--brand-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          animation: float 6s infinite ease-in-out;
        }

        .library-empty h3 {
          position: relative;
          z-index: 1;
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .library-empty p {
          position: relative;
          z-index: 1;
          color: var(--text-secondary);
          max-width: 440px;
          margin: 0 auto 24px;
          font-size: 16px;
          line-height: 1.6;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
    </>
  );
};

export default DocumentLibrary;
