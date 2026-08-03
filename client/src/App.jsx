import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import AddSubject from './pages/AddSubject';
import SubjectDetail from './pages/SubjectDetail';
import EditSubject from './pages/EditSubject';
import CalendarPage from './pages/CalendarPage';

function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/admin/login') {
    return <main className="auth-full-screen">{children}</main>;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="admin-app-shell">{children}</div>;
  }

  if (!isAuthenticated) {
    return <main className="auth-full-screen">{children}</main>;
  }

  return (
    <div className="app-shell">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="app-shell-main">
        <Navbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onGlobalSearch={(q) => setGlobalSearchQuery(q)}
        />
        <main className="main-content-viewport">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Unauthenticated Student Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Dedicated Admin Login & Admin Dashboard Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Protected Authenticated Student Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects"
                element={
                  <ProtectedRoute>
                    <SubjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-subject"
                element={
                  <ProtectedRoute>
                    <AddSubject />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subject/:id"
                element={
                  <ProtectedRoute>
                    <SubjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-subject/:id"
                element={
                  <ProtectedRoute>
                    <EditSubject />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
