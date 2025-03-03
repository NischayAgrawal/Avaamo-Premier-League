import Team from "../models/Team.js";

// Reverse team stats for a match (subtract stats)
export const reverseTeamStats = async (match) => {
  const { sport, year, team1, team2, result } = match;
  const team1Update = { $inc: { matchesPlayed: -1 } };
  const team2Update = { $inc: { matchesPlayed: -1 } };

  if (result === team1.name) {
    team1Update.$inc.wins = -1;
    team1Update.$inc.totalPoints = -2;
    team2Update.$inc.losses = -1;
  } else if (result === team2.name) {
    team1Update.$inc.losses = -1;
    team2Update.$inc.wins = -1;
    team2Update.$inc.totalPoints = -2;
  } else if (result === "Draw") {
    team1Update.$inc.draws = -1;
    team1Update.$inc.totalPoints = -1;
    team2Update.$inc.draws = -1;
    team2Update.$inc.totalPoints = -1;
  }

  await Promise.all([
    Team.updateOne({ name: team1.name, sport, year }, team1Update),
    Team.updateOne({ name: team2.name, sport, year }, team2Update),
  ]);
};

// Update team stats for a match (add stats)
export const updateTeamStats = async (match, isNew = true) => {
  const { sport, year, team1, team2, result } = match;
  const team1Update = { $inc: { matchesPlayed: 1 } };
  const team2Update = { $inc: { matchesPlayed: 1 } };

  if (result === team1.name) {
    team1Update.$inc.wins = 1;
    team1Update.$inc.totalPoints = 2;
    team2Update.$inc.losses = 1;
  } else if (result === team2.name) {
    team1Update.$inc.losses = 1;
    team2Update.$inc.wins = 1;
    team2Update.$inc.totalPoints = 2;
  } else if (result === "Draw") {
    team1Update.$inc.draws = 1;
    team1Update.$inc.totalPoints = 1;
    team2Update.$inc.draws = 1;
    team2Update.$inc.totalPoints = 1;
  }

  await Promise.all([
    Team.updateOne({ name: team1.name, sport, year }, team1Update),
    Team.updateOne({ name: team2.name, sport, year }, team2Update),
  ]);
};
