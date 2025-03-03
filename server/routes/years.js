import express from "express";
const router = express.Router();

// Get all years
router.get("/", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear];
    //const years = [currentYear, currentYear + 1];
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new year
router.post("/", async (req, res) => {
  try {
    const { year } = req.body;
    // In a real application, you would save this to the database
    res.status(201).json({ year });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
