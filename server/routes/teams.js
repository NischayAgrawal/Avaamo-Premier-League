import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// Get teams by sport
router.get("/", async (req, res) => {
  try {
    const { sport, year } = req.query;
    const teams = await Team.find({ sport, year });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update team rank
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

router.post("/add-sport", async (req, res) => {
  try {
    const { sport, year } = req.body;

    // Check if teams for the sport and year already exist
    const existingTeams = await Team.find({ sport, year });
    if (existingTeams.length > 0) {
      return res
        .status(400)
        .json({ message: "Sport already exists for this year." });
    }

    // Default team names
    const defaultTeams = ["Team A", "Team B", "Team C", "Team D"];
    const teamsToInsert = defaultTeams.map((name, index) => ({
      name,
      sport,
      year,
      rank: index + 1,
    }));

    // Insert teams into the database
    await Team.insertMany(teamsToInsert);

    res.status(201).json({ message: `Sport '${sport}' added successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
