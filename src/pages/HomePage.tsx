import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Trash2,
  PlusCircle,
  Calendar,
  Medal,
  Award,
  Users,
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

function HomePage() {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear } = useYear();
  const [years, setYears] = useState<number[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [newSport, setNewSport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeHoverSport, setActiveHoverSport] = useState<string | null>(null);

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchSportsForYear();
    }
  }, [selectedYear]);

  const fetchYears = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/years");
      setYears(response.data);
      if (response.data.length > 0 && !selectedYear) {
        setSelectedYear(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching years:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Show success animation/notification (could implement toast here)
    } catch (error) {
      console.error("Error adding sport:", error.message || error);
      // Show error notification
    }

    setNewSport(""); // Reset dropdown
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

  const addNewYear = async () => {
    const newYear = new Date().getFullYear() + 1;
    try {
      await axios.post("http://localhost:3000/api/years", { year: newYear });
      fetchYears();
    } catch (error) {
      console.error("Error adding new year:", error.message || error);
    }
  };

  const getSportIcon = (sport: string) => {
    // You can replace these with actual sport icons if available
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
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-200 to-white">
      {/* Hero Banner with parallax effect */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full opacity-10 translate-x-1/3 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-300 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {/*<div className="inline-flex items-center bg-blue-500/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="font-medium">Sports Management Platform</span>
              </div>*/}

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Avaamo Premier
                <div className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                    League
                  </span>
                  <div className="absolute -bottom-2 left-0 h-3 w-full bg-blue-500/30 rounded-full blur-sm"></div>
                </div>
              </h1>

              <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
                Organize, manage, and track sports competitions across different
                teams and seasons with our comprehensive sports management
                platform.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("manage-sports")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group px-8 py-4 bg-white text-blue-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center">
                    Explore Sports
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-center relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full -translate-y-1/4 translate-x-1/4 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/4 -translate-x-1/4 blur-md"></div>

              <div className="relative z-10 grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="bg-blue-500/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Medal className="text-yellow-300 w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-1 text-xl">Tournaments</h3>
                  <p className="text-blue-100 text-sm">
                    Track tournament winners and achievements
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mt-8 shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="bg-blue-500/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Calendar className="text-yellow-300 w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-1 text-xl">Standings</h3>
                  <p className="text-blue-100 text-sm">
                    Monitor team performance and rankings
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="bg-blue-500/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Award className="text-yellow-300 w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-1 text-xl">Achievements</h3>
                  <p className="text-blue-100 text-sm">
                    Record team success and milestones
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mt-8 shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="bg-blue-500/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Users className="text-yellow-300 w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-1 text-xl">Photo Album</h3>
                  <p className="text-blue-100 text-sm">
                    Share team photos and memories{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8 bg-gradient-to-r from-yellow-100 to-yellow-200 px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-duration-300">
            <Trophy className="w-10 h-10 text-yellow-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 tracking-wide">
              Sports Management App
            </h1>
          </div>

          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Manage sports competitions and track performance across different
            years
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="relative">
              <select
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="pl-5 pr-10 py-3 text-lg border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none hover:border-blue-300 transition-all"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year} Season
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            <button
              onClick={addNewYear}
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-300/30"
            >
              <span className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Year
              </span>
            </button>
          </div>
        </div>

        <div
          id="manage-sports"
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100"
        >
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
                    {/* Top accent bar */}
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
              {/*<button
                onClick={() => document.querySelector("select")?.focus()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300"
              >
                Add Your First Sport
              </button>*/}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
