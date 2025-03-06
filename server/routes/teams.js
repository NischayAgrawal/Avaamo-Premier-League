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
          matchesPlayed: { $sum: "$matchesPlayed" }, // Added matchesPlayed aggregation
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
          matchesPlayed: 1, // Include matchesPlayed in the projection
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

//update team name
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Find the team
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const oldName = team.name;
    const { sport, year } = team;

    // Check for duplicate team name in the same sport and year
    const existingTeam = await Team.findOne({ name, sport, year });
    if (existingTeam && existingTeam._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: "Team name already exists for this sport and year" });
    }

    // Update team name
    team.name = name;
    await team.save();

    // Update all matches where this team appears for the same year
    await Match.updateMany(
      { year, "team1.name": oldName },
      { $set: { "team1.name": name } }
    );
    await Match.updateMany(
      { year, "team2.name": oldName },
      { $set: { "team2.name": name } }
    );

    res.json({ message: "Team name updated successfully", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
