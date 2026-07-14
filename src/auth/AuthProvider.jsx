import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => localStorage.getItem("user") || "");
    const logoutTimeoutRef = useRef(null);
    const INACTIVITY_TIMEOUT_MS = import.meta.env.DEV ? 1000 : 15 * 60 * 1000;

    const login = (token, message) => {
        setToken(token);
        const userEmail = message?.split("user:")[1]?.trim() || "";
        setUser(userEmail);
        localStorage.setItem("token", token);
        localStorage.setItem("user", userEmail);
    };

    const logout = useCallback((redirect = false) => {
        if (logoutTimeoutRef.current) {
            clearTimeout(logoutTimeoutRef.current);
            logoutTimeoutRef.current = null;
        }

        setToken(null);
        localStorage.removeItem("token");
        setUser("");
        localStorage.removeItem("user");

        if (redirect) {
            navigate("/login");
        }
    }, [navigate]);

    const resetLogoutTimer = useCallback(() => {
        if (!token) return;

        if (logoutTimeoutRef.current) {
            clearTimeout(logoutTimeoutRef.current);
        }

        logoutTimeoutRef.current = setTimeout(() => {
            logout(true);
        }, INACTIVITY_TIMEOUT_MS);
    }, [logout, token, INACTIVITY_TIMEOUT_MS]);

    useEffect(() => {
        if (!token) {
            return;
        }

        resetLogoutTimer();

        const handleActivity = () => {
            resetLogoutTimer();
        };

        const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity);
        });

        return () => {
            if (logoutTimeoutRef.current) {
                clearTimeout(logoutTimeoutRef.current);
                logoutTimeoutRef.current = null;
            }

            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });
        };
    }, [token, resetLogoutTimer]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}