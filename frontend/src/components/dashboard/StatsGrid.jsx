import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Globe, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, subtext, trend, idx }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
    className="stat-card"
  >
    <div className="stat-header">
      <span className="stat-label">{label}</span>
      <div className="stat-icon-box">
        <Icon size={18} />
      </div>
    </div>
    <div className="stat-value">{value}</div>
    <div className={`stat-footer ${trend ? 'positive' : ''}`}>
      {trend && <TrendingUp size={14} />}
      <span>{subtext}</span>
    </div>

    <style jsx>{`
      .stat-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 24px;
        transition: all var(--duration-base) var(--ease-out);
        box-shadow: var(--shadow-sm);
        position: relative;
        overflow: hidden;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        border-color: var(--brand-primary);
        box-shadow: var(--shadow-premium);
      }

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .stat-label {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-icon-box {
        width: 36px;
        height: 36px;
        background: var(--bg-surface);
        color: var(--brand-primary);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-value {
        font-family: var(--font-display);
        font-size: 32px;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      .stat-footer {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted);
      }

      .stat-footer.positive {
        color: #10b981;
      }
    `}</style>
  </motion.div>
);

const StatsGrid = ({ documents }) => {
  const stats = [
    { 
      label: 'Total Insights', 
      value: documents.length, 
      icon: Zap, 
      subtext: '+12% this week', 
      trend: true 
    },
    { 
      label: 'Documents', 
      value: documents.filter(d => d.type === 'PDF').length, 
      icon: FileText, 
      subtext: 'High-fidelity PDFs', 
      trend: false 
    },
    { 
      label: 'Web & Media', 
      value: documents.filter(d => d.type !== 'PDF').length, 
      icon: Globe, 
      subtext: 'Articles & Videos', 
      trend: false 
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} idx={i} />
      ))}

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }
      `}</style>
    </div>
  );
};

export default StatsGrid;
