import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Video, Globe, MoreHorizontal } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

const DocumentLibrary = ({ documents, loading }) => {
  const navigate = useNavigate();
  const { setActiveDocument } = useWorkspace();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-3xl">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No documents yet. Upload one to get started!</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={20} />;
      case 'youtube': return <Video size={20} />;
      case 'url': return <Globe size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const handleDocClick = (doc) => {
    setActiveDocument(doc);
    navigate(`/workspace/${doc.id}`);
  };

  return (
    <div className="library-grid-v2">
      {documents.map((doc) => (
        <div key={doc.id} className="doc-card-v2" onClick={() => handleDocClick(doc)}>
          <div className="doc-top">
            <div className="doc-icon-box">{getIcon(doc.type)}</div>
            <div className="doc-more"><MoreHorizontal size={20} /></div>
          </div>
          <div className="doc-info">
            <h3>{doc.title || doc.source}</h3>
            <p>{doc.mastery || '0%'} Mastered • {doc.q_count || 0} Questions</p>
          </div>
          <div className="doc-footer">
            <div className="avatar-stack">
              <div className="tag-dot" style={{ background: '#ffedd5' }}></div>
              <div className="tag-dot" style={{ background: '#dbeafe' }}></div>
            </div>
            <span className="time-ago">
              {new Date(doc.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentLibrary;
