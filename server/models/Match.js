import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true, //edited
  },
  team1: {
    name: String,
    score: String,
    sets: [Number],
  },
  team2: {
    name: String,
    score: String,
    sets: [Number],
  },
  result: {
    type: String,
    required: true,
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Match", matchSchema);
