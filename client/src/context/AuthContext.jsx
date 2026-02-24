import React, { createContext, useContext, useState, useEffect } from "react";
import api, { getAuthHeader, handleError } from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/profile", {
            headers: getAuthHeader(),
          });
          setUser(response.data.data.user);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { data } = response.data;
      localStorage.setItem("token", data.accessToken);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await api.post("/auth/register", userData);
      const { data } = response.data;
      localStorage.setItem("token", data.accessToken);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/users/update", profileData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data.data); // Success response wrapper { success, message, data }
      return response.data.data;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
