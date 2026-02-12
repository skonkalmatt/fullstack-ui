import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-3">
      <Link to="/home" className="text-lg font-bold text-white no-underline">
        Lift Tracker
      </Link>
      {user && (
        <button
          onClick={logout}
          className="text-sm text-zinc-400 hover:text-white bg-transparent border border-zinc-700 px-3 py-1.5 rounded-lg hover:border-zinc-500 transition-colors"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
