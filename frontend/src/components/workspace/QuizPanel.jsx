import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QuizPanel = ({ quiz, loading, onGenerate, difficulty, setDifficulty, error }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 to n-1, then 'results'
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (opt) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [currentStep]: opt }));
    
    // Auto-advance after a short delay for better flow
    if (currentStep < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
    }
  };

  const handleFinish = () => {
    let finalScore = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) finalScore++;
    });
    setScore(finalScore);
    setShowResults(true);

    // Celebration!
    if (finalScore / quiz.questions.length >= 0.7) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#F59E0B', '#3b82f6']
      });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    onGenerate();
  };

  const isLastQuestion = quiz && currentStep === quiz.questions.length - 1;
  const progress = quiz ? ((Object.keys(answers).length) / quiz.questions.length) * 100 : 0;

  return (
    <div className="quiz-panel-v4">
      <div className="panel-header">
        <div className="header-title">
          <div className="title-icon"><BrainCircuit size={18} /></div>
          <div>
            <h2>Learning Lab</h2>
            <p className="header-sub">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode</p>
          </div>
        </div>
        
        <div className="header-actions">
          {!showResults && (
            <select 
              className="select-mini" 
              value={difficulty} 
              onChange={e => setDifficulty(e.target.value)}
              disabled={loading || showResults}
            >
              <option value="easy">Beginner</option>
              <option value="medium">Intermediate</option>
              <option value="hard">Advanced</option>
            </select>
          )}
          <button className="action-btn-ghost" onClick={handleReset} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>New Quiz</span>
          </button>
        </div>
      </div>

      <div className="panel-content glass-v4">
        {loading ? (
          <div className="loading-state">
            <div className="loading-animation">
              <Sparkles size={32} className="sparkle-icon" />
              <div className="pulse-ring"></div>
            </div>
            <h3>Generating Intelligence...</h3>
            <p>Nova is analyzing your document to create a custom challenge.</p>
          </div>
        ) : !quiz ? (
          <div className="empty-state">
            <div className="empty-art">
              <Zap size={40} />
            </div>
            <div className="empty-text-group">
              <h3>Ready for a Challenge?</h3>
              <p>Master this document by testing your knowledge with AI-generated questions.</p>
            </div>
            <button className="btn-initialize-quiz" onClick={onGenerate}>
              Initialize Quiz <Sparkles size={18} />
            </button>
          </div>
        ) : showResults ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-view"
          >
            <div className={`score-ring ${score / quiz.questions.length >= 0.7 ? 'success' : 'neutral'}`}>
              <div className="ring-content">
                <span className="score-num">{score}</span>
                <span className="score-total">/ {quiz.questions.length}</span>
              </div>
            </div>

            <div className="results-header">
              <h3>{score / quiz.questions.length >= 0.8 ? 'Excellent Work!' : score / quiz.questions.length >= 0.5 ? 'Good Effort!' : 'Keep Learning!'}</h3>
              <p>You've completed the {difficulty} level assessment.</p>
            </div>

            <div className="results-list">
              {quiz.questions.map((q, i) => (
                <div key={i} className={`result-item ${answers[i] === q.correct_answer ? 'correct' : 'incorrect'}`}>
                  <div className="result-q-row">
                    {answers[i] === q.correct_answer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span>{q.question}</span>
                  </div>
                  {answers[i] !== q.correct_answer && (
                    <div className="result-correction">
                      Correct Answer: <strong>{q.correct_answer}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="btn-primary-v4 wide" onClick={handleReset}>
              Try Another Quiz <RefreshCw size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="quiz-active-view">
            <div className="quiz-top-bar">
              <div className="step-indicator">
                Question <span>{currentStep + 1}</span> of {quiz.questions.length}
              </div>
              <div className="progress-mini-track">
                <motion.div 
                  className="progress-mini-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="question-container"
              >
                <h3 className="current-question">{quiz.questions[currentStep].question}</h3>
                
                <div className="options-stack">
                  {quiz.questions[currentStep].options.map((opt, i) => (
                    <button 
                      key={i}
                      className={`modern-option ${answers[currentStep] === opt ? 'selected' : ''}`}
                      onClick={() => handleSelect(opt)}
                    >
                      <div className="opt-letter">{String.fromCharCode(65 + i)}</div>
                      <div className="opt-text">{opt}</div>
                      <div className="opt-check">
                        <div className="check-dot"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="quiz-nav-footer">
              <button 
                className="btn-nav-prev" 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                <ArrowLeft size={18} /> Previous
              </button>
              
              {isLastQuestion ? (
                <button 
                  className="btn-finish" 
                  onClick={handleFinish}
                  disabled={!answers[currentStep]}
                >
                  Complete Quiz <Trophy size={18} />
                </button>
              ) : (
                <button 
                  className="btn-nav-next" 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!answers[currentStep]}
                >
                  Next <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-panel-v4 { height: 100%; display: flex; flex-direction: column; gap: 20px; }
        .panel-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .header-title { display: flex; align-items: center; gap: 12px; }
        .title-icon { width: 40px; height: 40px; background: white; color: var(--brand-primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); border: 1px solid var(--border-subtle); }
        .header-title h2 { font-family: var(--font-display); font-size: 18px; font-weight: 800; color: var(--text-primary); }
        .header-sub { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

        .header-actions { display: flex; gap: 8px; }
        .select-mini { padding: 6px 12px; background: white; border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; outline: none; }
        .action-btn-ghost { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: transparent; border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .action-btn-ghost:hover { background: white; border-color: var(--brand-primary); color: var(--brand-primary); }
        
        .btn-initialize-quiz {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 40px;
          background: var(--brand-gradient);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px rgba(255, 107, 74, 0.15);
        }

        .btn-initialize-quiz:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px rgba(255, 107, 74, 0.25);
        }

        .btn-initialize-quiz:active {
          transform: translateY(-1px);
        }

        .empty-icon { color: var(--text-muted); margin-bottom: 24px; opacity: 0.5; }

        .panel-content { flex: 1; background: white; border: 1px solid var(--border-subtle); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        
        /* Active View */
        .quiz-active-view { flex: 1; display: flex; flex-direction: column; padding: 32px; }
        .quiz-top-bar { margin-bottom: 32px; }
        .step-indicator { font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; }
        .step-indicator span { color: var(--brand-primary); }
        .progress-mini-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
        .progress-mini-fill { height: 100%; background: var(--brand-gradient); border-radius: 3px; }

        .question-container { flex: 1; }
        .current-question { font-size: 22px; font-weight: 800; color: var(--text-primary); line-height: 1.4; margin-bottom: 32px; min-height: 60px; }

        .options-stack { display: flex; flex-direction: column; gap: 12px; }
        .modern-option { display: flex; align-items: center; gap: 16px; padding: 18px 24px; background: #fafafa; border: 2px solid transparent; border-radius: 16px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-align: left; }
        .modern-option:hover { background: white; border-color: #f1f5f9; transform: translateX(4px); }
        .modern-option.selected { background: #fff7ed; border-color: var(--brand-primary); transform: translateX(8px); }
        
        .opt-letter { width: 32px; height: 32px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: var(--text-muted); box-shadow: var(--shadow-sm); }
        .selected .opt-letter { background: var(--brand-primary); color: white; }
        .opt-text { flex: 1; font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .opt-check { width: 20px; height: 20px; border: 2px solid #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .selected .opt-check { border-color: var(--brand-primary); }
        .check-dot { width: 10px; height: 10px; background: var(--brand-primary); border-radius: 50%; opacity: 0; transition: opacity 0.2s; }
        .selected .check-dot { opacity: 1; }

        .quiz-nav-footer { margin-top: auto; padding-top: 32px; display: flex; justify-content: space-between; gap: 16px; }
        .btn-nav-prev { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: transparent; border: none; font-weight: 700; color: var(--text-muted); cursor: pointer; }
        .btn-nav-prev:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-nav-next, .btn-finish { display: flex; align-items: center; gap: 10px; padding: 12px 32px; background: var(--brand-primary); color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-nav-next:disabled, .btn-finish:disabled { opacity: 0.5; transform: none; }
        .btn-nav-next:hover:not(:disabled), .btn-finish:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 107, 74, 0.2); }
        .btn-finish { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }

        /* Results View */
        .results-view { padding: 48px; display: flex; flex-direction: column; align-items: center; text-align: center; max-height: 100%; overflow-y: auto; }
        .score-ring { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; position: relative; }
        .score-ring.success { background: #ecfdf5; border: 4px solid #10b981; color: #047857; }
        .score-ring.neutral { background: #f8fafc; border: 4px solid #e2e8f0; color: var(--text-primary); }
        .ring-content { display: flex; flex-direction: column; }
        .score-num { font-size: 36px; font-weight: 900; line-height: 1; }
        .score-total { font-size: 14px; font-weight: 700; opacity: 0.6; }

        .results-header { margin-bottom: 40px; }
        .results-header h3 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .results-header p { color: var(--text-muted); }

        .results-list { width: 100%; display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
        .result-item { padding: 16px; border-radius: 12px; text-align: left; background: #fafafa; border: 1px solid #f1f5f9; }
        .result-item.correct { border-left: 4px solid #10b981; }
        .result-item.incorrect { border-left: 4px solid #ef4444; }
        .result-q-row { display: flex; gap: 12px; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .correct .result-q-row { color: #047857; }
        .incorrect .result-q-row { color: #991b1b; }
        .result-correction { font-size: 12px; margin-left: 28px; color: var(--text-muted); }
        .btn-primary-v4.wide { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; background: var(--brand-primary); color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; }

        /* States */
        .empty-state, .loading-state { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          padding: 60px 40px; 
          text-align: center; 
        }

        .empty-text-group {
          margin-bottom: 32px;
        }

        .empty-text-group h3 {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .empty-text-group p {
          font-size: 15px;
          color: var(--text-muted);
          max-width: 340px;
          line-height: 1.6;
          margin: 0 auto;
        }
        
        .empty-art { 
          width: 80px; 
          height: 80px; 
          background: #fff7ed; 
          color: var(--brand-primary); 
          border-radius: 28px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 28px; 
          transform: rotate(-5deg); 
          box-shadow: 0 8px 20px rgba(255, 107, 74, 0.1);
        }
        .btn-primary-v4 { display: flex; align-items: center; gap: 12px; padding: 14px 32px; background: var(--brand-primary); color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-primary-v4:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 107, 74, 0.2); }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default QuizPanel;
