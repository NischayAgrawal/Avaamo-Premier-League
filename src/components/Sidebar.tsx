import React from "react";
import { Trophy, Home, Settings, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-white shadow-xl p-6 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center mb-8">
        {/* <Trophy className="w-8 h-8 text-blue-600 mr-3" /> */}
        <div className="w-8 h-8 text-blue-600 mr-3"></div>
        <h2 className="text-2xl font-bold text-gray-800">Sports Hub</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="mb-8">
        <ul className="space-y-2">
          <li className="hover:bg-blue-50 rounded-lg">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center p-3 text-gray-700 hover:text-blue-600 text-left"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </button>
          </li>
          {/* <li className="hover:bg-blue-50 rounded-lg">
            <button
              onClick={() => navigate("/teams")}
              className="w-full flex items-center p-3 text-gray-700 hover:text-blue-600 text-left"
            >
              <Users className="w-5 h-5 mr-3" />
              Teams
            </button>
          </li>
          <li className="hover:bg-blue-50 rounded-lg">
            <button
              onClick={() => navigate("/schedule")}
              className="w-full flex items-center p-3 text-gray-700 hover:text-blue-600 text-left"
            >
              <Calendar className="w-5 h-5 mr-3" />
              Schedule
            </button>
          </li> */}
          <li className="hover:bg-blue-50 rounded-lg">
            <button
              onClick={() => navigate("/leaderboard")}
              className="w-full flex items-center p-3 text-gray-700 hover:text-blue-600 text-left"
            >
              <Star className="w-5 h-5 mr-3 text-yellow-500" />
              Leaderboard
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {/* <div className="mt-auto border-t pt-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
