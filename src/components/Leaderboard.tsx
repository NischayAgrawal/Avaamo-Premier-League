import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useYear } from "../context/YearContext";
import { motion } from "framer-motion";

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
  const { sportName } = useParams<{ sportName: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const { selectedYear } = useYear();

  useEffect(() => {
    fetchTeams();
  }, [sportName, selectedYear]);

  const formatSportName = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchTeams = async () => {
    if (!sportName || !selectedYear) return;
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
    <div className="container mx-auto px-4">
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
              Leaderboard
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 mt-4">
            {formatSportName(sportName)} - {selectedYear}
          </p>
        </motion.header>
        <div className="overflow-x-auto">
          {teams.length > 0 ? (
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
                      <span className="text-sm text-gray-800">
                        {team.losses}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-800">
                        {team.draws}
                      </span>
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700">
                No teams available for the selected sport and year.
              </h3>
              <p className="text-gray-500">
                Please check back later or add teams to this sport.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
