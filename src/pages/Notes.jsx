import React, { useState } from "react";
import { generateNotes } from "../api/gemini";
import ReactMarkdown from "react-markdown";
import bgImage from "../finalbg.png";

const Notes = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim() || !topic.trim()) {
      alert("Please enter both subject and topic!");
      return;
    }
    setLoading(true);
    setCopied(false);
    try {
      const data = await generateNotes(subject, topic);
      setNotes(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate notes.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen p-6 relative text-yellow-400"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Generate Notes
        </h2>

        <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl flex flex-col gap-4">
          <input
            type="text"
            placeholder="Subject (e.g. React JS)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 rounded bg-black/20 border border-yellow-400 text-yellow-200"
          />
          <input
            type="text"
            placeholder="Topic (e.g. useState Hook)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-3 rounded bg-black/20 border border-yellow-400 text-yellow-200"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-yellow-400 text-black py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Notes"}
          </button>
        </div>

        {notes && (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl flex flex-col gap-3">
            <h3 className="text-xl font-bold mb-2">📌 Notes for {topic}</h3>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-3 leading-relaxed text-yellow-200" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-6 space-y-2 text-yellow-200" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
              }}
            >
              {notes}
            </ReactMarkdown>
            <button
              onClick={handleCopy}
              className="mt-2 bg-yellow-400 text-black py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-200"
            >
              {copied ? "Copied!" : "Copy Notes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
