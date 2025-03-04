import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, [sportName, selectedYear]);

  const formatSportName = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/gallery?sport=${sportName}&year=${selectedYear}`
      );
      setPhotos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPhoto.imageUrl.trim() || !newPhoto.caption.trim()) {
      alert("Image URL and caption cannot be empty.");
      return;
    }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <motion.header
        className="flex flex-col justify-center items-center mb-10"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative mb-2">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            Gallery
          </h2>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full"></div>
        </div>
        <p className="text-xl text-gray-600 mt-4">
          {formatSportName(sportName)} - {selectedYear}
        </p>
      </motion.header>

      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setShowAddForm(!showAddForm)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Plus className="mr-1" />
          <span>{showAddForm ? "Cancel" : "Add Photo"}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10 overflow-hidden"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <Plus className="mr-3 text-blue-500" />
                Add New Photo
              </h3>

              <div className="p-6 bg-blue-50 rounded-xl shadow-inner">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={newPhoto.imageUrl}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, imageUrl: e.target.value })
                      }
                      className="w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={newPhoto.caption}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, caption: e.target.value })
                      }
                      className="w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Enter caption"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="mr-2" /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleAdd}
                >
                  <Check className="mr-2" /> Add Photo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : photos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-12 text-center shadow-md"
        >
          <p className="text-xl text-gray-600">
            No photos found for this sport and year.
          </p>
          <p className="mt-2 text-gray-500">
            Click 'Add Photo' to add your first photo.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:border-l-8 transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <motion.img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="object-cover w-full h-48"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg shadow-md flex items-center justify-center"
                  onClick={() => handleDelete(photo._id)}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4">
                <p className="text-gray-800 font-semibold text-lg">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Gallery;
