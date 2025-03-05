import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/avaamo-premier-league",
      mongoOptions
    );
    console.log("Connected to MongoDB");

    // Initialize teams after successful connection
    await initializeTeams();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Routes
import yearsRouter from "./routes/years.js";
import teamsRouter from "./routes/teams.js";
import matchesRouter from "./routes/matches.js";
import rulesRouter from "./routes/rules.js";
import galleryRouter from "./routes/gallery.js";
import sportsRouter from "./routes/sports.js";

app.use("/api/sports", sportsRouter);
app.use("/api/years", yearsRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/gallery", galleryRouter);

// Initialize default teams if they don't exist
import Team from "./models/Team.js";

const initializeTeams = async () => {
  const sports = ["cricket", "football", "basketball", "volleyball"];
  const teams = [
    "Trouble Makers",
    "Top Guns",
    "Thunder Strikers",
    "Slayers Squad",
  ];

  try {
    for (const sport of sports) {
      const existingTeams = await Team.find({ sport });
      if (existingTeams.length === 0) {
        const teamPromises = teams.map((team, i) =>
          Team.create({
            name: team,
            sport,
            year: new Date().getFullYear(),
            rank: i + 1,
          })
        );
        await Promise.all(teamPromises);
        console.log(`Initialized teams for ${sport}`);
      }
    }
  } catch (error) {
    console.error("Error initializing teams:", error);
  }
};

// Start server and connect to MongoDB
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});
