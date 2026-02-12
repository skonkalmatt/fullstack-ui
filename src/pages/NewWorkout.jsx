import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";

const emptySet = () => ({ weight: "", reps: "" });
const emptyExercise = () => ({
  name: "",
  sets: [emptySet()],
});

export default function NewWorkout() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeAC, setActiveAC] = useState(null); // index of exercise showing autocomplete

  useEffect(() => {
    api
      .get("/exercise-suggestions/")
      .then((res) => setSuggestions(res.data))
      .catch(() => {});
  }, []);

  // --- exercise helpers ---
  const updateExerciseName = (i, name) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], name };
      return copy;
    });
    setActiveAC(name.length > 0 ? i : null);
  };

  const pickSuggestion = (i, name) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], name };
      return copy;
    });
    setActiveAC(null);
  };

  const removeExercise = (i) => {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, emptyExercise()]);
  };

  // --- set helpers ---
  const updateSet = (eIdx, sIdx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      const sets = [...copy[eIdx].sets];
      sets[sIdx] = { ...sets[sIdx], [field]: value };
      copy[eIdx] = { ...copy[eIdx], sets };
      return copy;
    });
  };

  const addSet = (eIdx) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[eIdx] = { ...copy[eIdx], sets: [...copy[eIdx].sets, emptySet()] };
      return copy;
    });
  };

  const removeSet = (eIdx, sIdx) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[eIdx] = {
        ...copy[eIdx],
        sets: copy[eIdx].sets.filter((_, idx) => idx !== sIdx),
      };
      return copy;
    });
  };

  // --- save ---
  const handleSave = async () => {
    setError("");

    const payload = [];
    for (const ex of exercises) {
      if (!ex.name.trim()) continue;
      for (const s of ex.sets) {
        if (s.weight === "" || s.reps === "") continue;
        payload.push({
          exercise_name: ex.name.trim(),
          weight: parseFloat(s.weight),
          reps: parseInt(s.reps, 10),
        });
      }
    }

    if (payload.length === 0) {
      setError("Add at least one exercise with a completed set.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/workouts/", { notes, exercises: payload });
      navigate("/home");
    } catch {
      setError("Failed to save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredSuggestions = (query) =>
    suggestions.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">New Workout</h1>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full mb-6 resize-none"
      />

      <div className="flex flex-col gap-5">
        {exercises.map((ex, eIdx) => (
          <div
            key={eIdx}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
          >
            {/* exercise header */}
            <div className="flex items-center gap-2 mb-3 relative">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => updateExerciseName(eIdx, e.target.value)}
                  onFocus={() => ex.name.length > 0 && setActiveAC(eIdx)}
                  onBlur={() => setTimeout(() => setActiveAC(null), 150)}
                  className="w-full"
                />
                {activeAC === eIdx &&
                  filteredSuggestions(ex.name).length > 0 && (
                    <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-[#252525] border border-[#333] rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                      {filteredSuggestions(ex.name).map((s) => (
                        <li
                          key={s}
                          onMouseDown={() => pickSuggestion(eIdx, s)}
                          className="px-3 py-2 text-sm text-zinc-300 hover:bg-[#333] cursor-pointer"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              {exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExercise(eIdx)}
                  className="text-zinc-600 hover:text-red-400 bg-transparent border-none text-lg shrink-0 transition-colors"
                  title="Remove exercise"
                >
                  x
                </button>
              )}
            </div>

            {/* sets */}
            <div className="flex flex-col gap-2">
              {ex.sets.map((s, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <span className="text-zinc-600 text-xs w-6 text-right shrink-0">
                    {sIdx + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="lbs"
                    value={s.weight}
                    onChange={(e) =>
                      updateSet(eIdx, sIdx, "weight", e.target.value)
                    }
                    className="flex-1 min-w-0"
                    min="0"
                    step="any"
                  />
                  <span className="text-zinc-600 text-xs">x</span>
                  <input
                    type="number"
                    placeholder="reps"
                    value={s.reps}
                    onChange={(e) =>
                      updateSet(eIdx, sIdx, "reps", e.target.value)
                    }
                    className="flex-1 min-w-0"
                    min="0"
                  />
                  {ex.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(eIdx, sIdx)}
                      className="text-zinc-600 hover:text-red-400 bg-transparent border-none text-sm shrink-0 transition-colors"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(eIdx)}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 bg-transparent border-none transition-colors"
            >
              + Add Set
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addExercise}
        className="mt-4 w-full border border-dashed border-[#333] text-zinc-400 hover:text-white hover:border-zinc-500 bg-transparent py-2.5 rounded-xl transition-colors"
      >
        + Add Exercise
      </button>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {saving ? "Saving..." : "Save Workout"}
      </button>
    </div>
  );
}
