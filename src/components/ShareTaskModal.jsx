import { useState } from "react";
import { useAuthStore } from "../stores/auth-store.js";
import { API_URL } from "../config/api.js";
import { Users, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export const ShareTaskModal = ({ task, isOpen, onClose, onUpdated }) => {
  const [mode, setMode] = useState(null); // 'single' or 'multiple'
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const addCollaborator = async (collaboratorEmail) => {
    const response = await fetch(`${API_URL}/tasks/${task.id}/collaborators`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: collaboratorEmail,
        role: "collaborator"
      })
    });
    
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add collaborator');
      } else {
        throw new Error("Server error");
      }
    }
  };

  const handleSingleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);
    
    try {
      await addCollaborator(email);
      toast.success("Collaborator added successfully!");
      setEmail("");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleAdd = async () => {
    const validEmails = emails.filter(e => e.trim());
    if (validEmails.length === 0) return;
    
    setLoading(true);
    let successCount = 0;
    
    for (const emailAddr of validEmails) {
      try {
        await addCollaborator(emailAddr);
        successCount++;
      } catch (error) {
        toast.error(`Failed to add ${emailAddr}: ${error.message}`);
      }
    }
    
    if (successCount > 0) {
      toast.success(`${successCount} collaborator(s) added successfully!`);
      setEmails([""]);
      onUpdated();
      onClose();
    }
    
    setLoading(false);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const resetModal = () => {
    setMode(null);
    setEmail("");
    setEmails([""]);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Task</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Task: {task.title}</h4>
        </div>

        {!mode ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('single')}
              className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-700">Add 1 Collaborator</span>
            </button>
            
            <button
              onClick={() => setMode('multiple')}
              className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <Users className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-700">Add Many Collaborators</span>
            </button>
          </div>
        ) : mode === 'single' ? (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter collaborator's email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSingleAdd}
                disabled={loading || !email.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg font-medium"
              >
                {loading ? "Adding..." : "Add Collaborator"}
              </button>
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder={`Email ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {emails.length > 1 && (
                  <button
                    onClick={() => removeEmailField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addEmailField}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Another Email
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleMultipleAdd}
                disabled={loading || emails.filter(e => e.trim()).length === 0}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 px-4 rounded-lg font-medium"
              >
                {loading ? "Adding..." : "Add All Collaborators"}
              </button>
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};