import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

// Layout Components
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';

// Components
import DocumentLibrary from '../components/dashboard/DocumentLibrary';

const LibraryPage = () => {
  const { documents, loading, deleteDocument } = useWorkspace();

  return (
    <div className="library-root">
      <Sidebar />

      <main className="library-content">
        <TopHeader title="Research Library" />

        <div className="content-inner">
          <header className="page-intro">
            <div className="intro-badge">
              <span className="dot" />
              Full Archive
            </div>
            <h2>My Research Library</h2>
            <p>Access and manage your complete collection of analyzed research material.</p>
          </header>

          <section className="full-library">
            <DocumentLibrary
              documents={documents}
              loading={loading}
              onDelete={deleteDocument}
            />
          </section>
        </div>
      </main>

      <style jsx>{`
        .library-root {
          display: flex;
          min-height: 100vh;
          background: var(--bg-base);
        }

        .library-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-inner {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .content-inner {
            padding: 24px 16px;
          }
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

        .full-library {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};

export default LibraryPage;
