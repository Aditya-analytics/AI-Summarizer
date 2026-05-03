import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import { User, CreditCard, CheckCircle2, Package, History, ArrowLeft, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('billing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'app', label: 'App Settings', icon: Settings },
  ];

  return (
    <div className="settings-root">
      <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="settings-content">
        <TopHeader 
          title="App Settings" 
          onBack={() => navigate('/dashboard')}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="content-inner">
          <div className="settings-layout">
            {/* Settings Sidebar */}
            <aside className="settings-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </aside>

            {/* Settings Main */}
            <section className="settings-main glass">
              <AnimatePresence mode="wait">
                {activeTab === 'app' && (
                  <motion.div
                    key="app"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="settings-panel"
                  >
                    <div className="panel-header">
                      <h2>App Preferences</h2>
                      <p>Configure how Nova behaves and interacts with your research.</p>
                    </div>

                    <div className="settings-grid">
                      <div className="input-group">
                        <label>AI Model</label>
                        <select className="select-input" defaultValue="gemini-2.0-pro">
                          <option value="gemini-2.0-pro">Gemini 2.5 Pro (Recommended)</option>
                          <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest)</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Interface Theme</label>
                        <select className="select-input" defaultValue="light">
                          <option value="light">High-Fidelity Light</option>
                          <option value="dark">Deep Nebula Dark (Soon)</option>
                        </select>
                      </div>
                      <div className="input-group full">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span>Enable real-time intelligence streaming</span>
                        </label>
                      </div>
                    </div>

                    <div className="panel-footer">
                      <button className="btn-save">Update Preferences</button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="settings-panel"
                  >
                    <div className="panel-header">
                      <h2>Subscription & Billing</h2>
                      <p>Manage your plan, payment methods, and view your history.</p>
                    </div>

                    {/* Current Plan */}
                    <div className="plan-card active-plan">
                      <div className="plan-info">
                        <div className="plan-badge">CURRENT PLAN</div>
                        <h3>Nova Pro <span className="price">$19/mo</span></h3>
                        <p>Access to Gemini 2.5 Pro, unlimited PDFs, and advanced analytics.</p>
                      </div>
                      <div className="plan-status">
                        <div className="status-chip">
                          <CheckCircle2 size={14} />
                          Active
                        </div>
                        <p>Renews on June 15, 2026</p>
                      </div>
                    </div>

                    <div className="billing-sections">
                      {/* Payment Method */}
                      <div className="billing-section">
                        <h4><CreditCard size={16} /> Payment Method</h4>
                        <div className="payment-card">
                          <div className="card-brand">VISA</div>
                          <div className="card-details">
                            <span className="card-number">•••• •••• •••• 4242</span>
                            <span className="card-expiry">Expires 12/28</span>
                          </div>
                          <button className="edit-link">Edit</button>
                        </div>
                      </div>

                      {/* Billing History */}
                      <div className="billing-section">
                        <h4><History size={16} /> Billing History</h4>
                        <div className="history-table">
                          <div className="history-row header">
                            <span>Date</span>
                            <span>Amount</span>
                            <span>Status</span>
                            <span>Invoice</span>
                          </div>
                          <div className="history-row">
                            <span>May 15, 2026</span>
                            <span>$19.00</span>
                            <span className="status-success">Paid</span>
                            <button className="download-btn">PDF</button>
                          </div>
                          <div className="history-row">
                            <span>Apr 15, 2026</span>
                            <span>$19.00</span>
                            <span className="status-success">Paid</span>
                            <button className="download-btn">PDF</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        .settings-root { display: flex; min-height: 100vh; background: var(--bg-base); }
        .settings-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .content-inner { padding: 40px; max-width: 1200px; margin: 0 auto; width: 100%; }
        
        .settings-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; }
        
        .settings-nav { display: flex; flex-direction: column; gap: 8px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: none; border: none; border-radius: 10px; color: var(--text-secondary); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .nav-item:hover { background: white; color: var(--text-primary); }
        .nav-item.active { background: white; color: var(--brand-primary); box-shadow: var(--shadow-sm); }
        
        .settings-main { background: white; border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); overflow: hidden; min-height: 600px; }
        .settings-panel { padding: 40px; }
        
        .panel-header { margin-bottom: 32px; }
        .panel-header h2 { font-family: var(--font-display); font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .panel-header p { color: var(--text-muted); font-size: 14px; }
        
        .profile-hero { margin-bottom: 32px; }
        .avatar-upload { display: flex; align-items: center; gap: 20px; }
        .avatar-preview { width: 80px; height: 80px; background: var(--brand-gradient); border-radius: 20px; color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; }
        .upload-btn { padding: 8px 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
        
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .input-group.full { grid-column: span 2; }
        .input-group label { display: block; font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .input-group input, .input-group textarea, .select-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 14px; background: var(--bg-surface); }
        .select-input { appearance: none; cursor: pointer; }
        .checkbox-label { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--text-secondary); }
        .checkbox-label input { width: 18px; height: 18px; cursor: pointer; }
        .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block; }
        
        .panel-footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-subtle); }
        .btn-save { padding: 12px 24px; background: var(--brand-primary); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-save:hover { background: var(--brand-secondary); transform: translateY(-2px); }
        
        /* Billing Card */
        .plan-card { padding: 24px; border-radius: 16px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
        .active-plan { background: var(--brand-gradient); color: white; }
        .plan-badge { font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 12px; }
        .plan-info h3 { font-family: var(--font-display); font-size: 20px; font-weight: 800; margin-bottom: 4px; }
        .plan-info .price { font-size: 16px; opacity: 0.8; font-weight: 400; }
        .plan-status { text-align: right; }
        .status-chip { display: flex; align-items: center; gap: 6px; background: white; color: var(--brand-primary); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 8px; }
        
        .billing-sections { display: flex; flex-direction: column; gap: 40px; }
        .billing-section h4 { font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        
        .payment-card { display: flex; align-items: center; gap: 20px; padding: 20px; border: 1px solid var(--border-subtle); border-radius: 12px; }
        .card-brand { font-weight: 800; font-style: italic; color: #00457C; font-size: 18px; }
        .card-details { flex: 1; display: flex; flex-direction: column; }
        .card-number { font-family: var(--font-mono); font-size: 14px; font-weight: 600; }
        .card-expiry { font-size: 12px; color: var(--text-muted); }
        .edit-link { background: none; border: none; color: var(--brand-primary); font-weight: 600; font-size: 13px; cursor: pointer; }
        
        .history-table { border: 1px solid var(--border-subtle); border-radius: 12px; overflow: hidden; }
        .history-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 16px 20px; border-bottom: 1px solid var(--border-subtle); font-size: 14px; }
        .history-row.header { background: var(--bg-surface); font-weight: 800; font-size: 12px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle); }
        .history-row:last-child { border-bottom: none; }
        .status-success { color: #10b981; font-weight: 700; }
        .download-btn { background: none; border: none; color: var(--brand-primary); font-weight: 600; cursor: pointer; }

        @media (max-width: 1024px) {
          .settings-layout { grid-template-columns: 1fr; }
          .settings-nav { flex-direction: row; overflow-x: auto; padding-bottom: 8px; }
          .nav-item { white-space: nowrap; }
          .settings-grid { grid-template-columns: 1fr; }
          .input-group.full { grid-column: auto; }
          .plan-card { flex-direction: column; text-align: center; gap: 20px; }
          .plan-status { text-align: center; }
          .status-chip { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
