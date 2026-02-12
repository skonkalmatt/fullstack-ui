import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/axios";

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState("");

  const fetchWorkout = () => {
    api
      .get(`/workouts/${id}/`)
      .then((res) => setWorkout(res.data))
      .catch((err) => {
        if (err.response?.status === 404) navigate("/home");
      });
  };

  useEffect(fetchWorkout, [id, navigate]);

  const handleAddExercise = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/exercises/", {
        workout: parseInt(id, 10),
        exercise_name: exerciseName,
        weight: parseFloat(weight),
        reps: parseInt(reps, 10),
      });
      fetchWorkout();
      setExerciseName("");
      setWeight("");
      setReps("");
    } catch (err) {
      const detail = err.response?.data;
      setError(detail ? JSON.stringify(detail) : "Could not add exercise.");
    }
  };

  const deleteExercise = async (exId) => {
    try {
      await api.delete(`/exercises/${exId}/`);
      fetchWorkout();
    } catch {
      /* ignore */
    }
  };

  const deleteWorkout = async () => {
    if (!window.confirm("Delete this entire workout?")) return;
    try {
      await api.delete(`/workouts/${id}/`);
      navigate("/home");
    } catch {
      /* ignore */
    }
  };

  if (!workout)
    return <p className="text-zinc-500 py-12 text-center">Loading...</p>;

  // group exercises by name
  const grouped = {};
  for (const ex of workout.exercises) {
    if (!grouped[ex.exercise_name]) grouped[ex.exercise_name] = [];
    grouped[ex.exercise_name].push(ex);
  }

  return (
    <div>
      <Link
        to="/home"
        className="text-sm text-zinc-500 hover:text-zinc-300 mb-4 inline-block"
      >
        &larr; Back to workouts
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {new Date(workout.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h1>
          {workout.notes && (
            <p className="text-zinc-400 text-sm mt-1">{workout.notes}</p>
          )}
        </div>
        <button
          onClick={deleteWorkout}
          className="text-sm text-zinc-600 hover:text-red-400 bg-transparent border border-zinc-700 hover:border-red-400/50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          Delete
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-zinc-500 mb-6">No exercises yet.</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {Object.entries(grouped).map(([name, sets]) => (
            <div
              key={name}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
            >
              <h3 className="text-white font-medium mb-2">{name}</h3>
              <div className="flex flex-col gap-1">
                {sets.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-400">
                      <span className="text-zinc-600 mr-2">{idx + 1}</span>
                      {s.weight} lbs x {s.reps} reps
                    </span>
                    <button
                      onClick={() => deleteExercise(s.id)}
                      className="text-zinc-700 hover:text-red-400 bg-transparent border-none text-sm transition-colors"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
        <h3 className="text-white font-medium mb-3">Add a set</h3>
        <form onSubmit={handleAddExercise} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Exercise name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full"
            required
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 min-w-0"
              required
              min="0"
              step="any"
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="flex-1 min-w-0"
              required
              min="0"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
