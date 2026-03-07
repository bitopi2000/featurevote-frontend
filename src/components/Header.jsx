// src/components/Header.jsx

import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white border-b px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">FeatureVote</h1>
      {user && <span className="text-gray-600 text-sm">Welcome, {user}</span>}
    </header>
  );
}
