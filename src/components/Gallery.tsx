import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

interface Photo {
  _id: string;
  imageUrl: string;
  caption: string;
  year: number;
}

function Gallery() {
  const { selectedYear } = useYear();
  const { sportName } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    imageUrl: "",
    caption: "",
  });

  useEffect(() => {
    fetchPhotos();
  }, [sportName]);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/gallery?sport=${sportName}&year=${selectedYear}`
      );
      setPhotos(response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:3000/api/gallery", {
        ...newPhoto,
        sport: sportName,
        year: selectedYear,
      });
      setShowAddForm(false);
      setNewPhoto({ imageUrl: "", caption: "" });
      fetchPhotos();
    } catch (error) {
      console.error("Error adding photo:", error);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/gallery/${photoId}`);
      fetchPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-center items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Gallery</h2>
      </header>

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Photo</span>
        </button>
      </div>

      {showAddForm && (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Add New Photo
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={newPhoto.imageUrl}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, imageUrl: e.target.value })
                }
                className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                value={newPhoto.caption}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, caption: e.target.value })
                }
                className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter caption"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
            >
              Add Photo
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="relative">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="object-cover w-full h-48"
              />
              <button
                onClick={() => handleDelete(photo._id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800 font-semibold truncate">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
