import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";
import { motion, AnimatePresence } from "framer-motion";

interface Rule {
  _id: string;
  content: string;
  year: number;
}

function MatchRules() {
  const { selectedYear } = useYear();
  const { sportName } = useParams();
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [newRule, setNewRule] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, [sportName, selectedYear]);

  const formatSportName = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/rules?sport=${sportName}&year=${selectedYear}`
      );
      setRules(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching rules:", error);
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newRule.trim()) {
      alert("Rule content cannot be empty.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/rules", {
        sport: sportName,
        content: newRule.trim(),
        year: selectedYear,
      });
      setNewRule("");
      setShowAddForm(false);
      fetchRules();
    } catch (error) {
      console.error("Error adding rule:", error);
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingId(rule._id);
    setEditedContent(rule.content);
  };

  const handleSave = async (ruleId: string) => {
    if (!editedContent.trim()) {
      alert("Rule content cannot be empty.");
      return;
    }
    try {
      await axios.patch(`http://localhost:3000/api/rules/${ruleId}`, {
        content: editedContent.trim(),
      });
      setEditingId(null);
      fetchRules();
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/rules/${ruleId}`);
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
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
            Match Rules
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
          <span>{showAddForm ? "Cancel" : "Add Rule"}</span>
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
                Add New Rule
              </h3>

              <div className="p-6 bg-blue-50 rounded-xl shadow-inner">
                <textarea
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="w-full h-32 p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter rule content..."
                />
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
                  <Check className="mr-2" /> Add Rule
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
      ) : rules.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-12 text-center shadow-md"
        >
          <p className="text-xl text-gray-600">
            No rules found for this sport and year.
          </p>
          <p className="mt-2 text-gray-500">
            Click 'Add Rule' to create your first rule.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          {rules.map((rule, index) => (
            <motion.div
              key={rule._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:border-l-8 transition-all duration-300"
            >
              {editingId === rule._id ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 bg-blue-50 rounded-lg shadow-inner mb-4">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-32 p-4 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="flex justify-end mt-6 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingId(null)}
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <X className="mr-2" /> Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSave(rule._id)}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Check className="mr-2" /> Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 flex-1 text-lg">{rule.content}</p>
                  <div className="flex space-x-4 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
                      onClick={() => handleDelete(rule._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default MatchRules;
