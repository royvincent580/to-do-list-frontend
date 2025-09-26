import { useState } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { CollaborationModal } from "./CollaborationModal.jsx";
import { Edit3, Trash2, Users, Calendar, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export const ProfessionalTaskCard = ({ task, tags, onTaskUpdated, onTaskDeleted }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const getStatusConfig = (status) => {
    switch (status) {
      case "TaskStatus.PENDING":
        return { color: "bg-amber-100 text-amber-800 border-amber-200", text: "Pending" };
      case "TaskStatus.IN_PROGRESS":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", text: "In Progress" };
      case "TaskStatus.COMPLETED":
        return { color: "bg-green-100 text-green-800 border-green-200", text: "Completed" };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: status };
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

  const statusConfig = getStatusConfig(task.status);

  if (editingTask === task.id) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in">
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            placeholder="Task title"
            maxLength={40}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
            placeholder="Task description"
            maxLength={600}
          />
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="flex space-x-3">
            <button
              onClick={() => handleUpdate(task.id)}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditingTask(null)}
              className="bg-white text-gray-700 font-medium px-6 py-2.5 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 fade-in">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{task.title}</h3>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                title="Edit task"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setShowCollabModal(true);
                }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                title="Manage collaborators"
              >
                <Users className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{task.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {task.tagName}
                </span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
            
            {task.created_at && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleEdit(task)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Edit3 className="h-3 w-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                setSelectedTask(task);
                setShowCollabModal(true);
              }}
              className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <Users className="h-3 w-3" />
              <span>Share</span>
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

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
    </>
  );
};