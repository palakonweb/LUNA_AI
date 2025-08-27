import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  timeSpent: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

export default mongoose.model("StudyLog", studyLogSchema);
