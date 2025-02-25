import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

interface Sport {
  _id: string;
  name: string;
  description: string;
  year: number;
}

function AddSport() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [newSport, setNewSport] = useState({
    name: "",
    description: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sport");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const handleAddSport = async () => {
    try {
      await axios.post("http://localhost:3000/api/sports", newSport);
      setNewSport({
        name: "",
        description: "",
        year: new Date().getFullYear(),
      });
      fetchSports();
    } catch (error) {
      console.error("Error adding sport:", error);
    }
  };

  const handleDeleteSport = async (sportId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/sports/${sportId}`);
      fetchSports();
    } catch (error) {
      console.error("Error deleting sport:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Sports</h2>

      {/* Add New Sport Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Sport</h3>
        <input
          type="text"
          placeholder="Sport Name"
          value={newSport.name}
          onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
          className="block w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Sport Description"
          value={newSport.description}
          onChange={(e) =>
            setNewSport({ ...newSport, description: e.target.value })
          }
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Year Introduced"
          value={newSport.year}
          onChange={(e) =>
            setNewSport({ ...newSport, year: parseInt(e.target.value) })
          }
          className="block w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleAddSport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="inline-block w-5 h-5 mr-2" />
          Add Sport
        </button>
      </div>

      {/* Sports List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Sports</h3>
        <ul className="list-disc pl-6">
          {sports.map((sport) => (
            <li key={sport._id} className="flex justify-between items-center">
              <span>{sport.name}</span>
              <button
                onClick={() => handleDeleteSport(sport._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddSport;
