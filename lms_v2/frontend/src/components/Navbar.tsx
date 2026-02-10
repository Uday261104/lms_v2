import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, isCreator, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transition-transform group-hover:scale-110">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive("/")
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/my-enrollments"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive("/my-enrollments")
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  My Learning
                </Link>

                {isCreator && (
                  <Link
                    to="/creator/dashboard"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      location.pathname.startsWith("/creator")
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Creator Studio
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-red-600 hover:to-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
