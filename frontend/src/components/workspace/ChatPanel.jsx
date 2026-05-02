import React, { useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  Bot, 
  Trash2, 
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = ({ 
  messages, 
  input, 
  setInput, 
  onSend, 
  loading 
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestions = [
    "What are the key takeaways?",
    "Summarize the methodology used.",
    "Are there any conflicting views?",
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-title">
          <div className="title-icon"><Bot size={18} /></div>
          <h2>Contextual AI Chat</h2>
        </div>
        <button className="icon-btn-text" title="Clear Chat">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="chat-messages glass">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon"><Sparkles size={32} /></div>
            <h3>How can I help with this document?</h3>
            <p>I've analyzed the content and can answer specific questions, explain complex terms, or find details for you.</p>
            
            <div className="suggestions">
              {suggestions.map(s => (
                <button key={s} className="suggestion-btn" onClick={() => setInput(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="messages-list">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-row ${msg.role}`}
            >
              <div className="message-bubble">
                {msg.content}
                {msg.role === 'ai' && msg.content === '' && loading && (
                  <span className="typing-dot">.</span>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="message-row ai loading">
              <div className="message-bubble">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea 
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
            rows={1}
          />
          <button 
            className={`send-btn ${input.trim() ? 'active' : ''}`}
            onClick={onSend}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="input-hint">Press Enter to send. Shift+Enter for new line.</p>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          width: 36px;
          height: 36px;
          background: var(--bg-surface);
          color: var(--brand-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-subtle);
        }

        .header-title h2 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .icon-btn-text {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .icon-btn-text:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .chat-messages {
          flex: 1;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .message-row.user { justify-content: flex-end; }
        .message-row.ai { justify-content: flex-start; }

        .message-bubble {
          max-width: 80%;
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .user .message-bubble {
          background: var(--brand-primary);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px var(--brand-glow);
        }

        .ai .message-bubble {
          background: var(--bg-surface);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .ai.loading .message-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .chat-welcome {
          margin: auto;
          text-align: center;
          max-width: 400px;
          padding: 40px 20px;
        }

        .welcome-icon {
          color: var(--brand-primary);
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .chat-welcome h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .chat-welcome p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .suggestions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .suggestion-btn {
          padding: 12px 16px;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          background: var(--bg-surface);
        }

        .chat-input-area {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 8px 12px;
          transition: all 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: var(--brand-primary);
          background: white;
          box-shadow: 0 0 0 4px var(--brand-glow);
        }

        textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          padding: 8px 0;
          font-family: var(--font-body);
          font-size: 14px;
          resize: none;
          max-height: 120px;
          color: var(--text-primary);
        }

        .send-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--border-subtle);
          color: var(--text-muted);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-btn.active {
          background: var(--brand-primary);
          color: white;
        }

        .input-hint {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatPanel;
