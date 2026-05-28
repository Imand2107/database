import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="max-w-2xl mx-auto font-sans">
      <AnimatePresence mode="wait">
        {!quizComplete ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border-2 border-[#1A1A1A] p-6 space-y-6 rounded-none shadow-none"
          >
            {/* Header / Progress bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#E5E5E1] gap-3">
              <div>
                <span className="px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider rounded-none">
                  Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[10px] font-bold text-[#8C8C88] uppercase tracking-widest ml-4 font-mono">
                  Current Score: {score} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="w-24 bg-[#FAF9F5] border border-[#E5E5E1] h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-[#1A1A1A] h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h4 className="text-lg md:text-xl font-serif italic text-[#1A1A1A] leading-snug font-light">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Option Buttons */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const isIncorrect = isSelected && !isCorrect;

                let optionStyles = 'border-[#E5E5E1] bg-[#FAF9F5] hover:bg-white text-[#1A1A1A] hover:border-[#1A1A1A] ';
                if (isSelected && !isSubmitted) {
                  optionStyles = 'border-[#1A1A1A] bg-white text-[#1A1A1A] ring-1 ring-[#1A1A1A] ';
                } else if (isSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-600 bg-[#F5FBF7] text-emerald-950 ';
                  } else if (isIncorrect) {
                    optionStyles = 'border-red-600 bg-[#FDF5F5] text-red-950 ';
                  } else {
                    optionStyles = 'border-[#E5E5E1]/60 bg-white text-[#8C8C88] opacity-50 ';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`opt-btn-${idx}`}
                    onClick={() => handleSelect(idx)}
                    disabled={isSubmitted}
                    className={`w-full flex items-start text-left p-4 rounded-none border text-xs sm:text-sm font-normal transition-all duration-150 ${optionStyles} cursor-pointer`}
                  >
                    <span className="flex items-center justify-center w-6 h-6 border border-[#E5E5E1] bg-white text-xs mr-3 shrink-0 font-mono font-bold text-[#1A1A1A]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug pt-0.5">{option}</span>
                    
                    {isSubmitted && isCorrect && (
                      <Icons.CheckCircle2 className="w-4 h-4 text-emerald-700 ml-auto shrink-0 mt-1" />
                    )}
                    {isSubmitted && isIncorrect && (
                      <Icons.XCircle className="w-4 h-4 text-red-700 ml-auto shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions / Feedback */}
            <div className="pt-4 border-t border-[#E5E5E1] flex flex-col md:flex-row items-center gap-4">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className="w-full md:w-auto md:ml-auto px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-none transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="w-full space-y-4">
                  {/* Detailed explanation markup */}
                  <div className={`p-4 border leading-relaxed text-xs sm:text-sm rounded-none ${
                    selectedOption === currentQuestion.correctIndex 
                      ? 'bg-[#FAFDFB] text-emerald-950 border-emerald-300' 
                      : 'bg-[#FDF9F9] text-red-950 border-red-300'
                  }`}>
                    <div className="flex items-center space-x-1.5 font-bold mb-1">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <Icons.Sparkles className="w-4 h-4 text-emerald-700" />
                          <span className="font-serif italic font-light text-base">Perfect logic. Correct answer.</span>
                        </>
                      ) : (
                        <>
                          <Icons.AlertCircle className="w-4 h-4 text-red-700" />
                          <span className="font-serif italic font-light text-base">Structure error. Detail:</span>
                        </>
                      )}
                    </div>
                    <p className="font-light text-[#5F5F5B] leading-relaxed mt-2 font-sans">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                  
                  <div className="flex">
                    <button
                      onClick={handleNext}
                      className="ml-auto px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider rounded-none transition duration-150 flex items-center cursor-pointer"
                    >
                      {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}
                      <Icons.ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-[#1A1A1A] p-8 text-center space-y-6 rounded-none shadow-none"
          >
            <div className="inline-flex p-4 rounded-none border border-[#E5E5E1] bg-[#FAF9F5] text-[#1A1A1A] mx-auto">
              <Icons.Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-[#1A1A1A] font-light">Exercise Assessment Completed</h3>
              <p className="text-[#5F5F5B] text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
                You checked database schemas, tracked functional dependencies, and normalized databases safely.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 border border-[#E5E5E1] max-w-sm mx-auto rounded-none">
              <span className="text-[9px] font-mono uppercase font-bold text-[#8C8C88] tracking-widest block">Your Verified Performance</span>
              <p className="text-4xl font-light font-serif tracking-tight mt-1 text-[#1A1A1A]">
                {score} <span className="text-xl text-[#8C8C88] font-mono">/ {QUIZ_QUESTIONS.length}</span>
              </p>
              <p className="text-[10px] font-mono text-[#1A1A1A] font-bold mt-2 uppercase tracking-widest border border-[#1A1A1A] bg-white px-3 py-1 inline-block">
                {score === QUIZ_QUESTIONS.length 
                  ? '🏅 Absolute Schema Architect' 
                  : score >= 4 
                    ? '🥈 Advanced Data Modeler' 
                    : '🥉 Database Novice'}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider rounded-none transition duration-150 cursor-pointer"
            >
              Restart Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
