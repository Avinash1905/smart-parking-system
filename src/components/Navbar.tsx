import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Parking', path: '/find-parking' },
    { name: 'About', path: '/about' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'user':
      default:
        return '/user/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0F172A]/95 border-b border-[#1F2937] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span>🅿</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                SMART<span className="text-[#38BDF8]">PARK</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-[#94A3B8] -mt-1">
                INTELLIGENT PARKING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-[#38BDF8] bg-[#111827] font-semibold border border-[#1F2937]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#111827]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    isActive(getDashboardPath())
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                      : 'border-[#1F2937] bg-[#111827] text-[#94A3B8] hover:text-white hover:border-[#2563EB]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#38BDF8]" />
                  <span>Dashboard</span>
                  <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-[#1E40AF] text-[#38BDF8] font-bold ml-1">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2.5 rounded-xl border border-[#1F2937] text-[#94A3B8] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Login Button - Blue outline / blue accent style */}
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                    isActive('/login')
                      ? 'border-[#2563EB] text-[#38BDF8] bg-[#2563EB]/20 shadow-sm ring-1 ring-[#2563EB]/50'
                      : 'border-[#2563EB] text-[#38BDF8] bg-transparent hover:bg-[#2563EB]/10'
                  }`}
                >
                  Login
                </Link>

                {/* Get Started Button - Solid Blue #2563EB */}
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-150 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-white hover:bg-[#111827] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#38BDF8]" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1F2937] bg-[#0F172A] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-[#38BDF8] bg-[#111827] font-semibold border border-[#1F2937]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#111827]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#1F2937] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to {user.role.toUpperCase()} Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-900/50 text-red-400 hover:bg-red-950/20 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.username})</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-center font-medium border ${
                    isActive('/login')
                      ? 'border-[#2563EB] text-[#38BDF8] bg-[#2563EB]/20 font-bold'
                      : 'border-[#2563EB] text-[#38BDF8] bg-transparent'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-center bg-[#2563EB] text-white font-semibold shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
