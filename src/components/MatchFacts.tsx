import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Trophy,
  Calendar,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";
import MatchDisplay from "./MatchDisplay";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  _id: string;
  team1: {
    name: string;
    score: string;
    sets?: number[];
  };
  team2: {
    name: string;
    score: string;
    sets?: number[];
  };
  result: string;
  date: string;
  year: number;
}

function MatchFacts() {
  const { sportName } = useParams();
  const { selectedYear } = useYear();
  const [matches, setMatches] = useState<Match[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedMatch, setEditedMatch] = useState({
    team1: { name: "", score: "", sets: [0, 0, 0] },
    team2: { name: "", score: "", sets: [0, 0, 0] },
    result: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1: { name: "", score: "", sets: [0, 0, 0] },
    team2: { name: "", score: "", sets: [0, 0, 0] },
    result: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [sportName, selectedYear]);

  // Calculate result based on sport type
  const calculateResult = (matchData: typeof newMatch): string => {
    // For sports with a final numeric score (football, basketball, cricket)
    if (["football", "basketball", "cricket"].includes(sportName || "")) {
      if (sportName === "cricket") {
        const parseScore = (score: string) => {
          const [runs, wickets] = score.split("/").map(Number);
          return { runs, wickets };
        };

        const team1Score = parseScore(matchData.team1.score);
        const team2Score = parseScore(matchData.team2.score);

        // If runs are invalid or missing
        if (isNaN(team1Score.runs) || isNaN(team2Score.runs))
          return "Invalid Scores";

        // Compare runs first, then wickets if runs are equal
        if (team1Score.runs > team2Score.runs) {
          return `${matchData.team1.name}`;
        } else if (team1Score.runs < team2Score.runs) {
          return `${matchData.team2.name}`;
        } else {
          // Compare wickets if runs are equal (fewer wickets is better)
          if (team1Score.wickets > team2Score.wickets) {
            return `${matchData.team2.name}`;
          } else if (team1Score.wickets < team2Score.wickets) {
            return `${matchData.team1.name}`;
          } else {
            return "Draw"; // Runs and wickets are equal
          }
        }
      } else {
        const team1Score = parseInt(matchData.team1.score, 10);
        const team2Score = parseInt(matchData.team2.score, 10);
        if (isNaN(team1Score) || isNaN(team2Score)) return "Invalid Scores";
        return team1Score > team2Score
          ? `${matchData.team1.name}`
          : team1Score < team2Score
          ? `${matchData.team2.name}`
          : "Draw";
      }
    }
    // For sports decided by sets (badminton, table tennis, volleyball, throwball)
    else if (
      ["badminton", "table-tennis", "volleyball", "throwball"].includes(
        sportName || ""
      )
    ) {
      const team1SetWins =
        matchData.team1.sets?.filter(
          (score, idx) =>
            score > (matchData.team2.sets ? matchData.team2.sets[idx] : 0)
        ).length || 0;
      const team2SetWins =
        matchData.team2.sets?.filter(
          (score, idx) =>
            score > (matchData.team1.sets ? matchData.team1.sets[idx] : 0)
        ).length || 0;
      return team1SetWins > team2SetWins
        ? `${matchData.team1.name}`
        : team1SetWins < team2SetWins
        ? `${matchData.team2.name}`
        : "Draw";
    }
    return "No Result";
  };

  // Fetch matches from backend
  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/matches?sport=${sportName}&year=${selectedYear}`
      );
      setMatches(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setIsLoading(false);
    }
  };

  // Add a new match
  const handleAdd = async () => {
    const calculatedResult = calculateResult(newMatch);
    try {
      await axios.post("http://localhost:3000/api/matches", {
        ...newMatch,
        result: calculatedResult,
        sport: sportName,
        year: selectedYear,
      });
      setShowAddForm(false);
      setNewMatch({
        team1: { name: "", score: "", sets: [0, 0, 0] },
        team2: { name: "", score: "", sets: [0, 0, 0] },
        result: "",
      });
      fetchMatches();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  // Prepare to edit an existing match
  const handleEdit = (match: Match) => {
    setEditingId(match._id);
    setEditedMatch({
      team1: {
        name: match.team1.name,
        score: match.team1.score,
        sets: match.team1.sets || [0, 0, 0],
      },
      team2: {
        name: match.team2.name,
        score: match.team2.score,
        sets: match.team2.sets || [0, 0, 0],
      },
      result: match.result,
    });
  };

  // Update an existing match
  const handleUpdate = async () => {
    const calculatedResult = calculateResult(editedMatch);
    try {
      await axios.patch(`http://localhost:3000/api/matches/${editingId}`, {
        ...editedMatch,
        result: calculatedResult,
      });
      setEditingId(null);
      setEditedMatch({
        team1: { name: "", score: "", sets: [0, 0, 0] },
        team2: { name: "", score: "", sets: [0, 0, 0] },
        result: "",
      });
      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  // Delete a match
  const handleDelete = async (matchId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/matches/${matchId}`);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  // Format sport name for display
  const formatSportName = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <motion.header
        className="flex flex-col justify-center items-center mb-10"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative mb-2">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            Match Facts
          </h2>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full"></div>
        </div>
        <p className="text-xl text-gray-600 mt-4">
          {formatSportName(sportName)} - {selectedYear}
        </p>
      </motion.header>

      {editingId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <Edit2 className="mr-3 text-blue-500" /> Edit Match
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 Edit */}
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Team 1
              </label>
              <input
                type="text"
                value={editedMatch.team1.name}
                onChange={(e) =>
                  setEditedMatch({
                    ...editedMatch,
                    team1: { ...editedMatch.team1, name: e.target.value },
                  })
                }
                placeholder="Team 1 Name"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
              {["football", "basketball", "cricket"].includes(
                sportName || ""
              ) ? (
                <input
                  type="text"
                  value={editedMatch.team1.score}
                  onChange={(e) =>
                    setEditedMatch({
                      ...editedMatch,
                      team1: { ...editedMatch.team1, score: e.target.value },
                    })
                  }
                  placeholder="Team 1 Score"
                  className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              ) : (
                <div className="mt-3 space-y-3">
                  {editedMatch.team1.sets?.map((set, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2 text-sm font-medium text-gray-600">
                        Set {index + 1}:
                      </span>
                      <input
                        type="number"
                        value={set}
                        onChange={(e) => {
                          const updatedSets = [
                            ...(editedMatch.team1.sets || [0, 0, 0]),
                          ];
                          updatedSets[index] = parseInt(e.target.value) || 0;
                          setEditedMatch({
                            ...editedMatch,
                            team1: { ...editedMatch.team1, sets: updatedSets },
                          });
                        }}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team 2 Edit */}
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Team 2
              </label>
              <input
                type="text"
                value={editedMatch.team2.name}
                onChange={(e) =>
                  setEditedMatch({
                    ...editedMatch,
                    team2: { ...editedMatch.team2, name: e.target.value },
                  })
                }
                placeholder="Team 2 Name"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
              {["football", "basketball", "cricket"].includes(
                sportName || ""
              ) ? (
                <input
                  type="text"
                  value={editedMatch.team2.score}
                  onChange={(e) =>
                    setEditedMatch({
                      ...editedMatch,
                      team2: { ...editedMatch.team2, score: e.target.value },
                    })
                  }
                  placeholder="Team 2 Score"
                  className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              ) : (
                <div className="mt-3 space-y-3">
                  {editedMatch.team2.sets?.map((set, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2 text-sm font-medium text-gray-600">
                        Set {index + 1}:
                      </span>
                      <input
                        type="number"
                        value={set}
                        onChange={(e) => {
                          const updatedSets = [
                            ...(editedMatch.team2.sets || [0, 0, 0]),
                          ];
                          updatedSets[index] = parseInt(e.target.value) || 0;
                          setEditedMatch({
                            ...editedMatch,
                            team2: { ...editedMatch.team2, sets: updatedSets },
                          });
                        }}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex mt-6 gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Check className="mr-2" /> Save Changes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingId(null)}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <X className="mr-2" /> Cancel
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowAddForm(!showAddForm)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Plus className="mr-1" />
              <span>{showAddForm ? "Cancel" : "Add Match"}</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-10 overflow-hidden"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                    <Plus className="mr-3 text-blue-500" />
                    Add New Match
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Team 1 Section */}
                    <div className="space-y-4 p-6 bg-blue-50 rounded-xl shadow-inner">
                      <label className="block text-lg font-semibold text-gray-700">
                        Team 1 Details
                      </label>
                      <input
                        type="text"
                        value={newMatch.team1.name}
                        onChange={(e) =>
                          setNewMatch({
                            ...newMatch,
                            team1: { ...newMatch.team1, name: e.target.value },
                          })
                        }
                        placeholder="Enter Team 1 Name"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />

                      {["football", "basketball", "cricket"].includes(
                        sportName || ""
                      ) ? (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Score
                          </label>
                          <input
                            type="text"
                            value={newMatch.team1.score}
                            onChange={(e) =>
                              setNewMatch({
                                ...newMatch,
                                team1: {
                                  ...newMatch.team1,
                                  score: e.target.value,
                                },
                              })
                            }
                            placeholder="Enter Team 1 Score"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 mt-4">
                          <label className="block text-sm font-medium text-gray-600">
                            Set Scores
                          </label>
                          {newMatch.team1.sets.map((set, index) => (
                            <div key={index} className="flex items-center">
                              <span className="mr-2 text-sm font-medium text-gray-600">
                                Set {index + 1}:
                              </span>
                              <input
                                type="number"
                                value={set}
                                onChange={(e) => {
                                  const updatedSets = [...newMatch.team1.sets];
                                  updatedSets[index] =
                                    parseInt(e.target.value) || 0;
                                  setNewMatch({
                                    ...newMatch,
                                    team1: {
                                      ...newMatch.team1,
                                      sets: updatedSets,
                                    },
                                  });
                                }}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Team 2 Section */}
                    <div className="space-y-4 p-6 bg-indigo-50 rounded-xl shadow-inner">
                      <label className="block text-lg font-semibold text-gray-700">
                        Team 2 Details
                      </label>
                      <input
                        type="text"
                        value={newMatch.team2.name}
                        onChange={(e) =>
                          setNewMatch({
                            ...newMatch,
                            team2: { ...newMatch.team2, name: e.target.value },
                          })
                        }
                        placeholder="Enter Team 2 Name"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      />

                      {["football", "basketball", "cricket"].includes(
                        sportName || ""
                      ) ? (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Score
                          </label>
                          <input
                            type="text"
                            value={newMatch.team2.score}
                            onChange={(e) =>
                              setNewMatch({
                                ...newMatch,
                                team2: {
                                  ...newMatch.team2,
                                  score: e.target.value,
                                },
                              })
                            }
                            placeholder="Enter Team 2 Score"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 mt-4">
                          <label className="block text-sm font-medium text-gray-600">
                            Set Scores
                          </label>
                          {newMatch.team2.sets.map((set, index) => (
                            <div key={index} className="flex items-center">
                              <span className="mr-2 text-sm font-medium text-gray-600">
                                Set {index + 1}:
                              </span>
                              <input
                                type="number"
                                value={set}
                                onChange={(e) => {
                                  const updatedSets = [...newMatch.team2.sets];
                                  updatedSets[index] =
                                    parseInt(e.target.value) || 0;
                                  setNewMatch({
                                    ...newMatch,
                                    team2: {
                                      ...newMatch.team2,
                                      sets: updatedSets,
                                    },
                                  });
                                }}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Match Button */}
                  <div className="mt-8 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleAdd}
                    >
                      <Check className="mr-2" /> Add Match
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-12 text-center shadow-md"
            >
              <p className="text-xl text-gray-600">
                No matches found for this sport and year.
              </p>
              <p className="mt-2 text-gray-500">
                Click 'Add Match' to create your first match record.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-8">
              {matches.map((match, index) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:border-l-8 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
                      <span>{match.team1.name}</span>
                      <span className="mx-3 text-blue-500 font-bold">vs</span>
                      <span>{match.team2.name}</span>
                    </h4>

                    {match.date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex-1 p-4 text-center transform transition-transform hover:scale-105">
                        {/*<h5 className="font-semibold text-lg mb-2">
                          {match.team1.name}
                        </h5>*/}
                        <MatchDisplay
                          match={match}
                          sportName={sportName}
                          teamIndex={1}
                        />
                      </div>

                      {/*<div className="hidden md:flex items-center justify-center p-4">
                        <ArrowRight className="text-blue-500 mx-4" />
                      </div>

                      <div className="flex-1 p-4 text-center transform transition-transform hover:scale-105">
                        <h5 className="font-semibold text-lg mb-2">
                          {match.team2.name}
                        </h5>
                        <MatchDisplay
                          match={match}
                          sportName={sportName}
                          teamIndex={2}
                        />
                      </div>*/}
                    </div>

                    {/*{match.result && match.result !== "Draw" && (
                      <div className="mt-4 p-2 bg-blue-100 rounded-lg text-center">
                        <div className="flex items-center justify-center">
                          <Trophy className="mr-2 text-blue-600" />
                          <span className="font-semibold">
                            Winner: {match.result}
                          </span>
                        </div>
                      </div>
                    )}*/}

                    {match.result === "Draw" && (
                      <div className="mt-4 p-2 bg-gray-100 rounded-lg text-center">
                        <span className="font-semibold text-gray-700">
                          Match Result: Draw
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Edit and Delete buttons */}
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
                      onClick={() => handleEdit(match)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
                      onClick={() => handleDelete(match._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default MatchFacts;
