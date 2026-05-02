import React from 'react';
import { Search, Bell, Command, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const TopHeader = ({ title, onNewDocument }) => {
  return (
    <header className="nova-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search documents..." className="search-input" />
          <div className="search-kbd">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="header-btn-primary"
            onClick={onNewDocument}
          >
            <Plus size={18} />
            <span>New Document</span>
          </motion.button>
        </div>
      </div>

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

        .icon-btn:hover {
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
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </header>
  );
};

export default TopHeader;
