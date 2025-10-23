// src/components/Sidebar.jsx

import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-100 border-r min-h-screen px-6 py-6 shadow-md">
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `py-2 px-4 rounded hover:bg-gray-200 ${
              isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
            }`
          }
        >
          Boards
        </NavLink>

        {/* Add more links if needed */}

        <button
          onClick={handleLogout}
          className="mt-10 text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
