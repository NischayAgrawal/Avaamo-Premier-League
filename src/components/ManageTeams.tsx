import { useState, useEffect } from "react";
import axios from "axios";
import { useYear } from "../context/YearContext";
import { motion } from "framer-motion";

interface Team {
  _id: string;
  name: string;
  sport: string;
  year: number;
}

function ManageTeams() {
  const { selectedYear } = useYear();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [selectedYear]);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teams?year=${selectedYear}`
      );
      setTeams(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setIsLoading(false);
    }
  };

  const handleTeamNameChange = async () => {
    if (!selectedTeamId || !newTeamName.trim()) {
      alert("Please select a team and enter a new name.");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/api/teams/${selectedTeamId}`, {
        name: newTeamName.trim(),
      });
      setNewTeamName("");
      setSelectedTeamId("");
      fetchTeams();
      alert("Team name updated successfully!");
    } catch (error) {
      console.error("Error updating team name:", error);
      alert("Failed to update team name.");
    }
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
            Manage Teams
          </h2>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full"></div>
        </div>
        <p className="text-xl text-gray-600 mt-4">{selectedYear}</p>
      </motion.header>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Update Team Name
          </h3>
          <div className="space-y-4">
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name} ({team.sport})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter new team name"
              className="w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTeamNameChange}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Update Team Name
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ManageTeams;
