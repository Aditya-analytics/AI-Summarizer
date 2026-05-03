import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Command, Plus, User, LogOut, Settings, CreditCard, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';

const TopHeader = ({ title, onNewDocument, onToggleSidebar, onBack }) => {
  const navigate = useNavigate();
  const { clearWorkspace } = useWorkspace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const handleLogout = () => {
    clearWorkspace();
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user_email');
    navigate('/auth');
  };

  const notifications = [
    { id: 2, title: 'New Feature', desc: 'Try the new "Learning Quiz" mode in your workspace.', icon: Clock, time: '1h ago', unread: true },
    { id: 3, title: 'System Update', desc: 'Nova v2.5 is now live with Gemini Flash-Lite.', icon: Settings, time: '5h ago', unread: false },
  ];

  const [productionNotice, setProductionNotice] = useState({ show: false, feature: '' });
  
  const triggerNotice = (featureName) => {
    setProductionNotice({ show: true, feature: featureName });
    setTimeout(() => setProductionNotice({ show: false, feature: '' }), 3000);
  };

  return (
    <header className="nova-header">
      <div className="header-left">
        {onBack ? (
          <button className="header-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
        ) : (
          <button className="mobile-sidebar-toggle" onClick={onToggleSidebar}>
            <div className="menu-icon-v2">
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </button>
        )}
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-container" onClick={() => triggerNotice('Search')}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="search-input" 
            readOnly
          />
          <div className="search-kbd">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="popover-wrapper">
            <button 
              className={`icon-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            >
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="popover notifications-popover"
                >
                  <div className="popover-header">
                    <h3>Notifications</h3>
                    <button>Mark all as read</button>
                  </div>
                  <div className="popover-content">
                    {notifications.map(n => (
                      <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                        <div className="notif-icon">
                          <n.icon size={16} />
                        </div>
                        <div className="notif-info">
                          <div className="notif-title-row">
                            <span className="notif-title">{n.title}</span>
                            <span className="notif-time">{n.time}</span>
                          </div>
                          <p className="notif-desc">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="popover-header">
                    <button>View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="header-btn-primary"
            onClick={onNewDocument}
          >
            <Plus size={18} />
            <span>New Document</span>
          </motion.button>

          <div className="popover-wrapper">
            <button 
              className={`profile-trigger ${showProfile ? 'active' : ''}`}
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            >
              <div className="avatar">R</div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="popover profile-popover"
                >
                  <div className="user-info">
                    <div className="avatar-lg">R</div>
                    <div className="user-details">
                      <h4>Researcher</h4>
                      <p>demo@gmail.com</p>
                    </div>
                  </div>
                  <div className="popover-divider" />
                  <div className="popover-menu">
                    <button className="menu-item" onClick={() => triggerNotice('Profile')}>
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button className="menu-item" onClick={() => triggerNotice('Settings')}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button className="menu-item" onClick={() => triggerNotice('Billing')}>
                      <CreditCard size={16} />
                      <span>Billing</span>
                    </button>
                  </div>
                  <div className="popover-divider" />
                  <div className="popover-menu">
                    <button className="menu-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {productionNotice.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="global-production-toast"
          >
            <div className="notice-icon">🚧</div>
            <div className="notice-text">
              <strong>{productionNotice.feature} Module</strong>
              <span>This feature is currently in production. Sorry for the inconvenience!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .nova-header {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-back-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .header-back-btn:hover {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        .header-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .search-container {
          width: 320px;
          height: 42px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 10px;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .search-container:focus-within {
          border-color: var(--brand-primary);
          background: white;
          box-shadow: 0 0 0 4px var(--brand-glow);
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-body);
        }

        .global-production-toast {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 20px;
          display: flex;
          gap: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          z-index: 1000;
          border-top: 4px solid var(--brand-primary);
        }

        .notice-icon {
          font-size: 28px;
        }

        .notice-text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .notice-text strong {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .notice-text span {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .search-kbd {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          color: var(--text-muted);
          font-size: 10px;
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          position: relative;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .icon-btn:hover, .icon-btn.active {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--brand-primary);
          border: 2px solid white;
          border-radius: 50%;
        }

        .header-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 42px;
          padding: 0 20px;
          background: var(--brand-gradient);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 14px;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .header-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 25px hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.3);
        }

        /* Popover Styles */
        .popover-wrapper {
          position: relative;
        }

        .popover {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: 100;
          overflow: hidden;
        }

        .notifications-popover {
          width: 360px;
        }

        .popover-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .popover-header h3 {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
        }

        .popover-header button {
          background: none;
          border: none;
          color: var(--brand-primary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .popover-content {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 16px 20px;
          display: flex;
          gap: 16px;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: var(--bg-surface);
        }

        .notification-item.unread {
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.02);
        }

        .notif-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--bg-surface);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-info {
          flex: 1;
        }

        .notif-title-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .notif-title {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
        }

        .notif-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .notif-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .popover-footer {
          padding: 12px;
          text-align: center;
          border-top: 1px solid var(--border-subtle);
        }

        .popover-footer button {
          width: 100%;
          padding: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Profile Popover */
        .profile-trigger {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          padding: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-trigger:hover, .profile-trigger.active {
          border-color: var(--brand-primary);
          background: white;
        }

        .avatar {
          width: 100%;
          height: 100%;
          background: var(--brand-gradient);
          border-radius: 6px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
        }

        .profile-popover {
          width: 240px;
          padding: 8px;
        }

        .user-info {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-lg {
          width: 40px;
          height: 40px;
          background: var(--brand-gradient);
          border-radius: 10px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .user-details h4 {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .user-details p {
          font-size: 12px;
          color: var(--text-muted);
        }

        .popover-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 8px 0;
        }

        .popover-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .menu-item:hover {
          background: var(--bg-surface);
          color: var(--text-primary);
        }

        .menu-item.logout {
          color: #ef4444;
        }

        .menu-item.logout:hover {
          background: #fef2f2;
        }

        .mobile-sidebar-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          margin-right: 16px;
        }
        
        .menu-icon-v2 {
          width: 20px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .menu-icon-v2 .line {
          height: 2px;
          width: 100%;
          background: var(--text-primary);
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .nova-header { padding: 0 24px; }
          .mobile-sidebar-toggle { display: block; }
          .search-container { display: none; }
          .header-title { font-size: 20px; }
          .notifications-popover { width: 300px; right: -80px; }
        }
      `}</style>
    </header>
  );
};

export default TopHeader;
