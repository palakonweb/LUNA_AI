import express from "express";
import StudyLog from "./models/StudyLog.js"; 

const router = express.Router();

// Add a new log
router.post("/", async (req, res) => {
  try {
    const { userId, subject, timeSpent } = req.body;

    if (!userId || !subject || !timeSpent) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const log = new StudyLog({ userId, subject, timeSpent });
    await log.save();

    res.status(201).json(log);
  } catch (err) {
    console.error("❌ Error saving study log:", err);
    res.status(500).json({ error: "Server error while saving log" });
  }
});

// Get logs by userId
router.get("/:userId", async (req, res) => {
  try {
    const logs = await StudyLog.find({ userId: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching logs" });
  }
});

export default router;
