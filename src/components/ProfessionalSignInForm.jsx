import { useState } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { API_URL } from "../config/api.js";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

export const ProfessionalSignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if API URL is configured
    if (!API_URL || API_URL.includes('localhost')) {
      toast.error("API not configured. Please check environment variables.");
      setLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        // Log error for debugging in development only
        if (import.meta.env.DEV) console.log('Non-JSON response:', text.substring(0, 200));
        if (text.includes('Application Error') || text.includes('503')) {
          throw new Error('Backend is starting up. Please wait 30-60 seconds and try again.');
        }
        throw new Error('Server returned non-JSON response. Backend may be down.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Server error (${response.status})`);
      }

      if (!data.token) {
        throw new Error('No token received from server');
      }

      signIn(data.token);
      toast.success("Welcome back!");
    } catch (error) {
      if (import.meta.env.DEV) console.error('Sign in error:', error);
      if (error.name === 'AbortError') {
        toast.error("Request timed out - backend is starting up, please wait and try again");
      } else if (error.message.includes('fetch')) {
        toast.error("Cannot connect to server. Please check your internet connection.");
      } else {
        toast.error(error.message || "Sign in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Signing In...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};