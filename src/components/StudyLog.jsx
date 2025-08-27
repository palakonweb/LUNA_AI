import React, { useState, useEffect } from "react";

function StudyLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studyLogs")) || [];
    setLogs(stored);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">📒 Study Log</h2>
      <ul className="mt-2">
        {logs.map((log, i) => (
          <li key={i} className="border p-2 rounded mb-2">
            <b>{log.subject}</b> – {log.topic} ({log.timeSpent})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudyLog;
