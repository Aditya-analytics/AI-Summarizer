import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css';
import { WorkspaceProvider } from './context/WorkspaceContext';

// Page Imports
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));

const PageLoader = () => (
  <div className="loader-full">
    <div className="loader-spinner" />
    <span>Loading Nova Intelligence...</span>
    <style jsx>{`
      .loader-full { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; font-family: var(--font-display); font-weight: 800; color: var(--brand-primary); background: var(--bg-base); }
      .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--brand-glow); border-top-color: var(--brand-primary); border-radius: 50%; animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

function App() {
  return (
    <WorkspaceProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace/:id"
              element={
                <ProtectedRoute>
                  <WorkspacePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </WorkspaceProvider>
  );
}

export default App;
