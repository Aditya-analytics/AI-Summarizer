import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NovaLoader from './components/common/NovaLoader';

// Page Imports
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GauntletPage = lazy(() => import('./pages/GauntletPage'));

const PageLoader = () => (
  <div className="loader-full">
    <NovaLoader variant="thinking" text="Loading Nova Intelligence..." />
    <style jsx>{`
      .loader-full { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; font-family: var(--font-display); font-weight: 800; color: var(--brand-primary); background: var(--bg-base); }
    `}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gauntlet"
              element={
                <ProtectedRoute>
                  <GauntletPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </WorkspaceProvider>
  </ErrorBoundary>
  );
}

export default App;
