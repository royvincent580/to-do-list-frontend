import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth-store.js";
import { LandingPage } from "./components/LandingPage.jsx";
import { ProfessionalDashboard } from "./components/ProfessionalDashboard.jsx";
import { TasksPage } from "./pages/TasksPage.jsx";
import { CollaborativePage } from "./pages/CollaborativePage.jsx";
import { ProfessionalNavigation } from "./components/ProfessionalNavigation.jsx";
import { BackendHealthCheck } from "./components/BackendHealthCheck.jsx";
import { Toaster } from "sonner";

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <BackendHealthCheck>
      {!isLoggedIn ? (
        <>
          <LandingPage />
          <Toaster position="top-center" richColors />
        </>
      ) : (
        <Router>
          <ProfessionalNavigation />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProfessionalDashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/collaborative" element={<CollaborativePage />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </Router>
      )}
    </BackendHealthCheck>
  );
}

export default App;