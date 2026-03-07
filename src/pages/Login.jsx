import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.token, response.data.message);
            navigate("/boards");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md border border-gray-300 bg-white p-10 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-gray-600 mb-1">Email</label>
                            <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>

                        <div style={{ marginTop: 10 }}>
                            <label className="block text-gray-600 mb-1">Password</label>
                            <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
                            style={{ marginTop: 20 }}
                        >
                            Sign In
                        </button>
                        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                    </form>

            <p className="text-center text-sm text-gray-500 mt-4">
                Don’t have an account? <a href="#" className="text-blue-600 hover:underline font-medium">Sign up</a>
            </p>
      </div>
    </div>
    );
}
