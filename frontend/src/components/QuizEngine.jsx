import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, RotateCcw } from 'lucide-react';

const QuizEngine = ({ quizData, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData || quizData.length === 0) {
    return <div>No quiz data available.</div>;
  }

  const currentQuestion = quizData[currentIndex];

  const handleOptionSelect = (optionId) => {
    if (isSubmitted) return;
    setUserAnswers({ ...userAnswers, [currentIndex]: optionId });
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let calculatedScore = 0;
      quizData.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-6">
          <Sparkles className="text-pink-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-500 mb-8">You mastered {Math.round((score / quizData.length) * 100)}% of the material</p>
        
        <div className="bg-pink-50 rounded-3xl p-8 mb-8 w-full max-w-md">
          <div className="text-5xl font-bold text-pink-500 mb-2">{score}/{quizData.length}</div>
          <p className="text-pink-700 font-medium">Correct Answers</p>
        </div>

        <button 
          onClick={onRestart}
          className="btn-primary-v2 w-full max-w-md flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} /> Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-engine animate-fade-up">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="quiz-label">Question {currentIndex + 1}</div>
            <h1 className="quiz-question-text">{currentQuestion.question}</h1>
          </div>
          <div className="text-sm font-bold text-gray-400">
            {currentIndex + 1} / {quizData.length}
          </div>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="options-grid">
        {currentQuestion.options.map((opt) => {
          const isSelected = userAnswers[currentIndex] === opt.id;
          return (
            <div
              key={opt.id}
              className={`option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt.id)}
            >
              <div className="option-letter">{opt.id}</div>
              <div className="option-text">{opt.text}</div>
            </div>
          );
        })}
      </div>

      <button
        className="btn-analyze w-full mt-12"
        disabled={!userAnswers[currentIndex]}
        onClick={handleNext}
      >
        {currentIndex < quizData.length - 1 ? 'Next Question' : 'Show Results'}
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default QuizEngine;
