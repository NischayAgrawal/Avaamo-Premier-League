import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useYear } from "../context/YearContext";

interface Team {
  _id: string;
  name: string;
  rank: number;
  sport: string;
  year: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalPoints: number;
}

function Leaderboard() {
  const { sportName } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const { selectedYear } = useYear();

  useEffect(() => {
    fetchTeams();
  }, [sportName, selectedYear]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teams?sport=${sportName}&year=${selectedYear}`
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Team Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Matches Played
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Wins
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Losses
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Draws
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team._id}
                className={`${
                  team.rank === 1
                    ? "bg-yellow-100 border-l-4 border-yellow-500"
                    : "bg-white"
                } hover:bg-gray-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-bold ${
                      team.rank === 1 ? "text-yellow-600" : "text-gray-800"
                    }`}
                  >
                    {team.rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      team.rank === 1 ? "text-yellow-800" : "text-gray-800"
                    }`}
                  >
                    {team.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">
                    {team.matchesPlayed}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">{team.wins}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">{team.losses}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">{team.draws}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-bold ${
                      team.rank === 1
                        ? "text-yellow-800 text-lg"
                        : "text-gray-800"
                    }`}
                  >
                    {team.totalPoints}
                  </span>
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
