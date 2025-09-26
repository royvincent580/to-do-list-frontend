import { useState, useEffect } from "react";
import { API_URL } from "../config/api.js";
import { toast } from "sonner";

export const BackendHealthCheck = ({ children }) => {
  const [isHealthy, setIsHealthy] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for cold start
        
        const response = await fetch(`${API_URL}/tags`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          setIsHealthy(true);
          toast.success("Backend is ready!");
        } else {
          throw new Error('Backend not responding correctly');
        }
      } catch (error) {
        setIsHealthy(false);
        if (error.name === 'AbortError') {
          toast.error("Backend is starting up - please wait 30-60 seconds and refresh");
        } else {
          toast.error("Backend connection failed - please wait and refresh");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendHealth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking backend status...</p>
          <p className="text-gray-400 text-sm mt-2">Free tier backend is starting up - please wait up to 60 seconds</p>
        </div>
      </div>
    );
  }

  if (!isHealthy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Backend Not Available</h2>
          <p className="text-gray-600 mb-6">
            The backend server is starting up or temporarily unavailable. 
            This is normal for free tier hosting.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return children;
};