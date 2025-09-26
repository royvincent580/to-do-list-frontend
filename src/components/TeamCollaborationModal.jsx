import { API_URL } from "../config/api.js";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { Users, Plus, UserPlus, X } from "lucide-react";

import { toast } from "sonner";

export const TeamCollaborationModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
      fetchUsers();
    }
  }, [isOpen, fetchTeams, fetchUsers]);

  const fetchTeams = useCallback(async () => {
    // Teams feature not implemented in backend
    setTeams([]);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();
    toast.info("Team creation feature coming soon!");
    setShowCreateForm(false);
  };

  const inviteToTeam = async (teamId) => {
    if (!selectedUser) return;
    
    toast.info("Team invitation feature coming soon!");
    setSelectedUser("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Team Collaboration</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Create Team Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{showCreateForm ? "Cancel" : "Create New Team"}</span>
          </button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Team</h4>
            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  placeholder="Describe your team's purpose"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>
        )}

        {/* Available Users */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Users</h4>
          <p className="text-sm text-gray-600 mb-4">You can collaborate with these users by sharing tasks directly.</p>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{user.username}</h5>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};