import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Search, Layout, BookOpen, 
  MessageSquare, Bell, Star, FileText, PlayCircle, 
  Globe, Zap, Book, GraduationCap, Microscope, 
  ListChecks, Check, Code, Home, Users, Settings, Plus
} from 'lucide-react';

const MockUI = () => (
  <div className="mock-ui-v3">
    {/* Sidebar */}
    <div className="mock-sidebar-v3">
      <div className="mock-logo-v3">
        <div className="logo-icon-sm">
          <Sparkles size={14} fill="currentColor" />
        </div>
        <span className="logo-text-sm">Nova</span>
      </div>
      
      <div className="mock-nav-v3">
        <div className="mock-nav-item"><Home size={16} /> Home</div>
        <div className="mock-nav-item active"><Layout size={16} /> Dashboard</div>
        <div className="mock-nav-item"><BookOpen size={16} /> My Library</div>
        <div className="mock-nav-item"><Users size={16} /> Community <span className="soon-badge">SOON</span></div>
        <div className="mock-nav-item"><Settings size={16} /> Settings</div>
      </div>

      <div className="mock-user-profile">
        <div className="avatar-sm">D</div>
        <div className="user-info-sm">
          <p className="user-name-sm">Demo</p>
          <p className="user-plan-sm">Pro Plan</p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="mock-main-v3">
      <div className="mock-header-v3">
        <h2 className="header-title">Overview</h2>
        <div className="header-actions-v3">
          <div className="mock-search-v3"><Search size={14} /> Search...</div>
          <div className="icon-btn-sm"><Bell size={16} /></div>
          <button className="btn-new-doc"><Plus size={16} /> New Document</button>
        </div>
      </div>

      <div className="mock-body-v3">
        <div className="dashboard-badge">INTELLIGENCE DASHBOARD</div>
        <h1 className="welcome-text">Welcome back, Researcher</h1>
        <p className="welcome-sub">Your AI Learning Workspace is synchronized and ready.</p>

        <div className="stats-grid-sm">
          <div className="stat-card-sm">
            <div className="stat-top"><span>TOTAL INSIGHTS</span><Zap size={14} className="text-orange" /></div>
            <div className="stat-value">7</div>
            <div className="stat-trend">+12% this week</div>
          </div>
          <div className="stat-card-sm">
            <div className="stat-top"><span>DOCUMENTS</span><FileText size={14} className="text-orange" /></div>
            <div className="stat-value">1</div>
            <div className="stat-trend">High-fidelity PDFs</div>
          </div>
          <div className="stat-card-sm">
            <div className="stat-top"><span>WEB & MEDIA</span><Globe size={14} className="text-orange" /></div>
            <div className="stat-value">6</div>
            <div className="stat-trend">Articles & Videos</div>
          </div>
        </div>

        <div className="recent-docs-sm">
          <div className="section-header-sm">
            <h3>Recent Documents</h3>
            <button className="btn-view-all">View All Library <ArrowRight size={12} /></button>
          </div>
          <div className="mock-table-v3">
            <div className="table-header-v3">
              <span>NAME</span><span>TYPE</span><span>UPLOADED</span><span>STATUS</span>
            </div>
            <div className="table-row-v3">
              <span className="doc-name">probability_statistics_guide.pdf</span>
              <span className="type-badge">PDF</span>
              <span>5/2/2026</span>
              <span className="status-badge">Processed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { 
        if (entry.isIntersecting) entry.target.classList.add('revealed'); 
      });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-root">
      <div className="grid-overlay"></div>
      <div className="glow glow-left"></div>
      <div className="glow glow-right"></div>

      <nav className="navbar-v2 animate-fade-up">
        <div className="nav-left">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-v2">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <span className="logo-text-v2">Nova</span>
          </div>
        </div>
        <div className="nav-center-v2">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#resources">Resources</a>
        </div>
        <div className="nav-right">
          {isLoggedIn ? (
            <button className="btn-primary-v2" onClick={() => navigate('/dashboard')}>
              Go to Dashboard <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/auth')}>Login</button>
              <button className="btn-primary-v2" onClick={() => navigate('/auth')}>Start Free Trial <ArrowRight size={14} /></button>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section-v2">
        <div className="hero-announcement animate-fade-up" style={{ animationDelay: '0.1s' }}>MEET THE NEW NOVA: AGENTS AND A BOLD REBRAND. <ArrowRight size={14} /></div>
        <h1 className="hero-heading-v2 animate-fade-up" style={{ animationDelay: '0.2s' }}>Your AI study buddy<br />that's got your back!</h1>
        <p className="hero-subheading-v2 animate-fade-up" style={{ animationDelay: '0.3s' }}>Nova is the AI platform that unifies your research, simplifies your documents, and automates your learning journey.</p>
        <div className="hero-ctas-v2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button className="btn-outline-v2" style={{ boxShadow: 'none', background: 'transparent' }} onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')}>
            {isLoggedIn ? 'Launch Workspace' : 'Schedule a Demo'} <ArrowRight size={16} />
          </button>
          <button className="btn-filled-v2" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')}>
            {isLoggedIn ? 'View My Library' : 'Start Free Trial'} <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-mockup-v2 animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="mockup-shadow-glow"></div>
          <MockUI />
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="features-header reveal">
          <span className="eyebrow-badge">KEY FEATURES</span>
          <h2 className="section-title">The smartest way to study</h2>
        </div>
        <div className="features-grid-v3">
          <div className="feature-card-v3 reveal delay-1">
            <div className="card-visual visual-upload">
              <div className="upload-stack">
                <div className="file-box f1"><FileText size={20} color="#ff7a64" /></div>
                <div className="file-box f2"><PlayCircle size={20} color="#818cf8" /></div>
                <div className="upload-center">
                  <div className="up-icon"><Globe size={20} color="#ff7a64" /></div>
                  <span>Ingest</span>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-icon"><Globe size={20} /></div>
              <h3>Everything in one place</h3>
              <p>Upload PDFs, YouTube links, and articles. Nova unifies all your sources into a single study workspace.</p>
            </div>
          </div>
          <div className="feature-card-v3 reveal delay-2">
            <div className="card-visual visual-zap">
              <div className="summary-visual">
                <div className="summary-line l1"></div>
                <div className="summary-line l2"></div>
                <div className="summary-arrow"><Zap size={24} color="#ff7a64" /></div>
                <div className="summary-short">Key takeaway: Simplified context...</div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-icon"><Zap size={20} /></div>
              <h3>Summarize in seconds</h3>
              <p>Skip the fluff. Get instant, high-retention summaries that focus on the core concepts you need to know.</p>
            </div>
          </div>
          <div className="feature-card-v3 reveal delay-3">
            <div className="card-visual visual-code">
              <div className="chat-mock-ui">
                <div className="chat-msg ai">What is RAG?</div>
                <div className="chat-msg user">Retrieval Augmented Generation...</div>
                <div className="chat-citation">Source: Research.pdf, Page 4</div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-icon"><MessageSquare size={20} /></div>
              <h3>Chat with your materials</h3>
              <p>Ask deep questions and get answers with citations directly from your own uploaded documents.</p>
            </div>
          </div>
          <div className="feature-card-v3 card-wide reveal delay-1">
            <div className="card-visual visual-models">
              <div className="modes-ui">
                <div className="modes-header">Learning Modes</div>
                <div className="modes-row">
                  <div className="mod-pill active"><Book size={14} /> Quick Read</div>
                  <div className="mod-pill"><GraduationCap size={14} /> Exam Prep</div>
                  <div className="mod-pill"><Microscope size={14} /> Deep Dive</div>
                </div>
                <div className="modes-grad"></div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-icon"><Sparkles size={20} /></div>
              <h3>Adaptive Study Modes</h3>
              <p>Nova adjusts its AI assistance based on your goals, whether you're skimming for info or cramming for a final.</p>
            </div>
          </div>
          <div className="feature-card-v3 card-wide reveal delay-2">
            <div className="card-visual visual-search">
              <div className="quiz-mock-ui">
                <div className="quiz-question">Q: Explain the primary cause of...</div>
                <div className="quiz-options">
                  <div className="opt">A) Atmospheric pressure</div>
                  <div className="opt correct">B) Gravity and orbit</div>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-icon"><ListChecks size={20} /></div>
              <h3>Automated Flashcards & Quizzes</h3>
              <p>Nova automatically detects key concepts and builds interactive quizzes to lock knowledge into your long-term memory.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="features-header reveal">
          <span className="eyebrow-badge">PRICING</span>
          <h2 className="section-title">Simple, transparent plans</h2>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card reveal delay-1">
            <h4>Starter</h4>
            <div className="price">
              <span>$0</span>
              <span>/month</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Perfect for individual students and casual learners.</p>
            <div className="pricing-features">
              <div className="feature-item"><Check size={16} /> 5 Documents / mo</div>
              <div className="feature-item"><Check size={16} /> Standard AI Summaries</div>
              <div className="feature-item"><Check size={16} /> Basic Practice Quizzes</div>
              <div className="feature-item"><Check size={16} /> Community Support</div>
            </div>
            <button className="btn-pricing" onClick={() => navigate('/auth')}>Get Started</button>
          </div>

          <div className="pricing-card featured reveal delay-2">
            <div className="card-badge">Most Popular</div>
            <h4>Pro</h4>
            <div className="price">
              <span>$19</span>
              <span>/month</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>For power users who need advanced research tools.</p>
            <div className="pricing-features">
              <div className="feature-item"><Check size={16} /> Unlimited Documents</div>
              <div className="feature-item"><Check size={16} /> Deep Dive AI Analysis</div>
              <div className="feature-item"><Check size={16} /> Interactive Study Modes</div>
              <div className="feature-item"><Check size={16} /> Priority Email Support</div>
              <div className="feature-item"><Check size={16} /> Export to PDF/Notion</div>
            </div>
            <button className="btn-pricing" onClick={() => navigate('/auth')}>Start Free Trial</button>
          </div>

          <div className="pricing-card reveal delay-3">
            <h4>Enterprise</h4>
            <div className="price">
              <span>Custom</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>For teams, labs, and educational institutions.</p>
            <div className="pricing-features">
              <div className="feature-item"><Check size={16} /> Everything in Pro</div>
              <div className="feature-item"><Check size={16} /> Team Collaboration</div>
              <div className="feature-item"><Check size={16} /> SSO & Advanced Security</div>
              <div className="feature-item"><Check size={16} /> Custom Model Training</div>
              <div className="feature-item"><Check size={16} /> Dedicated Account Manager</div>
            </div>
            <button className="btn-pricing" onClick={() => navigate('/auth')}>Contact Sales</button>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="about">
        <div className="how-content reveal">
          <span className="how-eyebrow">STEP-BY-STEP</span>
          <h2 className="how-heading">From complex data to clear insights.</h2>
          <p className="how-sub">Nova handles the heavy lifting of research and data analysis so you can focus on mastering the actual concepts.</p>
          <div className="how-steps">
            <div className="step-item reveal delay-1">
              <div className="step-icon"><FileText size={16} /></div>
              <h4>Upload & Ingest</h4>
              <p>Advanced tools to unify all your research sources instantly.</p>
            </div>
            <div className="step-item reveal delay-2">
              <div className="step-icon"><Sparkles size={16} /></div>
              <h4>Analyze & Master</h4>
              <p>Create stunning summaries and quizzes with powerful AI.</p>
            </div>
          </div>
          <button className="btn-outline-v2 reveal delay-3" onClick={() => navigate('/auth')}>Learn More <ArrowRight size={16} /></button>
        </div>
        <div className="how-visual reveal delay-2">
          <div className="walkthrough-container">
            <div className="walk-glow"></div>
            <div className="walk-grid"></div>
            <div className="walk-card">
              <div className="walk-inner">
                <div className="walk-item-ui">
                  <div className="walk-item-header"><FileText size={14} /> <span>Summary: Modern Physics.pdf</span></div>
                  <div className="walk-item-text"></div>
                  <div className="walk-item-text"></div>
                  <div className="walk-item-text short"></div>
                </div>
              </div>
              <div className="walk-footer-input">
                <div className="walk-input-bar">Ask Nova anything about this doc...</div>
                <div className="walk-btn-send"><ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section reveal">
        <div className="cta-card">
          <div className="cta-glow"></div>
          <h2>Ready to transform your research?</h2>
          <p>Join thousands of students and researchers using Nova to master their materials.</p>
          <button className="btn-filled-v2" onClick={() => navigate('/auth')}>
            Get Started for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-v2">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <span className="logo-text-v2">Nova</span>
          </div>
          <p className="footer-copy">
            © 2026 Nova. Built for learners, by <a href="https://github.com/Aditya-analytics/AI-Summarizer/tree/main" target="_blank" rel="noopener noreferrer" className="aditya-link">Aditya</a>.
          </p>
        </div>
        <div className="footer-right">
          <a href="https://github.com/Aditya-analytics/AI-Summarizer/tree/main" target="_blank" rel="noopener noreferrer" className="github-btn">
            <Code size={20} />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
