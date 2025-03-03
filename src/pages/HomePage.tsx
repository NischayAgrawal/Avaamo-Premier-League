import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Trash2, PlusCircle } from "lucide-react";
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

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchSportsForYear();
    }
  }, [selectedYear]);

  const fetchYears = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/years");
      setYears(response.data);
    } catch (error) {
      console.error("Error fetching years:", error.message || error);
    }
  };

  const fetchSportsForYear = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/sports/${selectedYear}`
      );
      setSports(response.data.map((sport) => sport.name));
    } catch (error) {
      console.error("Error fetching sports:", error.message || error);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6 bg-yellow-50 px-8 py-4 rounded-full shadow-sm">
            <Trophy className="w-10 h-10 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 tracking-wide">
              Avaamo Premier League
            </h1>
          </div>

          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Manage sports competitions and track performance across different
            years
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="pl-5 pr-10 py-3 text-lg border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year} Season
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={addNewYear}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Year
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Sports
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-grow max-w-md">
              <select
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
                className="w-full pl-5 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={addSport}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 flex items-center"
              disabled={!newSport}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Sport
            </button>
          </div>

          {sports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sports.map((sport) => (
                <div
                  key={sport}
                  onClick={() => navigate(`/sport/${sport.toLowerCase()}`)}
                  className="group relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 cursor-pointer"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSport(sport);
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
                      aria-label="Delete sport"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-6 py-8 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{getSportIcon(sport)}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {sport}
                    </h3>
                    <div className="mt-2 px-4 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      View Details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Sports Added Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You can add sports using the dropdown above or reload to include
                default sports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
