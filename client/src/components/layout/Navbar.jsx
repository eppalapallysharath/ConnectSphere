import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Home, Shield } from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="flex items-center gap-2 group"
            >
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Shield size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ConnectSphere
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {!isAdmin && (
                <Link
                  to="/"
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary transition-all flex items-center gap-2"
                >
                  <Home size={18} />
                  <span className="font-medium text-sm">Feed</span>
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to={`/profile/${user?.id}`}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary transition-all flex items-center gap-2"
                >
                  <User size={18} />
                  <span className="font-medium text-sm">Profile</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl text-primary-dark bg-primary/10 hover:bg-primary/20 transition-all flex items-center gap-2"
                >
                  <Shield size={18} />
                  <span className="font-medium text-sm">Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900">
                  {user?.name}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                {user?.profile_pic?.url ? (
                  <img
                    src={user.profile_pic.url}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 font-bold uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
