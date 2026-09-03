import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield, Car, Wrench, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, UserRole } from '../services/authService';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';

export const Login: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = authService.getDashboardRoute(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { usernameOrEmail?: string; password?: string; general?: string } = {};

    // Validation rules
    const trimmedUsername = usernameOrEmail.trim();
    if (!trimmedUsername) {
      newErrors.usernameOrEmail = 'Username or email is required.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    // If validation fails, update errors and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await login({
        usernameOrEmail: trimmedUsername,
        password,
      });

      if (!result.success) {
        setErrors({
          general: result.error || 'Invalid username or password.',
        });
      }
    } catch {
      setErrors({
        general: 'An unexpected error occurred during authentication. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to fill demo credentials for reviewer convenience
  const handleQuickFill = (demoRole: UserRole) => {
    switch (demoRole) {
      case 'admin':
        setUsernameOrEmail('admin');
        setPassword('admin123');
        break;
      case 'user':
        setUsernameOrEmail('user');
        setPassword('user123');
        break;
      case 'staff':
        setUsernameOrEmail('staff');
        setPassword('staff123');
        break;
    }
    setErrors({});
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#080F1C] bg-grid-pattern relative min-h-[calc(100vh-80px)]">
      
      {/* Background subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#2563EB]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 mb-2 transform hover:scale-105 transition-transform">
            <span className="text-2xl font-black">🅿</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h1>
          
          <p className="text-sm text-[#94A3B8]">
            Login to your SmartPark account
          </p>
        </div>

        {/* Main Login Card */}
        <Card glass glow className="p-6 sm:p-8 bg-[#111827] border-[#1F2937]">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            
            {/* General Invalid Login Error Alert */}
            {errors.general && (
              <Alert
                type="error"
                message={errors.general}
                className="animate-shake"
              />
            )}

            {/* Username / Email Input */}
            <Input
              id="username-or-email"
              name="usernameOrEmail"
              label="Username or Email"
              type="text"
              placeholder="Enter username or email"
              autoComplete="username"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                if (errors.usernameOrEmail) {
                  setErrors((prev) => ({ ...prev, usernameOrEmail: undefined }));
                }
              }}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.usernameOrEmail}
              disabled={isSubmitting}
            />

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                allowPasswordToggle
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
                disabled={isSubmitting}
              />
              
              {/* Forgot Password Link */}
              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#38BDF8] hover:text-[#2563EB] hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-base font-semibold py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Login
              </Button>
            </div>

            {/* Register Navigation */}
            <div className="text-center pt-3 border-t border-[#1F2937]">
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#38BDF8] hover:text-[#2563EB] hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </form>
        </Card>

        {/* Quick Demo Testing Helper Panel */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1F2937] text-center space-y-2 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#94A3B8]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Quick Demo Role Testing:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:border-[#2563EB] hover:text-[#38BDF8] transition-colors shadow-sm"
            >
              <Shield className="w-3 h-3 text-[#38BDF8]" />
              <span>Admin (admin)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:border-[#2563EB] hover:text-[#38BDF8] transition-colors shadow-sm"
            >
              <Car className="w-3 h-3 text-[#38BDF8]" />
              <span>User (user)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('staff')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:border-[#2563EB] hover:text-[#38BDF8] transition-colors shadow-sm"
            >
              <Wrench className="w-3 h-3 text-[#38BDF8]" />
              <span>Staff (staff)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
