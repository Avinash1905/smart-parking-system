import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../services/authService';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#080F1C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#94A3B8]">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not permitted, show Access Denied screen with redirect link
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#080F1C]">
        <div className="max-w-md w-full text-center space-y-6 bg-[#111827] border border-[#1F2937] p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/40 text-red-400 flex items-center justify-center mx-auto shadow-inner border border-red-900/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Your account role <span className="font-semibold uppercase text-[#38BDF8] font-mono">[{user.role}]</span> does not have authorization to view this area.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/user/dashboard'}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm transition-colors shadow-md shadow-blue-500/20"
            >
              Return to Your Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
