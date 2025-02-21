import express from "express";
import Gallery from "../models/Gallery.js";

const router = express.Router();

// Get photos by sport
router.get("/", async (req, res) => {
  try {
    const { sport, year } = req.query;
    const photos = await Gallery.find({ sport, year });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new photo
router.post("/", async (req, res) => {
  try {
    const photo = new Gallery(req.body);
    const newPhoto = await photo.save();
    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update photo
/*
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Gallery.findByIdAndUpdate(id, req.body, { new: true });
    res.json(photo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
*/

// Delete photo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndDelete(id);
    res.json({ message: "Photo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
