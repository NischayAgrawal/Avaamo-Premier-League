import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

const ALL_SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
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

  console.log(sports);

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

      <div className="flex items-center justify-center gap-4 mb-6">
        <select
          value={newSport}
          onChange={(e) => setNewSport(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          onClick={addSport}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Add Sport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sports.map((sport) => (
          <div
            key={sport}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <h2
                className="text-xl font-semibold text-gray-800"
                onClick={() => navigate(`/sport/${sport.toLowerCase()}`)}
              >
                {sport}
              </h2>
              <button
                onClick={() => deleteSport(sport)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
