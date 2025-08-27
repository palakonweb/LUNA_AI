import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import StudyLog from "./models/Studylog.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));

app.post("/api/studyLogs", async (req, res) => {
  try {
    const { userId, subject, timeSpent } = req.body;
    const log = new StudyLog({ userId, subject, timeSpent });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save log" });
  }
});

// ✅ Get logs by user
app.get("/api/studyLogs/:userId", async (req, res) => {
  try {
    const logs = await StudyLog.find({ userId: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.get("/api/score/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

   
    const logs = await StudyLog.find({ userId });

    if (!logs.length) {
      return res.status(404).json({ error: "No logs found for this user" });
    }

    
    const totalScore = logs.reduce((acc, log) => acc + log.timeSpent, 0);

    res.json({
      score: totalScore,
      totalLogs: logs.length,
      logs,
    });
  } catch (err) {
    console.error("❌ Error fetching score:", err);
    res.status(500).json({ error: "Server error" });
  }
});

 


app.listen(process.env.PORT || 5000, () =>
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
);
