import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { ProfessionalTaskCard } from "./ProfessionalTaskCard.jsx";
import { FormikTaskForm } from "./FormikTaskForm.jsx";
import { CollaborativeTasks } from "./CollaborativeTasks.jsx";
import { Plus, BarChart3, CheckSquare, Clock, Users, TrendingUp } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export const ProfessionalDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/tasks/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/tags");
      setTags(response.data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchTags()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "TaskStatus.PENDING").length;
    const inProgress = tasks.filter(t => t.status === "TaskStatus.IN_PROGRESS").length;
    const completed = tasks.filter(t => t.status === "TaskStatus.COMPLETED").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, completionRate };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your tasks.</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>{showCreateForm ? "Cancel" : "New Task"}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">{stats.completionRate}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="mb-8 slide-up">
            <FormikTaskForm 
              tags={tags} 
              onTaskCreated={() => {
                fetchTasks();
                setShowCreateForm(false);
              }} 
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Tags</h3>
              {tags.length === 0 ? (
                <p className="text-gray-500 text-sm">No tags available</p>
              ) : (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium mr-2 mb-2"
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Collaborative Tasks Preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborative Tasks</h3>
              <CollaborativeTasks />
            </div>
          </div>
          
          {/* Tasks Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
              <span className="text-sm text-gray-500">{tasks.length} tasks</span>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
                <p className="text-gray-500 mb-6">Create your first task to get started with your productivity journey!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <ProfessionalTaskCard
                    key={task.id}
                    task={task}
                    tags={tags}
                    onTaskUpdated={fetchTasks}
                    onTaskDeleted={fetchTasks}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};