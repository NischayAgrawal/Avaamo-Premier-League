import express from "express";
const router = express.Router();
import Sport from "../models/Sport.js";

const INITIAL_SPORTS = ["Cricket", "Football", "Basketball", "Volleyball"];

// Get all sports for a specific year
router.get("/:year", async (req, res) => {
  const { year } = req.params;
  //console.log(year);
  try {
    let sports = await Sport.find({ year: Number(year) });

    // If no sports exist for the year, seed with initial sports
    if (sports.length === 0) {
      const initialSports = INITIAL_SPORTS.map((name) => ({
        name,
        year: Number(year),
      }));
      await Sport.insertMany(initialSports);
      sports = await Sport.find({ year: Number(year) });
    }

    res.status(200).json(sports);
  } catch (error) {
    console.error("Error fetching sports:", error.message || error);
    res.status(500).json({ error: "Error fetching sports" });
  }
});

// Add a new sport for a specific year
router.post("/:year", async (req, res) => {
  const { name, year } = req.body;
  if (!name || !year) {
    return res.status(400).json({ error: "Sport name and year are required" });
  }

  try {
    const newSport = new Sport({ name, year });
    await newSport.save();
    const sports = await Sport.find({ year });
    res.status(201).json(sports); // Return updated list of sports
  } catch (error) {
    console.error("Error adding sport:", error.message || error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Sport already exists for this year" });
    } else {
      res.status(500).json({ error: "Error adding sport" });
    }
  }
});

// Delete a sport by name for a specific year
router.delete("/:year/:name", async (req, res) => {
  const { year, name } = req.params;

  try {
    await Sport.findOneAndDelete({ year: Number(year), name });
    const sports = await Sport.find({ year });
    res.status(200).json(sports); // Return updated list of sports
  } catch (error) {
    console.error("Error deleting sport:", error.message || error);
    res.status(500).json({ error: "Error deleting sport" });
  }
});

export default router;
