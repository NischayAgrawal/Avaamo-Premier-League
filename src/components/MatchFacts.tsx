import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import axios from "axios";

interface Match {
  _id: string;
  team1: {
    name: string;
    score: string;
  };
  team2: {
    name: string;
    score: string;
  };
  result: string;
  date: string;
}

function MatchFacts() {
  const { sportName } = useParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedMatch, setEditedMatch] = useState({
    team1: { name: "", score: "" },
    team2: { name: "", score: "" },
    result: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1: { name: "", score: "" },
    team2: { name: "", score: "" },
    result: "",
  });

  useEffect(() => {
    fetchMatches();
  }, [sportName]);

  const handleEdit = (match: Match) => {
    setEditingId(match._id);
    setEditedMatch({
      team1: { name: match.team1.name, score: match.team1.score },
      team2: { name: match.team2.name, score: match.team2.score },
      result: match.result,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/matches/${editingId}`,
        editedMatch
      );
      setEditingId(null);
      setEditedMatch({
        team1: { name: "", score: "" },
        team2: { name: "", score: "" },
        result: "",
      });
      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };
  const fetchMatches = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/matches?sport=${sportName}`
      );
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleAdd = async () => {
    try {
      console.log(newMatch);
      await axios.post("http://localhost:3000/api/matches", {
        ...newMatch,
        sport: sportName,
      });
      setShowAddForm(false);
      setNewMatch({
        team1: { name: "", score: "" },
        team2: { name: "", score: "" },
        result: "",
      });
      fetchMatches();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Match Facts</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Match
        </button>
      </div>

      {/* Add Match Form */}
      {showAddForm && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team 1
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Team 1 Name"
              />
              <input
                type="text"
                value={newMatch.team1.score}
                onChange={(e) =>
                  setNewMatch({
                    ...newMatch,
                    team1: { ...newMatch.team1, score: e.target.value },
                  })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Team 1 Score"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team 2
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Team 2 Name"
              />
              <input
                type="text"
                value={newMatch.team2.score}
                onChange={(e) =>
                  setNewMatch({
                    ...newMatch,
                    team2: { ...newMatch.team2, score: e.target.value },
                  })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Team 2 Score"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Result
            </label>
            <input
              type="text"
              value={newMatch.result}
              onChange={(e) =>
                setNewMatch({ ...newMatch, result: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Match Result"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Match
            </button>
          </div>
        </div>
      )}

      {/* Match List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match._id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold">{match.team1.name}</p>
                    <p className="text-gray-600">{match.team1.score}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">vs</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{match.team2.name}</p>
                    <p className="text-gray-600">{match.team2.score}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{match.result}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(match)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(match._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {editingId === match._id && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-semibold">Edit Match</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editedMatch.team1.score}
                      onChange={(e) =>
                        setEditedMatch({
                          ...editedMatch,
                          team1: {
                            ...editedMatch.team1,
                            score: e.target.value,
                          },
                        })
                      }
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editedMatch.team2.score}
                      onChange={(e) =>
                        setEditedMatch({
                          ...editedMatch,
                          team2: {
                            ...editedMatch.team2,
                            score: e.target.value,
                          },
                        })
                      }
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Result
                  </label>
                  <input
                    type="text"
                    value={editedMatch.result}
                    onChange={(e) =>
                      setEditedMatch({
                        ...editedMatch,
                        result: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchFacts;
