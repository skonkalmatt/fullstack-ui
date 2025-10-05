import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function WorkoutDetail() {
  const { id } = useParams(); // workout ID from URL
  const { authTokens } = useContext(AuthContext);
  const [workout, setWorkout] = useState(null);
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch the workout + its exercises
  useEffect(() => {
    if (authTokens) {
      axios
        .get(`http://127.0.0.1:8000/api/workouts/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        })
        .then((res) => setWorkout(res.data))
        .catch((err) => {
          console.error("Failed to fetch workout:", err);
          if (err.response?.status === 404) navigate("/home");
        });
    }
  }, [id, authTokens, navigate]);

  const handleAddExercise = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/exercises/",
        {
          workout: id,
          exercise_name: exerciseName,
          weight: parseFloat(weight),
          reps: parseInt(reps),
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh workout data
      const res = await axios.get(`http://127.0.0.1:8000/api/workouts/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setWorkout(res.data);

      // Reset form
      setExerciseName("");
      setWeight("");
      setReps("");
    } catch (err) {
      console.error("Failed to add exercise:", err);
      setError("Could not add exercise. Try again.");
    }
  };

  if (!workout) return <p className="p-6">Loading workout...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Workout Detail</h1>
      <p className="text-gray-600 mb-4">{workout.notes || "No notes"}</p>

      <h2 className="text-xl font-semibold mb-2">Exercises</h2>
      {workout.exercises.length === 0 ? (
        <p>No exercises yet. Add one below!</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {workout.exercises.map((ex) => (
            <li
              key={ex.id}
              className="border rounded p-2 flex justify-between items-center"
            >
              <span>
                {ex.exercise_name} — {ex.weight} lbs × {ex.reps} reps
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddExercise} className="space-y-3">
        <input
          type="text"
          placeholder="Exercise name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Exercise
        </button>
      </form>
    </div>
  );
}
