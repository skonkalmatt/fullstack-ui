import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import NewWorkout from "./pages/NewWorkout";
import WorkoutDetail from "./pages/WorkoutDetail";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/new-workout" element={<NewWorkout />} />
      <Route path="/workout/:id" element={<WorkoutDetail />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
