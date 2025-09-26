import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { CollaborationModal } from "./CollaborationModal.jsx";
import { API_URL } from "../config/api.js";

import { toast } from "sonner";

export const CollaborativeTasks = () => {
  const [collaborativeTasks, setCollaborativeTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchCollaborativeTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/collaborative`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborative tasks');
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      const data = await response.json();
      setCollaborativeTasks(data);
    } catch (error) {
      // If endpoint doesn't exist, show empty state
      setCollaborativeTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCollaborativeTasks();
  }, [fetchCollaborativeTasks]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING": return "Pending";
      case "IN_PROGRESS": return "In Progress";
      case "COMPLETED": return "Completed";
      default: return status;
    }
  };

  const handleManageCollaborators = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      toast.success("Task status updated!");
      fetchCollaborativeTasks();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaborative Tasks</h3>
      
      {collaborativeTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">👥</div>
          <p className="text-gray-500">No collaborative tasks yet</p>
          <p className="text-gray-400 text-sm">Tasks shared with you will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collaborativeTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{task.title}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleManageCollaborators(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Collaborators
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{task.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {task.tags && task.tags.length > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {task.tags[0].name}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
                
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              
              {task.owner && (
                <div className="mt-2 text-xs text-gray-500">
                  Owner: {task.owner.username}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <CollaborationModal
          task={selectedTask}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onUpdated={fetchCollaborativeTasks}
        />
      )}
    </div>
  );
};