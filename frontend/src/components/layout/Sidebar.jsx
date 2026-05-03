import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  HelpCircle,
  Users,
  Plus,
  Zap
} from 'lucide-react';

import { useWorkspace } from '../../context/WorkspaceContext';

const Sidebar = ({ collapsed = false, mobileOpen = false, onClose }) => {
  const { clearWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  // For Demo/Production Showcase: Using hardcoded values
  const userEmail = 'demo@gmail.com';
  const userName = 'Researcher';

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
    { id: 'gauntlet', label: 'Nova Gauntlet', icon: Sparkles, path: '/gauntlet', special: true },
    { id: 'community', label: 'Community', icon: Users, path: '#', badge: 'Soon' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`nova-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Sparkles size={20} fill="currentColor" />
          </div>
          {!collapsed && <span className="logo-text">Nova</span>}
          {mobileOpen && (
            <button className="mobile-close-btn" onClick={onClose}>
              <Plus style={{ transform: 'rotate(45deg)' }} size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div 
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''} ${item.id === 'gauntlet' ? 'gauntlet' : ''}`}
                onClick={() => {
                  if (item.path !== '#') {
                    navigate(item.path);
                    if (onClose) onClose();
                  }
                }}
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
            <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">
                {userName[0].toUpperCase()}
              </div>
              <div className="user-info">
                <div className="name-row">
                  <p className="user-name">{userName}</p>
                  <div className="pro-tag-minimal">PRO</div>
                </div>
                <p className="user-email-minimal">{userEmail}</p>
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
            transition: all var(--duration-base) var(--ease-out);
            z-index: 1000;
          }

          @media (max-width: 1024px) {
            .nova-sidebar {
              position: fixed;
              left: -280px;
              top: 0;
              bottom: 0;
              width: 280px;
              box-shadow: 20px 0 50px rgba(0, 0, 0, 0.1);
            }
            .nova-sidebar.mobile-open {
              left: 0;
            }
            .sidebar-overlay {
              position: fixed;
              inset: 0;
              background: rgba(15, 23, 42, 0.4);
              backdrop-filter: blur(4px);
              z-index: 999;
            }
            .mobile-close-btn {
              margin-left: auto;
              background: none;
              border: none;
              color: var(--text-muted);
              cursor: pointer;
            }
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

        .nav-item.gauntlet {
          position: relative;
          color: var(--brand-primary);
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.03);
          border: 1px solid hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.1);
          margin: 4px 0;
          overflow: hidden;
        }

        .nav-item.gauntlet::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--brand-glow);
          opacity: 0.1;
          animation: gauntlet-pulse 3s infinite ease-in-out;
          pointer-events: none;
        }

        .nav-item.gauntlet:hover {
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.08);
          border-color: var(--brand-primary);
          transform: translateX(4px);
        }

        @keyframes gauntlet-pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
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
          width: 32px;
          height: 32px;
          min-width: 32px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          overflow: hidden;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pro-tag-minimal {
          font-size: 9px;
          font-weight: 900;
          background: var(--brand-glow);
          color: var(--brand-primary);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .user-email-minimal {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
    </>
  );
};

export default Sidebar;
