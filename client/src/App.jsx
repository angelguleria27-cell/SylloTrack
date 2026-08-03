import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
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
              {/* Public Unauthenticated Routes */}
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

              {/* Protected Authenticated Routes */}
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
