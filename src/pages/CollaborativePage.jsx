import { useState } from "react";
import { CollaborativeTasks } from "../components/CollaborativeTasks.jsx";
import { TeamCollaborationModal } from "../components/TeamCollaborationModal.jsx";
import { Users } from "lucide-react";

export const CollaborativePage = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaborative Tasks</h1>
            <p className="text-gray-600">Tasks shared with you and team collaborations</p>
          </div>
          <button
            onClick={() => setShowTeamModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>Team Collaboration</span>
          </button>
        </div>

        <CollaborativeTasks />
        
        <TeamCollaborationModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          onTeamCreated={() => {}}
        />
      </div>
    </div>
  );
};