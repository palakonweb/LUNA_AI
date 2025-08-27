import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { generateQuestions } from "../api/gemini";

const Quizpage = () => {
  const { user, isLoaded } = useUser();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  const fetchQuestions = async () => {
    if (!isLoaded || !user) return;

    setLoading(true);
    setError("");

    try {
      // ✅ fetch study logs
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/studyLogs/${user.id}`
      );
      const studyLogs = await res.json();
      const latestLog = studyLogs[studyLogs.length - 1];

      if (!latestLog) throw new Error("No study logs found");

      // ✅ generate quiz from Gemini
      const generated = await generateQuestions(
        latestLog.subject,
        latestLog.topic || latestLog.subject,
        "mcq"
      );

      setQuestions(generated.slice(0, 10));
      setQuizStarted(true);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load questions. Please add a study log.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option) => {
    setSelected(option);
    setShowExplanation(true);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizStarted(false); // 👈 back to start screen
    setQuestions([]);
  };

  if (!isLoaded) return <p className="text-center text-white">Loading user...</p>;
  if (!user) return <p className="text-center text-white">Please sign in first</p>;

  return (
    <div className="min-h-screen bg-[#011C40] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full max-w-lg border border-[#54ACBF]/30">
        {!quizStarted ? (
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#011C40] mb-4">Ready to Start?</h2>
            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="px-6 py-3 bg-[#011C40] text-white font-bold rounded-xl shadow-md hover:bg-[#022859] transition disabled:opacity-50"
            >
              {loading ? "✨ Luna is preparing..." : "Start Quiz"}
            </button>
            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!quizFinished && currentQuestion ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-[#011C40]">
                  Question {currentIndex + 1} of {questions.length}
                </h3>

                <p className="mb-4 text-[#011C40] font-medium">{currentQuestion.question}</p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={selected !== null}
                      className={`w-full py-2 px-4 rounded-lg text-white font-medium transition 
                        ${
                          selected === option
                            ? option === currentQuestion.answer
                              ? "bg-green-600"
                              : "bg-red-600"
                            : "bg-[#011C40] hover:bg-[#022859]"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showExplanation && currentQuestion.explanation && (
                  <p className="mt-4 p-3 rounded-lg bg-[#54ACBF]/20 text-[#011C40]">
                    {currentQuestion.explanation}
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  {showExplanation && (
                    <button
                      onClick={handleNext}
                      className="px-5 py-2 bg-[#011C40] text-white rounded-lg hover:bg-[#022859] transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              quizFinished && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-[#011C40] mb-4">Quiz Finished!</h2>
                  <p className="text-lg text-[#011C40] font-medium">
                    Your Score: {score} / {questions.length}
                  </p>
                  <button
                    onClick={handleRestart}
                    className="mt-6 px-5 py-2 bg-[#011C40] text-white rounded-lg hover:bg-[#022859] transition"
                  >
                    Restart Quiz
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Quizpage;
