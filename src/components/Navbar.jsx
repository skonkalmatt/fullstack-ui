import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Lift Tracker</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
