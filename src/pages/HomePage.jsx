import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";

export default function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = () => {
    api
      .get("/workouts/")
      .then((res) => setWorkouts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchWorkouts, []);

  const deleteWorkout = async (wId) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await api.delete(`/workouts/${wId}/`);
      setWorkouts((prev) => prev.filter((w) => w.id !== wId));
    } catch {
      /* ignore */
    }
  };

  const summarizeExercises = (exercises) => {
    const names = [...new Set(exercises.map((e) => e.exercise_name))];
    if (names.length === 0) return "No exercises";
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
  };

  if (loading) {
    return <p className="text-zinc-500 py-12 text-center">Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Workouts</h1>
        <Link
          to="/new-workout"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline"
        >
          + New Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-lg mb-2">No workouts yet</p>
          <p className="text-zinc-600 text-sm">
            Tap &quot;New Workout&quot; to log your first session.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between"
            >
              <Link
                to={`/workout/${w.id}`}
                className="flex-1 min-w-0 no-underline"
              >
                <p className="text-white font-medium">
                  {new Date(w.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-zinc-400 text-sm truncate">
                  {summarizeExercises(w.exercises)}
                </p>
                <p className="text-zinc-600 text-xs mt-1">
                  {w.exercises.length} set{w.exercises.length !== 1 && "s"}
                </p>
              </Link>
              <button
                onClick={() => deleteWorkout(w.id)}
                className="ml-4 text-zinc-600 hover:text-red-400 bg-transparent border-none text-lg transition-colors shrink-0"
                title="Delete workout"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
