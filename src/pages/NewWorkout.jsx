import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function NewWorkout() {
  const { authTokens } = useContext(AuthContext);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/workouts/",
        { notes },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      // ✅ redirect to the new workout’s detail page
      navigate(`/workout/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create workout", err);
      setError("Failed to create workout. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Start a New Workout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Workout notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded p-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Workout
        </button>
      </form>
    </div>
  );
}
