import React, { createContext, useContext, useState, useCallback } from "react";
import api, { getAuthHeader, handleError } from "../api/axiosInstance";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        headers: getAuthHeader(),
      });
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const blockUser = async (userId) => {
    try {
      await api.put(
        `/admin/users/block/${userId}`,
        {},
        {
          headers: getAuthHeader(),
        },
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBlocked: true } : u)),
      );
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const unblockUser = async (userId) => {
    try {
      await api.put(
        `/admin/users/unblock/${userId}`,
        {},
        {
          headers: getAuthHeader(),
        },
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u)),
      );
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteAnyPost = async (postId) => {
    try {
      await api.delete(`/admin/posts/${postId}`, {
        headers: getAuthHeader(),
      });
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get("/admin/analytics", {
        headers: getAuthHeader(),
      });
      setAnalytics(response.data.data.analytics || null);
    } catch (err) {
      setError(handleError(err));
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        analytics,
        loading,
        error,
        fetchUsers,
        blockUser,
        unblockUser,
        deleteAnyPost,
        fetchAnalytics,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
