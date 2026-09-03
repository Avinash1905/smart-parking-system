import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { FindParking } from './pages/FindParking';
import { About } from './pages/About';

// Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { UserDashboard } from './pages/dashboards/UserDashboard';
import { StaffDashboard } from './pages/dashboards/StaffDashboard';

export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#080F1C] text-white selection:bg-[#2563EB] selection:text-white">
            
            {/* Reusable Navbar used across all pages */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/find-parking" element={<FindParking />} />
                <Route path="/about" element={<About />} />

                {/* Protected Role-Based Dashboards */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'staff']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Reusable Footer */}
            <Footer />

          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
