// backend/routes/score.js
import express from "express";
import StudyLog from "../models/Studylog.js";

const router = express.Router();

// GET score for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all study logs for this user
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

export default router;
