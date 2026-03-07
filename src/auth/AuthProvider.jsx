import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {localStorage.getItem("message") ? 
        JSON.parse(localStorage.getItem("message")) : ""});

    const login = (token, message) => {
        setToken(token);
        const userEmail = message.split("user:")[1].trim();
        setUser(userEmail); 
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setUser("");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}