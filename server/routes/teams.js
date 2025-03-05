import express from "express";
import Team from "../models/Team.js";

const router = express.Router();
// Get aggregated leaderboard by year
router.get("/aggregated/:year", async (req, res) => {
  try {
    const { year } = req.params;
    // Aggregate team points across all sports for the specified year
    const aggregatedTeams = await Team.aggregate([
      { $match: { year: parseInt(year) } },
      {
        $group: {
          _id: "$name",
          totalPoints: { $sum: "$totalPoints" },
          sportsParticipated: { $push: "$sport" },
          sportCount: { $sum: 1 },
          totalWins: { $sum: "$wins" },
          totalDraws: { $sum: "$draws" },
          totalLosses: { $sum: "$losses" },
        },
      },
      {
        $project: {
          name: "$_id",
          totalPoints: 1,
          sportsParticipated: 1,
          sportCount: 1,
          totalWins: 1,
          totalDraws: 1,
          totalLosses: 1,
          _id: 0,
        },
      },
      { $sort: { totalPoints: -1, totalWins: -1 } },
    ]);
    res.json(aggregatedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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
