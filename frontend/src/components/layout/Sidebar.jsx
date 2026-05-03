import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  HelpCircle,
  Users
} from 'lucide-react';

import { useWorkspace } from '../../context/WorkspaceContext';

const Sidebar = ({ collapsed = false }) => {
  const { clearWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem('nova_user_email') || 'User';
  const userName = userEmail.split('@')[0];

  const handleLogout = () => {
    clearWorkspace();
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user_email');
    navigate('/auth');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles, path: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'library', label: 'My Library', icon: FileText, path: '/library' },
    { id: 'community', label: 'Community', icon: Users, path: '#', badge: 'Soon' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '#' },
  ];

  return (
    <aside className={`nova-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <div className="logo-icon">
          <Sparkles size={20} fill="currentColor" />
        </div>
        {!collapsed && <span className="logo-text">Nova</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <div 
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => item.path !== '#' && navigate(item.path)}
            >
              <Icon size={20} className="nav-icon" />
              {!collapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-profile">
            <div className="user-avatar">
              {userName[0].toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{userName}</p>
              <p className="user-plan">Pro Plan</p>
            </div>
          </div>
        )}
        <div className="footer-actions">
          <button className="footer-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <style jsx>{`
        .nova-sidebar {
          width: 240px;
          height: 100vh;
          background: var(--bg-elevated);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: sticky;
          top: 0;
          transition: width var(--duration-base) var(--ease-out);
          z-index: 100;
        }

        .nova-sidebar.collapsed {
          width: 80px;
          padding: 24px 12px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
          margin-bottom: 40px;
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--brand-gradient);
          color: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .nav-item:hover {
          background: var(--bg-surface);
          color: var(--brand-primary);
        }

        .nav-item.active {
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.08);
          color: var(--brand-primary);
        }

        .nav-badge {
          margin-left: auto;
          background: var(--border-subtle);
          color: var(--text-muted);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          border: 2px solid var(--brand-primary);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .user-plan {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .footer-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .footer-btn:hover {
          background: hsla(0, 100%, 50%, 0.05);
          color: #ef4444;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
