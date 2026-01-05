import React, { useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ForgotPasswordPage from "./pages/ForgotPassword";
import DashboardPage from "./pages/Dashboard";
import CreateQuizPage from "./pages/CreateQuiz";
import BuilderPage from "./pages/Builder";
import QuizPlayerPage from "./pages/QuizPlayer";
import AnalyticsPage from "./pages/Analytics";
import ProfilePage from "./pages/Profile";
import Navbar from "./components/Navbar";
import { storageService } from "./services/storage";
import { User } from "./types";

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(
    storageService.getCurrentUser()
  );
  const location = useLocation();

  const handleLogin = (u: User) => {
    storageService.setCurrentUser(u);
    setUser(u);
  };

  const handleUpdateUser = (u: User) => {
    storageService.updateProfile(u);
    setUser({ ...u });
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
  };

  // Define routes that should NOT show the global navbar
  const standaloneRoutes = ["/", "/login", "/signup", "/forgot-password"];

  const isPublicQuizRoute = location.pathname.startsWith("/quiz/");
  const isStandaloneRoute =
    standaloneRoutes.includes(location.pathname) || isPublicQuizRoute;

  return (
    <div className="min-h-screen flex flex-col ">
      {!isStandaloneRoute && <Navbar user={user} onLogout={handleLogout} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <SignupPage onSignup={handleLogin} />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/dashboard"
            element={
              user ? <DashboardPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/create"
            element={user ? <CreateQuizPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/builder/:id?"
            element={
              user ? <BuilderPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/quiz/:id" element={<QuizPlayerPage />} />
          <Route
            path="/analytics/:id"
            element={user ? <AnalyticsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <ProfilePage user={user} onUpdate={handleUpdateUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
