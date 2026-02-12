import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import NewWorkout from "./pages/NewWorkout";
import WorkoutDetail from "./pages/WorkoutDetail";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? children : <Navigate to="/" />;
}

function GuestRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? <Navigate to="/home" /> : children;
}

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

      <Route element={<PrivateRoute><AuthenticatedLayout /></PrivateRoute>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/new-workout" element={<NewWorkout />} />
        <Route path="/workout/:id" element={<WorkoutDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
