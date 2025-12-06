"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/lib/gemini";

interface QuizProps {
  questions: QuizQuestion[];
  onClose: () => void;
  cellType: string;
}

export default function Quiz({ questions, onClose, cellType }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isQuizComplete = answeredQuestions.every((answered) => answered);

  const handleAnswer = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Kuis Sel {cellType}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Pertanyaan {currentQuestion + 1} dari {questions.length}
              </span>
              <span>
                Skor: {score}/{questions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  let buttonClass =
                    "bg-gray-800 hover:bg-gray-700 border-gray-700";

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass = "bg-green-600/20 border-green-500";
                    } else if (isSelected && !isCorrect) {
                      buttonClass = "bg-red-600/20 border-red-500";
                    }
                  } else if (isSelected) {
                    buttonClass = "bg-blue-600/30 border-blue-500";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={answeredQuestions[currentQuestion]}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${buttonClass} ${
                        answeredQuestions[currentQuestion]
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-white flex-1">{option}</span>
                        {showResult && isCorrect && (
                          <span className="text-green-500">✓</span>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <span className="text-red-500">✗</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
                  >
                    <h4 className="text-blue-400 font-semibold mb-2">
                      Penjelasan:
                    </h4>
                    <p className="text-gray-300">{question.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                disabled={!answeredQuestions[currentQuestion]}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ulangi Kuis
              </button>
            )}
          </div>

          {/* Final Score */}
          {isQuizComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-white/10 rounded-lg text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                Kuis Selesai!
              </h3>
              <p className="text-4xl font-bold text-green-400 mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-gray-300">
                {score === questions.length
                  ? "Sempurna! 🎉"
                  : score >= questions.length * 0.7
                  ? "Bagus! 👏"
                  : "Tetap semangat! 💪"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
