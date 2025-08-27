import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { generateQuestions } from "../api/gemini";
import bgImage from "../finalbg.png";

const Quiz = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(""); 
  const [answers, setAnswers] = useState([]);

  if (!isLoaded) return <p>Loading user info...</p>;
  if (!user) return <p>Please sign in to start quiz</p>;

  // Start quiz based on selected mode
  const startQuiz = async (quizMode) => {
    setMode(quizMode);
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/studyLogs/${user.id}`);
      const studyLogs = await res.json();
      const latestLog = studyLogs[studyLogs.length - 1];

      if (!latestLog) throw new Error("No study log found.");

      const generatedQuestions = await generateQuestions(
        latestLog.subject,
        latestLog.topic || latestLog.subject,
        quizMode
      );

      setQuestions(generatedQuestions);
      setCurrentIndex(0);
      setScore(0);
      setAnswers([]);
    } catch (err) {
      console.error(err);
      setError("Failed to load questions. Make sure you have study logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    let isCorrect = false;

    if (mode === "mcq") {
      isCorrect = selectedAnswer === questions[currentIndex].answer;
      if (isCorrect) setScore((prev) => prev + 1);
    } else if (mode === "theory") {
      if (writtenAnswer.trim().length > 0) {
        setScore((prev) => prev + 1);
        isCorrect = true;
      }
    }

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentIndex].question,
        selected: mode === "mcq" ? selectedAnswer : writtenAnswer,
        correct: questions[currentIndex].answer || "N/A",
        isCorrect,
      },
    ];
    setAnswers(updatedAnswers);

    setSelectedAnswer("");
    setWrittenAnswer("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/score", {
        state: { score: score + (isCorrect ? 1 : 0), answers: updatedAnswers },
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative text-yellow-400"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-xl">
        {!mode ? (
          <div className="flex flex-col items-center gap-4 bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-yellow-400">Choose Quiz Type</h2>
            <button
              onClick={() => startQuiz("mcq")}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
            >
              Start MCQ Quiz
            </button>
            <button
              onClick={() => startQuiz("theory")}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
            >
              Start Theory Quiz
            </button>
          </div>
        ) : loading ? (
          <p className="text-yellow-400 text-center mt-10">Loading questions...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-10">{error}</p>
        ) : questions.length === 0 ? (
          <p className="text-yellow-400 text-center mt-10">No questions available.</p>
        ) : (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col gap-4">
           
            <div className="w-full bg-yellow-900/20 h-2 rounded-full mb-4">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h3 className="text-2xl font-bold mb-2">
              Question {currentIndex + 1} of {questions.length}
            </h3>
            <p className="mb-4 text-lg">{questions[currentIndex].question}</p>

            {mode === "mcq" ? (
              <div className="flex flex-col gap-3 mb-4">
                {questions[currentIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(option)}
                    className={`border p-3 rounded-lg text-left transition-all
                      ${
                        selectedAnswer === option
                          ? "bg-yellow-400 text-black font-semibold shadow-lg"
                          : "bg-black/40 hover:bg-yellow-900/40"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/40 border border-yellow-400 text-yellow-200 mb-4"
                placeholder="Write your answer..."
                rows={4}
              />
            )}

            <button
              onClick={handleNext}
              disabled={mode === "mcq" ? !selectedAnswer : !writtenAnswer}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-3 rounded-xl font-bold w-full disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-105"
            >
              {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
