import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post("/api/auth/login", { email, password });
        setToken(res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    };

    const register = async (name, email, password) => {
        const res = await axios.post("/api/auth/register", { name, email, password });
        setToken(res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
