import React, { useState } from "react";
import { generateRoadmap } from "../api/gemini";

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
    <div className="min-h-screen p-6 relative text-[#011C40] bg-gradient-to-b from-[#A7EBF2] to-[#011C40]">
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Input Section */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter topic (e.g. React JS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-3 rounded-xl bg-white/30 border border-[#54ACBF] text-[#011C40] placeholder-[#023859] w-full focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
          />
          <input
            type="text"
            placeholder="Total duration (e.g. 6 weeks)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="p-3 rounded-xl bg-white/30 border border-[#54ACBF] text-[#011C40] placeholder-[#023859] w-full focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
          />
          <input
            type="text"
            placeholder="Time available (e.g. 2 hrs/day)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 rounded-xl bg-white/30 border border-[#54ACBF] text-[#011C40] placeholder-[#023859] w-full focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#011C40] text-white font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200 hover:bg-[#023859]"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Roadmap Section */}
        <div className="flex flex-col gap-6">
          {roadmap.length > 0 ? (
            roadmap.map((week, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#54ACBF] bg-white/20 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold text-[#011C40]">
                  {week.week}: {week.title}
                </h2>
                <p className="italic text-sm text-[#023859]">⏳ {week.duration}</p>

                <h3 className="mt-2 font-semibold text-[#011C40]">Topics:</h3>
                <ul className="list-disc ml-6 text-[#023859]">
                  {week.topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>

                <h3 className="mt-2 font-semibold text-[#011C40]">Subtopics:</h3>
                <ul className="list-disc ml-6 text-[#023859]">
                  {week.subtopics.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-[#023859] text-center">
              No roadmap yet. Enter details above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
