import { useState } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { CollaborationModal } from "./CollaborationModal.jsx";
import axios from "axios";
import { toast } from "sonner";

export const TaskList = ({ tasks, tags, onTaskUpdated, onTaskDeleted }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const getStatusColor = (status) => {
    switch (status) {
      case "TaskStatus.PENDING": return "bg-yellow-100 text-yellow-800";
      case "TaskStatus.IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "TaskStatus.COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "TaskStatus.PENDING": return "Pending";
      case "TaskStatus.IN_PROGRESS": return "In Progress";
      case "TaskStatus.COMPLETED": return "Completed";
      default: return status;
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditContent(task.content);
    setEditStatus(task.status === "TaskStatus.PENDING" ? "PENDING" : 
                  task.status === "TaskStatus.IN_PROGRESS" ? "IN_PROGRESS" : "COMPLETED");
  };

  const handleUpdate = async (taskId) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/v1/tasks/${taskId}`, {
        title: editTitle,
        content: editContent,
        status: editStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Task updated successfully!");
      setEditingTask(null);
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Task deleted successfully!");
      onTaskDeleted();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
          {editingTask === task.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                maxLength={40}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                maxLength={600}
              />
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(task.id)}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowCollabModal(true);
                    }}
                    className="text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{task.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    {task.tagName}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      
      {selectedTask && (
        <CollaborationModal
          task={selectedTask}
          isOpen={showCollabModal}
          onClose={() => {
            setShowCollabModal(false);
            setSelectedTask(null);
          }}
          onUpdated={onTaskUpdated}
        />
      )}
    </div>
  );
};