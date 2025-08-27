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
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState([]);

  if (!isLoaded) return <p>Loading user info...</p>;
  if (!user) return <p>Please sign in to start quiz</p>;

  const startQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/studyLogs/${user.id}`);
      const studyLogs = await res.json();
      const latestLog = studyLogs[studyLogs.length - 1];

      if (!latestLog) throw new Error("No study log found.");

      const generatedQuestions = await generateQuestions(
        latestLog.subject,
        latestLog.topic || latestLog.subject,
        "mcq"
      );

     
      setQuestions(generatedQuestions.slice(0, 10));
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
    let isCorrect = selectedAnswer === questions[currentIndex].answer;
    if (isCorrect) setScore((prev) => prev + 1);

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentIndex].question,
        selected: selectedAnswer,
        correct: questions[currentIndex].answer,
        isCorrect,
      },
    ];
    setAnswers(updatedAnswers);

    setSelectedAnswer("");

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
        {!questions.length ? (
          <div className="flex flex-col items-center gap-4 bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-yellow-400">Start Quiz</h2>
            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
            >
              Start 10 MCQ Quiz
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        ) : loading ? (
          <p className="text-yellow-400 text-center mt-10">Luna is generatingquestions...</p>
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

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
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
