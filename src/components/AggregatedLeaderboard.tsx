import React, { useState, useEffect } from "react";
import axios from "axios";
import { Medal, Award, Trophy } from "lucide-react";
import { useYear } from "../context/YearContext";

interface AggregatedTeam {
  name: string;
  totalPoints: number;
  sportsParticipated: string[];
  sportCount: number;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
}

const AggregatedLeaderboard: React.FC = () => {
  const { selectedYear } = useYear();
  const [teams, setTeams] = useState<AggregatedTeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedYear) {
      fetchAggregatedLeaderboard();
    }
  }, [selectedYear]);

  const fetchAggregatedLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teams/aggregated/${selectedYear}`
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching aggregated leaderboard:", error);
      setError("Failed to load leaderboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-yellow-500"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-700"; // Bronze
      default:
        return "text-blue-500"; // Others
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAggregatedLeaderboard}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-100">
        <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Teams Data Available
        </h3>
        <p className="text-gray-500">
          Start adding teams and matches to see the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Overall Leaderboard {selectedYear}
        </h2>
        <p className="text-blue-100 text-sm">
          Teams ranked by total points across all sports
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">
                Rank
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">
                Team
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">
                Total Points
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">
                W/D/L
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.name}
                className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
              >
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    {index < 3 ? (
                      <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="text-gray-700 font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-medium text-gray-800">
                  {team.name}
                </td>
                <td className="py-4 px-4 text-blue-700 font-bold">
                  {team.totalPoints}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {team.totalWins}/{team.totalDraws}/{team.totalLosses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AggregatedLeaderboard;
