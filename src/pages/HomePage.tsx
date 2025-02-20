import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

interface Sport {
  id: string;
  name: string;
  icon: string;
}

const SPORTS: Sport[] = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
];

function HomePage() {
  const navigate = useNavigate();
  const [years, setYears] = useState<number[]>([]);
  const { selectedYear, setSelectedYear } = useYear();

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/years");
      if (response.data && Array.isArray(response.data)) {
        setYears(response.data);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching years:", error.message || error);
    }
  };

  const addNewYear = async () => {
    const newYear = new Date().getFullYear() + 1;
    try {
      await axios.post("http://localhost:3000/api/years", { year: newYear });
      fetchYears();
    } catch (error) {
      console.error("Error adding new year:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
          <h1 className="text-4xl font-bold text-gray-800">
            Avaamo Premier League
          </h1>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={addNewYear}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SPORTS.map((sport) => (
          <div
            key={sport.id}
            onClick={() => navigate(`/sport/${sport.id}`)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">{sport.icon}</span>
              <h2 className="text-xl font-semibold text-gray-800">
                {sport.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
