import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (authTokens) {
      axios
        .get("http://127.0.0.1:8000/api/workouts/", {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        })
        .then((res) => {
          setWorkouts(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch workouts:", err);
        });
    }
  }, [authTokens]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <Link
        to="/new-workout"
        className="inline-block mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        ➕ Start New Workout
      </Link>

      {workouts.length === 0 ? (
        <p>No workouts yet. Start one above!</p>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border p-4 rounded-lg shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold">
                Workout on {new Date(workout.date).toLocaleDateString()}
              </h2>
              <p className="text-gray-600">{workout.notes}</p>
              <p className="text-sm text-gray-500">
                {workout.exercises.length} exercises
              </p>
              <Link
                to={`/workout/${workout.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
