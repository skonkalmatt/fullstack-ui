import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

export default function NewWorkout() {
  const { authTokens } = useContext(AuthContext);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
       if (!authTokens?.access) {
         navigate("/login");
      }
     }, [authTokens, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/workouts/", { notes });
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
