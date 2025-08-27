import React, { useState } from "react";
import { generateRoadmap } from "../api/gemini";
import bgImage from "../finalbg.png";

const Roadmap = () => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("6 weeks");
  const [time, setTime] = useState("2 hours/day");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }
    setLoading(true);
    try {
      const data = await generateRoadmap(topic, duration, time);
      setRoadmap(data);
    } catch (err) {
      console.error("Error generating roadmap:", err);
      alert("Failed to generate roadmap.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen p-6 relative text-yellow-200"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
     
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
      
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter topic (e.g. React JS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-3 rounded-xl bg-white/20 border border-yellow-400 backdrop-blur-md text-yellow-200 placeholder-yellow-200 w-full"
          />
          <input
            type="text"
            placeholder="Total duration (e.g. 6 weeks)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="p-3 rounded-xl bg-white/20 border border-yellow-400 backdrop-blur-md text-yellow-200 placeholder-yellow-200 w-full"
          />
          <input
            type="text"
            placeholder="Time available (e.g. 2 hrs/day)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 rounded-xl bg-white/20 border border-yellow-400 backdrop-blur-md text-yellow-200 placeholder-yellow-200 w-full"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>


        <div className="flex flex-col gap-6">
          {roadmap.length > 0 ? (
            roadmap.map((week, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-yellow-400 bg-white/20 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold text-black">
                   {week.week}: {week.title}
                </h2>
                <p className="italic text-sm text-black">⏳ {week.duration}</p>

                <h3 className="mt-2 font-semibold text-black">Topics:</h3>
                <ul className="list-disc ml-6 text-black">
                  {week.topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>

                <h3 className="mt-2 font-semibold text-black">Subtopics:</h3>
                <ul className="list-disc ml-6 text-black">
                  {week.subtopics.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No roadmap yet. Enter details above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
