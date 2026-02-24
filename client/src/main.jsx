import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { AdminProvider } from "./context/AdminContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <PostProvider>
        <AdminProvider>
          <App />
          <Toaster position="top-right" reverseOrder={false} />
        </AdminProvider>
      </PostProvider>
    </AuthProvider>
);
