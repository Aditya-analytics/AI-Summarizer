import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, Loader2, Lock, Shield } from 'lucide-react';
import CONFIG from '../config';


const NovaLogo = () => (
  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-lg shadow-orange-500/20">
    <Sparkles className="text-white w-5 h-5" />
  </div>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

import { useWorkspace } from '../context/WorkspaceContext';

const AuthPage = () => {
  const { login } = useWorkspace();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${CONFIG.API_BASE_URL}/authentication/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');

        await login(data.access_token, email);
        navigate('/dashboard', { replace: true });
      } else {
        const response = await fetch(`${CONFIG.API_BASE_URL}/authentication/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Signup failed');

        setIsLogin(true);
        setError('Account created! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root animate-fade-up">
      <div className="auth-bg-curve"></div>
      <div className="auth-card">
        <div className="auth-logo-wrapper" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <NovaLogo />
          <span className="logo-text" style={{ marginLeft: '8px' }}>Nova</span>
        </div>
        <h2>{isLogin ? 'Sign in to Nova' : 'Create your account'}</h2>
        {error && (
          <div style={{
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '16px',
            background: '#fef2f2',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Eye size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            </div>
          </div>
          <button className="btn-auth-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} style={{ margin: '0 auto' }} /> : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <div className="auth-links">
          <a href="#">Forgot password?</a>
          <a onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>{isLogin ? 'Create Account' : 'Already have an account?'}</a>
        </div>
      </div>
      <div className="auth-sso">
        <button className="btn-sso google"><div className="sso-icon-box"><GoogleIcon /></div> Google</button>
        <button className="btn-sso"><div className="sso-icon-box" style={{ background: '#00A4EF' }}><div style={{ width: '12px', height: '12px', background: '#fff' }}></div></div> Microsoft</button>
      </div>
      <div className="auth-trust">
        <div className="trust-item"><div className="trust-icon"><Lock size={16} /></div><div className="trust-text">End-to-End<br />Encrypted</div></div>
        <div className="trust-item"><div className="trust-icon"><Shield size={16} /></div><div className="trust-text">GDPR<br />Compliant</div></div>
      </div>
    </div>
  );
};

export default AuthPage;
