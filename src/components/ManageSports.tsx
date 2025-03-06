import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  PlusCircle,
  ChevronDown,
  Star,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

const ALL_SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table-Tennis",
  "Throwball",
];

function ManageSports() {
  const navigate = useNavigate();
  const { selectedYear } = useYear();
  const [sports, setSports] = useState<string[]>([]);
  const [newSport, setNewSport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeHoverSport, setActiveHoverSport] = useState<string | null>(null);

  useEffect(() => {
    if (selectedYear) {
      fetchSportsForYear();
    }
  }, [selectedYear]);

  const fetchSportsForYear = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/sports/${selectedYear}`
      );
      setSports(response.data.map((sport) => sport.name));
    } catch (error) {
      console.error("Error fetching sports:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSport = async () => {
    if (!newSport) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/sports/${selectedYear}`,
        {
          name: newSport,
          year: selectedYear,
        }
      );
      setSports(response.data.map((sport) => sport.name));
    } catch (error) {
      console.error("Error adding sport:", error.message || error);
    }
    setNewSport("");
  };

  const deleteSport = async (name: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/sports/${selectedYear}/${name}`
      );
      setSports(response.data.map((sport) => sport.name));
    } catch (error) {
      console.error("Error deleting sport:", error.message || error);
    }
  };

  const getSportIcon = (sport: string) => {
    const icons: { [key: string]: string } = {
      Cricket: "🏏",
      Football: "⚽",
      Basketball: "🏀",
      Volleyball: "🏐",
      Badminton: "🏸",
      "Table-Tennis": "🏓",
      Throwball: "🥎",
    };
    return icons[sport] || "🏆";
  };

  const getSportColor = (sport: string) => {
    const colors: {
      [key: string]: { bg: string; text: string; accent: string };
    } = {
      Cricket: {
        bg: "bg-green-50",
        text: "text-green-600",
        accent: "bg-green-600",
      },
      Football: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        accent: "bg-blue-600",
      },
      Basketball: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        accent: "bg-orange-600",
      },
      Volleyball: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        accent: "bg-yellow-600",
      },
      Badminton: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        accent: "bg-purple-600",
      },
      "Table-Tennis": {
        bg: "bg-red-50",
        text: "text-red-600",
        accent: "bg-red-600",
      },
      Throwball: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        accent: "bg-pink-600",
      },
    };
    return (
      colors[sport] || {
        bg: "bg-gray-50",
        text: "text-gray-600",
        accent: "bg-gray-600",
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        Manage Sports
      </h2>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-grow max-w-md">
          <select
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
            className="w-full pl-5 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none hover:border-blue-300 transition-all"
          >
            <option value="">Select a sport to add</option>
            {ALL_SPORTS.filter((sport) => !sports.includes(sport)).map(
              (sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              )
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        <button
          onClick={addSport}
          className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          disabled={!newSport}
        >
          <span className="flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Sport
          </span>
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : sports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports.map((sport) => {
            const colors = getSportColor(sport);
            const isHovered = activeHoverSport === sport;
            return (
              <div
                key={sport}
                onClick={() => navigate(`/sport/${sport.toLowerCase()}`)}
                onMouseEnter={() => setActiveHoverSport(sport)}
                onMouseLeave={() => setActiveHoverSport(null)}
                className={`group relative ${colors.bg} border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 cursor-pointer transform hover:-translate-y-2`}
              >
                <div
                  className={`h-2 w-full ${colors.accent} absolute top-0 left-0`}
                ></div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSport(sport);
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md"
                    aria-label="Delete sport"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-6 py-10 flex flex-col items-center text-center relative">
                  <div
                    className={`text-5xl mb-4 transform transition-transform duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    {getSportIcon(sport)}
                  </div>
                  <h3
                    className={`text-xl font-semibold ${colors.text} mb-3 group-hover:text-blue-600 transition-colors`}
                  >
                    {sport}
                  </h3>
                  <div className="mt-2 px-4 py-1.5 bg-white text-blue-700 text-sm font-medium rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
          <div className="inline-block text-5xl mb-4 p-6 bg-gray-100 rounded-full">
            🏆
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Sports Added Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You can add sports using the dropdown above or reload to include
            default sports.
          </p>
        </div>
      )}
    </div>
  );
}

export default ManageSports;
