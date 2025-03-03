import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";
import MatchDisplay from "./MatchDisplay";

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
    try {
      const response = await axios.get(
        `http://localhost:3000/api/matches?sport=${sportName}&year=${selectedYear}`
      );
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
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

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-center items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Match Facts</h2>
      </header>
      {editingId ? (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Edit Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team 1 Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                editedMatch.team1.sets?.map((set, index) => (
                  <input
                    key={index}
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
                    placeholder={`Set ${index + 1} Score`}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ))
              )}
            </div>
            {/* Team 2 Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                editedMatch.team2.sets?.map((set, index) => (
                  <input
                    key={index}
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
                    placeholder={`Set ${index + 1} Score`}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ))
              )}
            </div>
          </div>
          <div className="flex mt-4 gap-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
            >
              <Check className="mr-2" /> Save Changes
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
            >
              <X className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="mr-2" />

              <span>Add Match</span>
            </button>
          </div>

          {showAddForm && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Add New Match
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team 1 Section */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Team 1 Name
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {["football", "basketball", "cricket"].includes(
                    sportName || ""
                  ) ? (
                    <input
                      type="text"
                      value={newMatch.team1.score}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          team1: { ...newMatch.team1, score: e.target.value },
                        })
                      }
                      placeholder="Enter Team 1 Score"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    newMatch.team1.sets.map((set, index) => (
                      <input
                        key={index}
                        type="number"
                        value={set}
                        onChange={(e) => {
                          const updatedSets = [...newMatch.team1.sets];
                          updatedSets[index] = parseInt(e.target.value) || 0;
                          setNewMatch({
                            ...newMatch,
                            team1: { ...newMatch.team1, sets: updatedSets },
                          });
                        }}
                        placeholder={`Set ${index + 1} Score`}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ))
                  )}
                </div>

                {/* Team 2 Section */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Team 2 Name
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {["football", "basketball", "cricket"].includes(
                    sportName || ""
                  ) ? (
                    <input
                      type="text"
                      value={newMatch.team2.score}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          team2: { ...newMatch.team2, score: e.target.value },
                        })
                      }
                      placeholder="Enter Team 2 Score"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    newMatch.team2.sets.map((set, index) => (
                      <input
                        key={index}
                        type="number"
                        value={set}
                        onChange={(e) => {
                          const updatedSets = [...newMatch.team2.sets];
                          updatedSets[index] = parseInt(e.target.value) || 0;
                          setNewMatch({
                            ...newMatch,
                            team2: { ...newMatch.team2, sets: updatedSets },
                          });
                        }}
                        placeholder={`Set ${index + 1} Score`}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Add Match Button */}
              <div className="mt-8 flex justify-center">
                <button
                  className="flex items-center px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={handleAdd}
                >
                  <Check className="mr-2" /> Add Match
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {matches.map((match) => (
              <div
                key={match._id}
                className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {match.team1.name}{" "}
                  <span className="font-bold text-blue-600">vs</span>{" "}
                  {match.team2.name}
                </h4>

                <div className="mb-6">
                  {/* Replace the conditional rendering with MatchDisplay component */}
                  <MatchDisplay match={match} sportName={sportName} />
                </div>

                {/* Edit and Delete buttons */}
                <div className="flex justify-start space-x-4">
                  <button
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    onClick={() => handleEdit(match)}
                  >
                    <Edit2 className="w-5 h-5" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDelete(match._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MatchFacts;
