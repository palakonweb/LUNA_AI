import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../finalbg.png";

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score: initialScore, answers, userId } = location.state || {}; // pass userId via state

  const [score, setScore] = useState(initialScore || 0);
  const [suggestions, setSuggestions] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!answers) {
      navigate("/"); 
      return;
    }

    // Fetch score from backend
    async function fetchScore() {
      if (!userId) return;
      try {
        const res = await fetch(`${API_URL}/score/${userId}`);
        const data = await res.json();
        if (data.score !== undefined) setScore(data.score);
      } catch (err) {
        console.error("Error fetching score:", err);
      }
    }

    fetchScore();

    // Prepare suggestions for wrong answers
    const wrongAnswers = answers.filter((a) => !a.isCorrect);
    const newSuggestions = wrongAnswers.map((ans) => ({
      question: ans.question,
      suggestion: ans.correct,
    }));
    setSuggestions(newSuggestions);

  }, [answers, navigate, API_URL, userId]);

  if (!answers) return null;

  const total = answers.length;
  const percent = (score / total) * 100;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 text-yellow-400 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-4">
        <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">
            {percent >= 80
              ? `🎉 Congratulations! You scored ${score} / ${total}`
              : `Quiz Results`}
          </h2>

          {percent < 80 && (
            <p className="text-center text-lg">
              Your Score: <span className="font-bold">{score}</span> / {total}
            </p>
          )}

          <div className="space-y-3">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg shadow-md ${
                  ans.isCorrect ? "bg-yellow-900/40" : "bg-red-900/40"
                }`}
              >
                <p className="font-semibold">{ans.question}</p>
                <p>
                  Your Answer:{" "}
                  <span
                    className={`${
                      ans.isCorrect ? "text-green-400" : "text-red-400"
                    } font-medium`}
                  >
                    {ans.selected}
                  </span>
                </p>
                {!ans.isCorrect && (
                  <p>
                    Correct Answer:{" "}
                    <span className="text-green-400 font-medium">{ans.correct}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
              <h3 className="font-bold mb-2">Luna suggests:</h3>
              <ul className="list-disc list-inside space-y-1">
                {suggestions.map((s, idx) => (
                  <li key={idx}>{s.suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
