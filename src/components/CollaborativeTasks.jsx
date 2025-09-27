import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { API_URL } from "../config/api.js";
import { Users, Clock, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export const CollaborativeTasks = () => {
  const [collaborativeTasks, setCollaborativeTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchCollaborativeTasks();
  }, []);

  const fetchCollaborativeTasks = async () => {
    if (!token) return;
    
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
      
      const data = await response.json();
      setCollaborativeTasks(data);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Fetch collaborative tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (collaborativeTasks.length === 0) {
    return (
      <div className="text-center py-6">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No collaborative tasks yet</p>
        <p className="text-gray-400 text-xs mt-1">Tasks shared with you will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {collaborativeTasks.slice(0, 3).map((task) => (
        <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 text-sm truncate flex-1 mr-2">
              {task.title}
            </h4>
            {getStatusIcon(task.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {task.role}
            </span>
          </div>
        </div>
      ))}
      
      {collaborativeTasks.length > 3 && (
        <div className="text-center pt-2">
          <button 
            onClick={() => toast.info("Full collaborative tasks view coming soon!")}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View all {collaborativeTasks.length} tasks
          </button>
        </div>
      )}
    </div>
  );
};