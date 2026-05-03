import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

// Layout Components
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';

// Dashboard Components
import StatsGrid from '../components/dashboard/StatsGrid';
import DocumentLibrary from '../components/dashboard/DocumentLibrary';
import IngestModal from '../components/dashboard/IngestModal';

// Hooks
import { useIngestion } from '../hooks/useIngestion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents, loading, error, deleteDocument } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    isUploading, 
    streamingText, 
    uploadError, 
    ingest, 
    resetIngestion 
  } = useIngestion();

  const handleOpenModal = () => {
    resetIngestion();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isUploading) {
      setIsModalOpen(false);
    }
  };

  const handleIngest = async (data) => {
    await ingest(data);
  };

  return (
    <div className="dashboard-root">
      <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="dashboard-content">
        <TopHeader 
          title="Overview" 
          onNewDocument={handleOpenModal} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="content-inner">
          <header className="page-intro">
            <div className="intro-badge">
              <span className="dot" />
              Intelligence Dashboard
            </div>
            <h2>Welcome back, Researcher</h2>
            <p>Your AI Learning Workspace is synchronized and ready.</p>
          </header>

          <StatsGrid documents={documents} />

          <section className="library-section">
            <div className="section-header">
              <div className="header-left">
                <h3>Recent Documents</h3>
                <p>Manage and review your processed research content.</p>
              </div>
              <button className="view-all-btn" onClick={() => navigate('/library')}>
                View All Library
                <ArrowRight size={16} />
              </button>
            </div>
            
            <DocumentLibrary 
              documents={Array.isArray(documents) ? documents.slice(0, 3) : []} 
              loading={loading} 
              onDelete={deleteDocument}
            />
          </section>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <IngestModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onIngest={handleIngest}
            isUploading={isUploading}
            streamingText={streamingText}
            error={uploadError}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .dashboard-root {
          display: flex;
          min-height: 100vh;
          background: var(--bg-base);
        }

        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex overflow */
        }

        .content-inner {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .page-intro {
          margin-bottom: 40px;
        }

        .intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.08);
          color: var(--brand-primary);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .intro-badge .dot {
          width: 6px;
          height: 6px;
          background: var(--brand-primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .page-intro h2 {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -1px;
          margin-bottom: 4px;
        }

        .page-intro p {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .library-section {
          margin-top: 48px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .section-header h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .section-header p {
          font-size: 14px;
          color: var(--text-muted);
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid var(--border-subtle);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }

        /* Mobile Adjustments (Basic) */
        @media (max-width: 1024px) {
          .content-inner {
            padding: 24px;
          }
          .dashboard-root {
            position: relative;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
