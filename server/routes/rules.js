import express from "express";
import Rule from "../models/Rule.js";

const router = express.Router();

// Get rules by sport
router.get("/", async (req, res) => {
  try {
    const { sport, year } = req.query;
    const rules = await Rule.find({ sport, year });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new rule
router.post("/", async (req, res) => {
  try {
    const rule = new Rule(req.body);
    const newRule = await rule.save();
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rule
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await Rule.findByIdAndUpdate(id, req.body, { new: true });
    res.json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete rule
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Rule.findByIdAndDelete(id);
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
