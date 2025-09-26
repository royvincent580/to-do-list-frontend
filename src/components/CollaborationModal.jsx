import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { API_URL } from "../config/api.js";

import { toast } from "sonner";

export const CollaborationModal = ({ task, isOpen, onClose, onUpdated }) => {
  const [users, setUsers] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); // Now stores email
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, task.id, fetchCollaborators]);

  const fetchUsers = useCallback(async () => {
    // No longer needed since we use email input
    setUsers([]);
  }, []);

  const fetchCollaborators = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}/collaborators`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }
      
      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.log("No collaborators endpoint or error");
    }
  }, [task.id, token]);

  const addCollaborator = async () => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}/collaborators`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedUser,
          role: "collaborator"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add collaborator');
      }

      toast.success("Collaborator added successfully!");
      setSelectedUser("");
      fetchCollaborators();
      onUpdated();
    } catch (error) {
      toast.error(error.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (userId) => {
    toast.info("Remove collaborator feature not implemented in backend yet");
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
            Add Collaborator by Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="Enter collaborator's email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
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