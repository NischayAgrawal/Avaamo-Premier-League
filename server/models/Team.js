import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  matchesPlayed: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Team", teamSchema);
