import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// Get teams by sport, sorted by total points (descending) and custom rank (ascending) as a tie-breaker
router.get("/", async (req, res) => {
  try {
    const { sport, year } = req.query;
    const teams = await Team.find({ sport, year }).sort({
      totalPoints: -1,
      rank: 1,
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update team rank (manual edit)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rank } = req.body;
    const team = await Team.findByIdAndUpdate(id, { rank }, { new: true });
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
