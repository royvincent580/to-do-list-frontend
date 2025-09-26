import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { Users, Plus, UserPlus, X } from "lucide-react";
import axios from "axios";
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
  }, [isOpen]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/teams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (error) {
      toast.error("Failed to fetch teams");
    }
  };

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

  const createTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/v1/teams", {
        name: teamName,
        description: teamDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Team created successfully!");
      setTeamName("");
      setTeamDescription("");
      setShowCreateForm(false);
      fetchTeams();
      onTeamCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const inviteToTeam = async (teamId) => {
    if (!selectedUser) return;
    
    try {
      await axios.post(`http://localhost:5000/api/v1/teams/${teamId}/invite`, {
        userId: parseInt(selectedUser)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("User invited to team!");
      setSelectedUser("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to invite user");
    }
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

        {/* Teams List */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Teams</h4>
          {teams.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No teams yet. Create your first team!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">{team.name}</h5>
                      <p className="text-sm text-gray-600">{team.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created by {team.created_by} • Your role: {team.role}
                      </p>
                    </div>
                    {team.role === 'admin' && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {team.role === 'admin' && (
                    <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select user to invite</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => inviteToTeam(team.id)}
                        disabled={!selectedUser}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Invite</span>
                      </button>
                    </div>
                  )}
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