import { API_URL } from "../config/api.js";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { FormikTaskForm } from "../components/FormikTaskForm.jsx";
import { TaskList } from "../components/TaskList.jsx";

import { toast } from "sonner";

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/user`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error("Failed to fetch tasks");
    }
  }, [token]);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_URL}/tags`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Fetch tags error:', error);
      toast.error("Failed to fetch tags");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchTags()]);
      setLoading(false);
    };
    loadData();
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create New Task"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <FormikTaskForm 
              tags={tags} 
              onTaskCreated={() => {
                fetchTasks();
                setShowCreateForm(false);
              }} 
            />
          </div>
        )}

        <TaskList 
          tasks={tasks} 
          tags={tags}
          onTaskUpdated={fetchTasks}
          onTaskDeleted={fetchTasks}
        />
      </div>
    </div>
  );
};