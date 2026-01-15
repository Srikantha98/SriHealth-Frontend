import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, isAuthenticated, logoutUser } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => isAuthenticated() ? getUser() : null);

  // Update user state on mount and whenever login/logout happens
  useEffect(() => {
    // Optional: listen to storage changes if login/logout occurs in another tab
    const handleStorageChange = () => {
      setUser(isAuthenticated() ? getUser() : null);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Left: Project Title */}
      <Link to="/" className="text-lg font-semibold tracking-wide">
        SriHealth
      </Link>

      {/* Right: Navigation */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-slate-600 text-sm font-medium">
              {user?.name || user?.email || "User"}
            </span>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
