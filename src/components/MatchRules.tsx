import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import axios from "axios";

interface Rule {
  _id: string;
  content: string;
}

function MatchRules() {
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
        `http://localhost:3000/api/rules?sport=${sportName}`
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Match Rules</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Rule
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Rule</h3>
          <textarea
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="w-full h-32 p-2 border rounded-lg resize-none"
            placeholder="Enter rule content..."
          />
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
              Add Rule
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule._id} className="bg-gray-50 p-4 rounded-lg">
            {editingId === rule._id ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-32 p-2 border rounded-lg resize-none mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSave(rule._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="flex-1 text-gray-800">{rule.content}</p>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="text-red-600 hover:text-red-800"
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
