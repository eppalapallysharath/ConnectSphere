import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "https://connectsphere-apis.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleError = (err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const errorData = err.response?.data;
  const msg =
    errorData?.error?.details?.[0]?.msg ||
    errorData?.message ||
    err.message ||
    "An unexpected error occurred";
  return msg;
};

export default api;
