import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Edit2, Save, X } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

interface Team {
  _id: string;
  name: string;
  rank: number;
  sport: string;
  year: number;
}

function Leaderboard() {
  const { sportName } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRank, setEditedRank] = useState<number>(0);
  const { selectedYear } = useYear();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      console.log(sportName);
      const response = await axios.get(
        `http://localhost:3000/api/teams?sport=${sportName}&year=${selectedYear}`
      );
      setTeams(response.data.sort((a: Team, b: Team) => a.rank - b.rank));
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingId(team._id);
    setEditedRank(team.rank);
  };

  const handleSave = async (teamId: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/teams/${teamId}`, {
        rank: editedRank,
      });
      setEditingId(null);
      fetchTeams();
    } catch (error) {
      console.error("Error updating team rank:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === team._id ? (
                    <input
                      type="number"
                      value={editedRank}
                      onChange={(e) => setEditedRank(Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{team.rank}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{team.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === team._id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSave(team._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(team)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
