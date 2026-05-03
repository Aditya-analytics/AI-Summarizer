import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPanel = ({ quiz, loading, onGenerate, difficulty, setDifficulty, error }) => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (qIdx, opt) => {
    if (score !== null) return;
    setAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const handleSubmit = () => {
    if (!quiz) return;
    let newScore = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) newScore++;
    });
    setScore(newScore);
  };

  const handleReset = () => {
    setScore(null);
    setAnswers({});
    onGenerate();
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="header-title">
          <div className="title-icon"><BrainCircuit size={18} /></div>
          <h2>Learning Quiz</h2>
        </div>
        
        <div className="header-actions">
          <select 
            className="select-mini" 
            value={difficulty} 
            onChange={e => setDifficulty(e.target.value)}
            disabled={loading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button className="action-btn-primary" onClick={handleReset} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>{quiz ? 'Restart' : 'Generate Quiz'}</span>
          </button>
        </div>
      </div>

      <div className="panel-content glass">
        {loading && (
          <div className="loading-state">
            <Loader2 size={40} className="animate-spin" />
            <p>Nova is crafting personalized questions...</p>
          </div>
        )}

        {!quiz && !loading && (
          <div className="empty-state">
            <div className="empty-icon"><Trophy size={40} /></div>
            <h3>Test Your Knowledge</h3>
            <p>Challenge yourself with AI-generated questions based on this document.</p>
            <button className="btn-secondary" onClick={onGenerate}>Start Quiz</button>
          </div>
        )}

        {quiz && !loading && (
          <div className="quiz-scroll">
            {score === null && (
              <div className="quiz-progress-container">
                <div className="progress-stats">
                  <span>Question {Object.keys(answers).length} of {quiz.questions.length}</span>
                  <span>{Math.round((Object.keys(answers).length / quiz.questions.length) * 100)}% Complete</span>
                </div>
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {score !== null && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`score-banner ${score / quiz.questions.length >= 0.7 ? 'success' : 'fail'}`}
              >
                <Trophy size={24} />
                <div className="score-info">
                  <h4>Quiz Complete!</h4>
                  <p>You scored {score} out of {quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)</p>
                </div>
              </motion.div>
            )}

            <div className="questions-list">
              {quiz.questions.map((q, qi) => {
                const selected = answers[qi];
                const isSubmitted = score !== null;
                const isCorrect = selected === q.correct_answer;

                return (
                  <div key={qi} className="question-card">
                    <p className="question-text">
                      <span className="q-num">{qi + 1}.</span>
                      {q.question}
                    </p>

                    <div className="options-grid">
                      {q.options.map((opt, oi) => {
                        let state = 'default';
                        if (selected === opt) state = isSubmitted ? (isCorrect ? 'correct' : 'wrong') : 'selected';
                        if (isSubmitted && opt === q.correct_answer && selected !== opt) state = 'missed';

                        return (
                          <button
                            key={oi}
                            className={`option-btn ${state}`}
                            onClick={() => handleSelect(qi, opt)}
                            disabled={isSubmitted}
                          >
                            <span className="opt-marker">{String.fromCharCode(65 + oi)}</span>
                            {opt}
                            {state === 'correct' && <CheckCircle2 size={14} className="opt-icon" />}
                            {state === 'wrong' && <XCircle size={14} className="opt-icon" />}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="explanation">
                        <strong>Explanation:</strong> {q.explanation}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {score === null && Object.keys(answers).length > 0 && (
              <div className="quiz-footer">
                <button className="btn-primary-large" onClick={handleSubmit}>
                  Submit Answers
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .panel-container { height: 100%; display: flex; flex-direction: column; gap: 24px; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; }
        .header-title { display: flex; align-items: center; gap: 12px; }
        .title-icon { width: 36px; height: 36px; background: var(--bg-surface); color: var(--brand-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle); }
        .header-title h2 { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--text-primary); }
        
        .header-actions { display: flex; gap: 12px; }
        .select-mini { padding: 8px 12px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 13px; font-weight: 600; outline: none; }
        .action-btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--brand-gradient); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; }

        .panel-content { flex: 1; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; }
        .quiz-scroll { flex: 1; overflow-y: auto; padding: 32px; }

        .score-banner { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: var(--radius-lg); margin-bottom: 32px; border: 1px solid transparent; }
        .score-banner.success { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
        .score-banner.fail { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
        .score-info h4 { font-weight: 800; margin-bottom: 2px; }
        .score-info p { font-size: 14px; opacity: 0.8; }

        .questions-list { display: flex; flex-direction: column; gap: 40px; }
        .question-card { border-bottom: 1px solid var(--border-subtle); padding-bottom: 40px; }
        .question-text { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin-bottom: 20px; }
        .q-num { color: var(--brand-primary); margin-right: 12px; }

        .options-grid { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .option-btn { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 14px; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.2s; position: relative; width: 100%; }
        .option-btn:hover:not(:disabled) { border-color: var(--brand-primary); background: white; }
        .option-btn.selected { background: var(--brand-primary); color: white; border-color: var(--brand-primary); }
        .option-btn.correct { background: #ecfdf5; color: #047857; border-color: #10b981; }
        .option-btn.wrong { background: #fef2f2; color: #991b1b; border-color: #ef4444; }
        .option-btn.missed { border-color: #10b981; background: #ecfdf5; }

        .opt-marker { font-family: var(--font-mono); font-size: 12px; opacity: 0.5; margin-top: 2px; }
        .opt-icon { margin-left: auto; margin-top: 2px; flex-shrink: 0; }

        .explanation { margin-top: 16px; padding: 16px; background: var(--bg-surface); border-radius: 8px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; border-left: 4px solid var(--brand-primary); }

        .quiz-progress-container {
          margin-bottom: 32px;
          background: var(--bg-surface);
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-track {
          height: 8px;
          background: var(--bg-elevated);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--brand-gradient);
          border-radius: 4px;
        }

        .quiz-footer { margin-top: 40px; }
        .btn-primary-large { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; background: var(--brand-primary); color: white; border: none; border-radius: var(--radius-lg); font-weight: 700; cursor: pointer; }

        .empty-state, .loading-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; }
        
        .btn-secondary {
          padding: 12px 32px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: white;
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }

        .empty-icon { color: var(--text-muted); margin-bottom: 24px; opacity: 0.5; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default QuizPanel;
