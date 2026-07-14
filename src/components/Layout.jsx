// src/components/Layout.jsx

import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AuthContext } from "../auth/AuthProvider";

export default function Layout() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
