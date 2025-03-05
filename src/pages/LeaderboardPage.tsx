// pages/LeaderboardPage.tsx
import React from "react";
import AggregatedLeaderboard from "../components/AggregatedLeaderboard";
import { useYear } from "../context/YearContext";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaderboardPage: React.FC = () => {
  const { selectedYear } = useYear();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-200 to-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center mb-8 bg-gradient-to-r from-yellow-100 to-yellow-200 px-8 py-4 rounded-full shadow-lg">
            <Trophy className="w-10 h-10 text-yellow-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 tracking-wide">
              Overall Leaderboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View the complete rankings across all sports for {selectedYear}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
          >
            Back to Home
          </button>
        </div>

        {/* Leaderboard */}
        {/* {selectedYear && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <AggregatedLeaderboard year={selectedYear} />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default LeaderboardPage;
