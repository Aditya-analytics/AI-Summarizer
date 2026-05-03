import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import { User, Camera, Mail, Briefcase, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="profile-root">
      <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="profile-content">
        <TopHeader 
          title="My Profile" 
          onBack={() => navigate('/dashboard')}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="content-inner">
          <div className="profile-container glass">
            <div className="profile-banner" />
            
            <div className="profile-header-box">
              <div className="avatar-wrapper">
                <div className="avatar-main">R</div>
                <button className="edit-avatar">
                  <Camera size={16} />
                </button>
              </div>
              <div className="header-text">
                <h1>Researcher</h1>
                <p>Advanced Intelligence Analyst</p>
              </div>
              <button className="btn-edit-profile">Edit Profile</button>
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <h3>About Me</h3>
                <p className="bio-text">
                  AI Researcher and Intelligence Analyst focused on synthesizing complex data into high-fidelity insights. 
                  Passionate about bridging the gap between raw information and actionable knowledge using state-of-the-art 
                  language models.
                </p>
              </div>

              <div className="profile-card info-card">
                <h3>Contact Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <Mail size={16} />
                    <span>demo@gmail.com</span>
                  </div>
                  <div className="info-item">
                    <Briefcase size={16} />
                    <span>Intelligence Research</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>Digital Workspace</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .profile-root { display: flex; min-height: 100vh; background: var(--bg-base); }
        .profile-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        
        .content-inner { padding: 40px; max-width: 1000px; margin: 0 auto; width: 100%; }
        
        .profile-container { background: white; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-subtle); }
        .profile-banner { height: 160px; background: var(--brand-gradient); opacity: 0.1; }
        
        .profile-header-box { padding: 0 40px 40px; margin-top: -60px; display: flex; align-items: flex-end; gap: 24px; position: relative; border-bottom: 1px solid var(--border-subtle); }
        .avatar-wrapper { position: relative; }
        .avatar-main { width: 120px; height: 120px; background: var(--brand-gradient); border-radius: 30px; border: 4px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: 800; box-shadow: var(--shadow-md); }
        .edit-avatar { position: absolute; bottom: -8px; right: -8px; width: 36px; height: 36px; background: white; border: 1px solid var(--border-subtle); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-primary); cursor: pointer; box-shadow: var(--shadow-sm); }
        
        .header-text { flex: 1; margin-bottom: 8px; }
        .header-text h1 { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 4px; }
        .header-text p { color: var(--text-muted); font-weight: 600; }
        
        .btn-edit-profile { margin-bottom: 12px; padding: 10px 20px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-edit-profile:hover { background: white; border-color: var(--brand-primary); color: var(--brand-primary); }

        .profile-grid { padding: 40px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
        .profile-card h3 { font-family: var(--font-display); font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 20px; }
        .bio-text { font-size: 15px; line-height: 1.6; color: var(--text-secondary); }
        
        .info-list { display: flex; flex-direction: column; gap: 16px; }
        .info-item { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); font-size: 14px; font-weight: 600; }
        .info-item :global(svg) { color: var(--brand-primary); }

        @media (max-width: 768px) {
          .profile-header-box { flex-direction: column; align-items: center; text-align: center; margin-top: -60px; }
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
