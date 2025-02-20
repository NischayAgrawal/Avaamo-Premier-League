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
});

export default mongoose.model("Team", teamSchema);
