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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Photo Gallery</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Photo
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Photo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                value={newPhoto.imageUrl}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, imageUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Caption
              </label>
              <input
                type="text"
                value={newPhoto.caption}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, caption: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter caption"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Photo
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="bg-gray-50 rounded-lg overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-800">{photo.caption}</p>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => handleDelete(photo._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
