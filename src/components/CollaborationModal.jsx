import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import axios from "axios";
import { toast } from "sonner";

export const CollaborationModal = ({ task, isOpen, onClose, onUpdated }) => {
  const [users, setUsers] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchCollaborators();
    }
  }, [isOpen, task.id]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/tasks/${task.id}/collaborators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollaborators(response.data);
    } catch (error) {
      console.log("No collaborators endpoint or error");
    }
  };

  const addCollaborator = async () => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/v1/tasks/${task.id}/collaborators`, {
        userId: parseInt(selectedUser)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Collaborator added successfully!");
      setSelectedUser("");
      fetchCollaborators();
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${task.id}/collaborators/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Collaborator removed successfully!");
      fetchCollaborators();
      onUpdated();
    } catch (error) {
      toast.error("Failed to remove collaborator");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Collaborators</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Task: {task.title}</h4>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Collaborator
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select a user</option>
              {users.filter(user => !collaborators.find(c => c.id === user.id)).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <button
              onClick={addCollaborator}
              disabled={loading || !selectedUser}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Current Collaborators</h4>
          {collaborators.length === 0 ? (
            <p className="text-gray-500 text-sm">No collaborators yet</p>
          ) : (
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">
                    {collaborator.username} ({collaborator.email})
                  </span>
                  <button
                    onClick={() => removeCollaborator(collaborator.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};