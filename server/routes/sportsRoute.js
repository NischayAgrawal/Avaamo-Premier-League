const express = require("express");
const router = express.Router();

const sports = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "⛹️‍♀️" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "throwball", name: "Throwball", icon: "🏀" },
];

router.get("/", (req, res) => {
  res.json(sports);
});

module.exports = router;
