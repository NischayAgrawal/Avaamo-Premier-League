import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// Get matches by sport
router.get("/", async (req, res) => {
  try {
    const { sport, year } = req.query;
    const matches = await Match.find({ sport, year });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new match
router.post("/", async (req, res) => {
  console.log("coming inside the api call");
  console.log(req.body);
  try {
    const match = new Match(req.body);

    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update match
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByIdAndUpdate(id, req.body, { new: true });
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete match
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Match.findByIdAndDelete(id);
    res.json({ message: "Match deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
