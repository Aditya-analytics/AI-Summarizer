import React, { memo } from 'react';
import { 
  FileText, 
  MessageSquareText, 
  BrainCircuit, 
  BookOpen, 
  ChevronLeft,
  Search,
  Type
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkspaceSidebar = ({ activePanel, setActivePanel, docName }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'summary', label: 'AI Summary', icon: FileText },
    { id: 'chat', label: 'Contextual Chat', icon: MessageSquareText },
    { id: 'quiz', label: 'Learning Quiz', icon: BrainCircuit },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
    { id: 'raw', label: 'Source Text', icon: Type },
  ];

  return (
    <div className="workspace-sidebar">
      <div className="sidebar-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={18} />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="document-info">
        <div className="doc-badge">Active Document</div>
        <h2 title={docName}>{docName}</h2>
      </div>

      <nav className="workspace-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;

          return (
            <button
              key={item.id}
              className={`ws-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePanel(item.id)}
            >
              <div className="icon-wrapper">
                <Icon size={18} />
              </div>
              <span>{item.label}</span>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="help-card">
          <Search size={16} />
          <p>Press <span>Cmd+K</span> to search within this document</p>
        </div>
      </div>

      <style jsx>{`
        .workspace-sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          margin-bottom: 32px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--brand-primary);
        }

        .document-info {
          margin-bottom: 40px;
          padding: 0 8px;
        }

        .doc-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brand-primary);
          background: var(--brand-glow);
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .document-info h2 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .workspace-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ws-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          text-align: left;
        }

        .ws-nav-item:hover {
          background: white;
          color: var(--text-primary);
        }

        .ws-nav-item.active {
          background: white;
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          background: var(--brand-primary);
          border-radius: 0 4px 4px 0;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .help-card {
          padding: 16px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .help-card p span {
          background: var(--bg-surface);
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 700;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
};

export default memo(WorkspaceSidebar);
