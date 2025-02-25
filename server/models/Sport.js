import mongoose from "mongoose";

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Cricket", "Football"
  year: { type: Number, required: true }, // Example: year introduced
});

export default mongoose.model("Sport", sportSchema);
