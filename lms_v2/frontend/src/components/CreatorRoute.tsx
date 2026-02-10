import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface CreatorRouteProps {
  children: React.ReactNode;
}

const CreatorRoute: React.FC<CreatorRouteProps> = ({ children }) => {
  const { isAuthenticated, isCreator, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm font-medium text-gray-600">
            Checking permissions…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCreator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-md rounded-2xl border-2 border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">🚫</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mb-6 text-gray-600">
            You need to be a creator to access this page.
          </p>
          <a
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CreatorRoute;
