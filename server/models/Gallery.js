import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: false, //edited
  },
  imageUrl: {
    type: String,
    required: true,
  },
  caption: String,
});

export default mongoose.model("Gallery", gallerySchema);
