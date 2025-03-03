import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import { updateTeamStats, reverseTeamStats } from "../utils/teamStatsUtil.js";

const router = express.Router();

// Helper function to update rankings based on totalPoints
// (Sort teams by totalPoints descending, then by name ascending)
export const updateTeamRankings = async (sport, year) => {
  const teams = await Team.find({ sport, year }).sort({
    totalPoints: -1,
    name: 1,
  });
  for (let i = 0; i < teams.length; i++) {
    await Team.findByIdAndUpdate(teams[i]._id, { rank: i + 1 });
  }
};

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
  try {
    const { sport, year, team1, team2, result } = req.body;

    const match = new Match(req.body);
    const newMatch = await match.save();

    // Build update objects for both teams
    const team1Update = { $inc: { matchesPlayed: 1 } };
    const team2Update = { $inc: { matchesPlayed: 1 } };

    if (result === team1.name) {
      // Team 1 wins: add win (+2 points) for team1, loss for team2
      team1Update.$inc.wins = 1;
      team1Update.$inc.totalPoints = 2;
      team2Update.$inc.losses = 1;
    } else if (result === team2.name) {
      // Team 2 wins: add win (+2 points) for team2, loss for team1
      team1Update.$inc.losses = 1;
      team2Update.$inc.wins = 1;
      team2Update.$inc.totalPoints = 2;
    } else if (result === "Draw") {
      // Draw: add draw (+1 point) for both teams
      team1Update.$inc.draws = 1;
      team1Update.$inc.totalPoints = 1;
      team2Update.$inc.draws = 1;
      team2Update.$inc.totalPoints = 1;
    }

    // Update both teams
    await Team.updateOne({ name: team1.name, sport, year }, team1Update);
    await Team.updateOne({ name: team2.name, sport, year }, team2Update);

    // Dynamically update rankings based on updated totalPoints
    await updateTeamRankings(sport, year);

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update match
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the existing match
    const oldMatch = await Match.findById(id);
    if (!oldMatch) return res.status(404).json({ message: "Match not found" });
    // Reverse stats for the old match (including totalPoints)
    await reverseTeamStats(oldMatch);
    // Update the match with new data
    const updatedMatch = await Match.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // Update stats for the new match (including totalPoints)
    await updateTeamStats(updatedMatch, false);

    // Dynamically update rankings based on updated totalPoints
    const { sport, year } = updatedMatch;
    await updateTeamRankings(sport, year);

    res.json(updatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete match
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const { sport, year, team1, team2, result } = match;

    // Build reverse update objects for both teams
    const team1Update = { $inc: { matchesPlayed: -1 } };
    const team2Update = { $inc: { matchesPlayed: -1 } };

    if (result === team1.name) {
      // Team 1 had won: subtract win (-2 points) for team1, and subtract loss for team2
      team1Update.$inc.wins = -1;
      team1Update.$inc.totalPoints = -2;
      team2Update.$inc.losses = -1;
    } else if (result === team2.name) {
      // Team 2 had won: subtract win (-2 points) for team2, and subtract loss for team1
      team1Update.$inc.losses = -1;
      team2Update.$inc.wins = -1;
      team2Update.$inc.totalPoints = -2;
    } else if (result === "Draw") {
      // It was a draw: subtract draw (-1 point) for both teams
      team1Update.$inc.draws = -1;
      team1Update.$inc.totalPoints = -1;
      team2Update.$inc.draws = -1;
      team2Update.$inc.totalPoints = -1;
    }

    // Update both teams
    await Team.updateOne({ name: team1.name, sport, year }, team1Update);
    await Team.updateOne({ name: team2.name, sport, year }, team2Update);

    await Match.findByIdAndDelete(id);

    // Dynamically update rankings based on updated totalPoints
    await updateTeamRankings(sport, year);

    res.json({ message: "Match deleted and stats reverted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
