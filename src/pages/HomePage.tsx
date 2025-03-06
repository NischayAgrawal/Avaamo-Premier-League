import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
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

function HomePage() {
  const { selectedYear, setSelectedYear } = useYear();
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchYears();
  }, []);

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

  const addNewYear = async () => {
    const newYear = new Date().getFullYear() + 1;
    try {
      await axios.post("http://localhost:3000/api/years", { year: newYear });
      fetchYears();
    } catch (error) {
      console.error("Error adding new year:", error.message || error);
    }
  };

  // Updated tabs array with "Manage Teams"
  const tabs = [
    { path: "", label: "Leaderboard", icon: <Trophy className="w-5 h-5" /> },
    {
      path: "manage-sports",
      label: "Manage Sports",
      icon: <Star className="w-5 h-5" />,
    },
    {
      path: "manage-teams",
      label: "Manage Teams",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const handleExploreSports = () => {
    navigate("/manage-sports");
    setTimeout(() => {
      document
        .getElementById("navigation-tabs")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-200 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full opacity-10 translate-x-1/3 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-300 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
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
                  onClick={handleExploreSports}
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
                    Share team photos and memories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        id="main-content"
        className="container mx-auto px-6 py-12 max-w-6xl relative z-10"
      >
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

        {/* Navigation Tabs */}
        <nav
          id="navigation-tabs"
          className="flex justify-center overflow-x-auto py-2"
        >
          <div
            className="inline-flex items-center p-2 bg-gray-50 rounded-xl shadow-lg"
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(249, 250, 251, 0.8)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  (tab.path === "" && location.pathname === "/") ||
                  location.pathname === `/${tab.path}`
                    ? "bg-blue-600 text-white shadow-md transform scale-105 hover:scale-110"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 hover:shadow-md hover:scale-105"
                }`}
                style={{
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <div
          className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-all duration-500"
          style={{
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
            transform: "perspective(1000px) rotateX(1deg)",
            transformOrigin: "top center",
            background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
