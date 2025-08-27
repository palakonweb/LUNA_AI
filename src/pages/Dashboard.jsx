import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState([]);
  const [subject, setSubject] = useState("");
  const [timeSpent, setTimeSpent] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch logs
  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`${API_URL}/api/studyLogs/${user.id}`)
      .then((res) => res.json())
      .then(setLogs)
      .catch((err) => console.error("Error fetching logs:", err));
  }, [isLoaded, user, API_URL]);

  const addLog = async (e) => {
    e.preventDefault();
    if (!subject || !timeSpent) return;

    const today = new Date().toISOString();

    try {
      await fetch(`${API_URL}/api/studyLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subject,
          timeSpent,
          date: today,
        }),
      });

      const res = await fetch(`${API_URL}/api/studyLogs/${user.id}`);
      setLogs(await res.json());

      setSubject("");
      setTimeSpent("");
    } catch (err) {
      console.error("Error adding log:", err);
    }
  };

  if (!isLoaded) return <p>Loading...</p>;
  if (!user) return <p>Please sign in</p>;

  const chartData = logs.map((log) => ({
    subject: log.subject,
    hours: log.timeSpent,
  }));

  const getBarColor = (hours) => {
    if (hours >= 5) return "#011C40"; // darkest blue
    if (hours >= 3) return "#023859"; // mid blue
    return "#26658C"; // lighter Luna shade
  };

  return (
    <div className="min-h-screen p-6 relative text-[#011C40] bg-gradient-to-b from-[#A7EBF2] to-[#011C40]">
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#011C40]">
          Dashboard
        </h2>

        {/* Add Study Log Form */}
        <form
          onSubmit={addLog}
          className="bg-white/20 backdrop-blur-md border border-[#54ACBF] p-4 rounded-xl mb-4 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-white/30 border border-[#54ACBF] text-[#011C40] placeholder-[#023859] w-full"
          />
          <input
            type="number"
            placeholder="Hours"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
            min="0" 
            className="flex-1 px-3 py-2 rounded bg-white/30 border border-[#54ACBF] text-[#011C40] placeholder-[#023859] w-full"
          />

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#011C40] text-white px-4 py-2 rounded-xl font-semibold transition-transform hover:scale-105 hover:bg-[#023859]"
          >
            Add
          </button>
        </form>

        {/* Logs List */}
        <div className="bg-white/20 backdrop-blur-md border border-[#54ACBF] p-4 rounded-xl mb-6 max-h-64 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3 text-[#011C40]">
            Your Study Logs
          </h3>
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log._id}
                className="p-2 border-b border-[#54ACBF]/50 flex justify-between text-sm sm:text-base items-center text-[#011C40]"
              >
                <span>{log.subject}</span>
                <span>{log.timeSpent} hrs</span>
                <span className="text-xs sm:text-sm">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[#023859] text-center text-sm">
              No study logs added yet.
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white/20 backdrop-blur-md border border-[#54ACBF] p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3 text-[#011C40] text-center">
            Study Hours Chart
          </h3>
          {chartData.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="subject" stroke="#011C40" />
                  <YAxis stroke="#011C40" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#A7EBF2",
                      borderColor: "#011C40",
                    }}
                    itemStyle={{ color: "#011C40" }}
                    labelStyle={{ color: "#011C40" }}
                  />
                  <Bar dataKey="hours">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.hours)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-[#023859] text-center text-sm">
              No study logs to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
