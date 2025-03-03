import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import axios from "axios";
import { useYear } from "../context/YearContext";

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

  useEffect(() => {
    fetchRules();
  }, [sportName]);

  const fetchRules = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/rules?sport=${sportName}&year=${selectedYear}`
      );
      setRules(response.data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:3000/api/rules", {
        sport: sportName,
        content: newRule,
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
    try {
      await axios.patch(`http://localhost:3000/api/rules/${ruleId}`, {
        content: editedContent,
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
    <div className="p-6 space-y-6">
      <header className="flex justify-center items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Rules</h2>
      </header>
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Rule</span>
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Add New Rule</h3>
          <textarea
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="w-full h-32 p-2 border rounded-md resize-none"
            placeholder="Enter rule content..."
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Rule
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule._id} className="p-4 bg-gray-100 rounded-md">
            {editingId === rule._id ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md resize-none mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(rule._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-gray-800 flex-1">{rule.content}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchRules;
