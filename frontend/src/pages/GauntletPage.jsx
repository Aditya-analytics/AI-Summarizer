import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Database,
  ShieldCheck,
  Key,
  ChevronRight,
  Info,
  Zap,
  Trash2,
  Lock
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';

const GAUNTLET_MODELS = {
  engine: [
    { id: 'models/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', desc: 'Blazing Fast. Optimized for cost-efficiency and high speed.' },
    { id: 'models/gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Advanced reasoning. 1M token context window for complex multimodal tasks.' },
    { id: 'models/gemini-3.1-flash-live-preview', name: 'Gemini 3.1 Live (EXP)', desc: 'Future-grade intelligence. Live preview of the next-gen architecture.' }
  ],
  embeddings: [
    { id: 'models/gemini-embedding-2-preview', name: 'Gemini Embedding 2 Preview', desc: 'Native multimodal matrix mapping text, images, and video.' }
  ]
};

const GauntletPage = () => {
  const [settings, setSettings] = useState({
    has_custom_key: false,
    engine_model: 'models/gemini-2.5-flash-lite',
    embeddings_model: 'models/gemini-embedding-2-preview',
    free_calls_remaining: 10
  });
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isNewlyCalibrated, setIsNewlyCalibrated] = useState(false);

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('nova_token');
      const res = await fetch('http://localhost:8000/gauntlet/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch gauntlet settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      if (apiKey && !apiKey.trim().startsWith('AIza')) {
        setMessage({ type: 'error', text: 'Invalid format. Infinity Stones must start with AIza.' });
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem('nova_token');
      const res = await fetch('http://localhost:8000/gauntlet/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: apiKey || null,
          engine_model: settings.engine_model,
          embeddings_model: settings.embeddings_model
        })
      });

      if (res.ok) {
        // Optimistic update for immediate feedback
        setSettings(prev => ({ ...prev, has_custom_key: true }));
        setMessage({ type: 'success', text: 'Infinity Stone integrated and models calibrated.' });
        setApiKey('');
        setShowSuccessAnimation(true);
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Calibration failed. Check your API key.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection failed. Nova hub offline.' });
    } finally {
      setIsSaving(false);
    }
  };

  const removeKey = async () => {
    if (!window.confirm('Are you sure you want to remove your custom Infinity Stone?')) return;
    try {
      const token = localStorage.getItem('nova_token');
      await fetch('http://localhost:8000/gauntlet/key', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSettings();
    } catch (err) {
      console.error('Failed to remove key', err);
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="dashboard-content">
        <TopHeader
          title="Nova Gauntlet"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="content-inner">
          <header className="gauntlet-header">
            <div className="header-info">
              <div className="page-badge">Nova Gauntlet v1.0</div>
              <h1>The Infinity Core</h1>
              <p>Customize the engine driving your research intelligence. Plug in your own API keys to unlock unlimited power.</p>
            </div>

            <div className={`power-reserve ${settings.has_custom_key ? 'unlimited' : ''}`}>
              <div className="reserve-label">{settings.has_custom_key ? 'Infinity Power Active' : 'Nova Power Reserve'}</div>
              <div className="reserve-bar">
                <motion.div
                  className="reserve-progress"
                  initial={{ width: 0 }}
                  animate={{ width: settings.has_custom_key ? '100%' : `${(settings.free_calls_remaining / 10) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="reserve-text">
                <Zap size={14} />
                <span>{settings.has_custom_key ? 'Unlimited power from custom Stone' : `${settings.free_calls_remaining} free calls remaining`}</span>
              </div>
            </div>
          </header>

          <div className="gauntlet-grid">
            {/* Central Gauntlet Visual */}
            <div className="gauntlet-visual-section">
              <div className="gauntlet-stage">
                <div className="glow-background" />

                <div className={`stone-slots ${isNewlyCalibrated ? 'calibrated-glow' : ''}`}>
                  {/* Mind Stone - API Key */}
                  <motion.div
                    className={`stone-slot mind ${settings.has_custom_key ? 'filled' : ''}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="stone-icon"><Key size={24} /></div>
                    <div className="stone-label">Mind Stone</div>
                    <div className="stone-status">{settings.has_custom_key ? 'ACTIVE' : 'EMPTY'}</div>
                  </motion.div>

                  {/* Power Stone - Engine */}
                  <motion.div className="stone-slot power filled">
                    <div className="stone-icon"><Cpu size={24} /></div>
                    <div className="stone-label">Power Stone</div>
                    <div className="stone-status">CALIBRATED</div>
                  </motion.div>

                  {/* Space Stone - Embeddings */}
                  <motion.div className="stone-slot space filled">
                    <div className="stone-icon"><Database size={24} /></div>
                    <div className="stone-label">Space Stone</div>
                    <div className="stone-status">STABLE</div>
                  </motion.div>
                </div>

                {/* Central Gauntlet Silhouette (Visual CSS) */}
                <div className="gauntlet-silhouette">
                  <div className="gauntlet-hand" />
                  <div className="energy-veins" />
                </div>
              </div>
            </div>

            {/* Configuration Forms */}
            <div className="config-section">
              <section className="config-card">
                <div className="card-header">
                  <Key className="header-icon" />
                  <div>
                    <h3>Gemini Infinity Stone</h3>
                    <p>Integrate your Google AI key to bypass Nova's system limits.</p>
                  </div>
                </div>
                
                <div className="card-body">
                  {settings.has_custom_key ? (
                    <div className="key-active-state">
                      <ShieldCheck className="success-icon" size={32} />
                      <div className="key-info">
                        <span className="key-mask">•••• •••• •••• ••••</span>
                        <span className="key-label">Stone Synchronized</span>
                      </div>
                      <button className="remove-btn" onClick={removeKey} title="Deactivate Stone">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="input-action-wrapper">
                      <input 
                        type="password" 
                        placeholder="AIza..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button 
                        onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                        className="get-key-btn"
                      >
                        Capture Key <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section className="config-card">
                <div className="card-header">
                  <Cpu className="header-icon" />
                  <div>
                    <h3>Neural Engine</h3>
                    <p>Select the intelligence engine for your analytical tasks.</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="model-selector">
                    {GAUNTLET_MODELS.engine.map(model => (
                      <div 
                        key={model.id}
                        className={`model-option ${settings.engine_model === model.id ? 'selected' : ''}`}
                        onClick={() => setSettings({...settings, engine_model: model.id})}
                      >
                        <div className="option-info">
                          <span className="model-name">{model.name}</span>
                          <span className="model-desc">{model.desc}</span>
                        </div>
                        {settings.engine_model === model.id && <Sparkles size={20} className="selected-icon" />}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="config-card">
                <div className="card-header">
                  <Database className="header-icon" />
                  <div>
                    <h3>Embedding Matrix</h3>
                    <p>The vector model used for document indexing and RAG.</p>
                  </div>
                </div>
                <div className="card-body">
                  <select 
                    className="gauntlet-select"
                    value={settings.embeddings_model}
                    onChange={(e) => setSettings({...settings, embeddings_model: e.target.value})}
                  >
                    {GAUNTLET_MODELS.embeddings.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </section>

              <div className="action-bar">
                <AnimatePresence>
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`message-box ${message.type}`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  className="save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Synchronizing...' : 'Initiate Calibration'}
                  {!isSaving && <Zap size={22} fill="currentColor" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cinematic Success Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="gauntlet-activation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="video-container">
              <video
                autoPlay
                muted={false}
                className="activation-video"
                onEnded={() => {
                  setShowSuccessAnimation(false);
                  setIsNewlyCalibrated(true);
                  setTimeout(() => setIsNewlyCalibrated(false), 3000); // Glow for 3s
                }}
              >
                <source src="/videos/gauntlet_cinematic_v2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                className="skip-btn"
                onClick={() => {
                  setShowSuccessAnimation(false);
                  setIsNewlyCalibrated(true);
                  setTimeout(() => setIsNewlyCalibrated(false), 3000);
                }}
              >
                Skip Calibration <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .gauntlet-activation-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activation-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.08); /* Cinematic zoom to hide watermark */
          filter: contrast(1.05) brightness(1.1);
        }

        .video-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
          z-index: 2;
        }

        .skip-btn {
          position: absolute;
          bottom: 40px;
          right: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-full);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .skip-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .dashboard-root {
          display: flex;
          min-height: 100vh;
          background: var(--bg-base);
        }

        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-inner {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .gauntlet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 32px;
        }

        .page-badge {
          display: inline-block;
          padding: 4px 12px;
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.1);
          color: var(--brand-primary);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .gauntlet-header h1 {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -1px;
          margin-bottom: 12px;
        }

        .gauntlet-header p {
          color: var(--text-muted);
          max-width: 500px;
          line-height: 1.6;
        }

        .power-reserve {
          width: 300px;
          background: var(--bg-elevated);
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
        }

        .power-reserve.unlimited {
          border-color: #facc15;
          box-shadow: 0 0 20px hsla(45, 93%, 47%, 0.2);
        }

        .power-reserve.unlimited .reserve-progress {
          background: linear-gradient(90deg, #facc15, #fb923c);
          box-shadow: 0 0 15px #facc15;
        }

        .power-reserve.unlimited .reserve-text {
          color: #eab308;
        }

        .reserve-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .reserve-bar {
          height: 8px;
          background: var(--bg-surface);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 12px;
        }

        .reserve-progress {
          height: 100%;
          background: var(--brand-gradient);
          box-shadow: var(--shadow-glow);
        }

        .reserve-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .gauntlet-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .gauntlet-grid { grid-template-columns: 1fr; }
          .gauntlet-header { flex-direction: column; align-items: flex-start; }
          .content-inner { padding: 24px; }
        }

        /* Stage Styling */
        .gauntlet-stage {
          position: sticky;
          top: 100px;
          height: 600px;
          background: var(--bg-elevated);
          border-radius: 32px;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .glow-background {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.15) 0%, transparent 70%);
          filter: blur(40px);
          animation: float 8s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }

        .stone-slots.calibrated-glow .stone-slot.filled {
          animation: final-pulse 0.5s ease infinite alternate;
          box-shadow: 0 0 50px hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.5);
          border-color: white;
        }

        @keyframes final-pulse {
          from { transform: scale(1.05); }
          to { transform: scale(1.1); }
        }

        .stone-slots {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-right: 150px;
        }

        .stone-slot {
          width: 160px;
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .stone-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-elevated);
          color: var(--text-muted);
          border: 1px dashed var(--border-subtle);
        }

        .stone-label { font-size: 12px; font-weight: 700; color: var(--text-secondary); }
        .stone-status { font-size: 10px; font-weight: 800; color: var(--text-muted); }

        .stone-slot.filled .stone-icon {
          background: var(--brand-gradient);
          color: white;
          border: none;
          box-shadow: var(--shadow-glow);
        }

        .stone-slot.mind.filled .stone-icon { background: linear-gradient(135deg, #facc15, #eab308); }
        .stone-slot.power.filled .stone-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .stone-slot.space.filled .stone-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }

        .stone-slot.filled .stone-status { color: var(--brand-primary); }

        .gauntlet-silhouette {
          position: absolute;
          right: 40px;
          bottom: -40px;
          width: 300px;
          height: 500px;
          background: linear-gradient(to top, var(--border-subtle), transparent);
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
          opacity: 0.3;
        }

        /* Config Card Styling */
        .config-card {
          background: var(--bg-elevated);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          padding: 32px;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .config-card:hover { transform: translateY(-4px); }

        .card-header {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          padding: 10px;
          background: var(--bg-surface);
          border-radius: 12px;
          color: var(--brand-primary);
        }

        .card-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .card-header p {
          font-size: 14px;
          color: var(--text-muted);
        }

        .input-action-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-action-wrapper input {
          width: 100%;
          padding: 16px;
          padding-right: 120px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: monospace;
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-action-wrapper input:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 2px hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.1);
          outline: none;
        }

        .get-key-btn {
          position: absolute;
          right: 8px;
          padding: 8px 16px;
          background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.1);
          border: 1px solid hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.2);
          border-radius: var(--radius-md);
          color: var(--brand-primary);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .get-key-btn:hover {
          background: var(--brand-primary);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .key-active-state {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: hsla(142, 70%, 50%, 0.05);
          border: 1px solid hsla(142, 70%, 50%, 0.2);
          border-radius: var(--radius-md);
        }

        .success-icon { color: #10b981; }

        .key-info { flex: 1; display: flex; flex-direction: column; }
        .key-mask { color: var(--text-muted); font-family: monospace; letter-spacing: 2px; }
        .key-label { font-size: 12px; font-weight: 700; color: #10b981; }

        .remove-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }

        .remove-btn:hover { color: #ef4444; }

        .model-selector {
          display: grid;
          gap: 12px;
        }

        .model-option {
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .model-option:hover { border-color: var(--brand-primary); background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.02); }
        .model-option.selected { border-color: var(--brand-primary); background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.05); }

        .option-info { display: flex; flex-direction: column; gap: 4px; }
        .model-name { font-weight: 700; color: var(--text-primary); }
        .model-desc { font-size: 12px; color: var(--text-muted); }
        .selected-icon { color: var(--brand-primary); }

        .gauntlet-select {
          width: 100%;
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-weight: 600;
          outline: none;
        }

        .action-bar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 40px;
        }

        .save-btn {
          width: 100%;
          height: 56px;
          background: var(--brand-gradient);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: var(--shadow-glow);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .save-btn:hover { transform: scale(1.02); box-shadow: 0 20px 40px hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.3); }
        .save-btn:active { transform: scale(0.98); }
        .save-btn.loading { opacity: 0.8; cursor: wait; }

        .message-box {
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 700;
          text-align: center;
        }

        .message-box.success { background: hsla(142, 70%, 50%, 0.1); color: #10b981; border: 1px solid hsla(142, 70%, 50%, 0.2); }
        .message-box.error { background: hsla(0, 100%, 50%, 0.1); color: #ef4444; border: 1px solid hsla(0, 100%, 50%, 0.2); }
      `}</style>
    </div>
  );
};

export default GauntletPage;
