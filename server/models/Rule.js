import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Rule", ruleSchema);
