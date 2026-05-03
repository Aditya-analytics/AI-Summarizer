import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("NOVA CRITICAL UI ERROR:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-card glass">
            <div className="error-icon">
              <AlertCircle size={40} />
            </div>
            <h1>System Anomaly Detected</h1>
            <p>Nova encountered a critical UI error. Your data is safe, but the interface needs a quick recalibration.</p>
            
            <div className="error-actions">
              <button className="btn-reset" onClick={handleReset}>
                <RefreshCw size={18} />
                <span>Recalibrate Interface</span>
              </button>
              <button className="btn-home" onClick={() => window.location.href = '/'}>
                <Home size={18} />
                <span>Return Home</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <pre className="error-stack">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>

          <style jsx>{`
            .error-boundary-screen {
              height: 100vh;
              width: 100vw;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8fafc;
              padding: 20px;
            }
            .error-card {
              max-width: 500px;
              width: 100%;
              padding: 48px;
              background: white;
              border: 1px solid #fee2e2;
              border-radius: 32px;
              text-align: center;
              box-shadow: 0 20px 50px rgba(0,0,0,0.05);
            }
            .error-icon {
              width: 80px;
              height: 80px;
              background: #fef2f2;
              color: #ef4444;
              border-radius: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px;
            }
            h1 { font-family: var(--font-display); font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 12px; }
            p { color: #64748b; line-height: 1.6; margin-bottom: 32px; font-size: 15px; }
            .error-actions { display: flex; flex-direction: column; gap: 12px; }
            .btn-reset, .btn-home {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 14px;
              border-radius: 14px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-reset { background: var(--brand-primary); color: white; border: none; }
            .btn-home { background: transparent; color: #64748b; border: 1px solid #e2e8f0; }
            .btn-reset:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,107,74,0.2); }
            .error-stack { margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 12px; font-family: monospace; font-size: 11px; color: #ef4444; text-align: left; overflow-x: auto; }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
