// ========================================
// App — Root Component with Routing & Auth Restore
// ========================================

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from 'src/constants';
import { ToastProvider } from 'src/hooks/useToast';
import ToastContainer from 'src/components/common/Toast';
import ProtectedRoute from 'src/components/layout/ProtectedRoute';
import { getCurrentUser } from 'src/api/authApi';
import { setUser, logout, setLoading } from 'src/store/authSlice';

// Pages
import LandingPage from 'src/pages/LandingPage';
import DetectPage from 'src/pages/DetectPage';
import HistoryPage from 'src/pages/HistoryPage';
import StatsPage from 'src/pages/StatsPage';
import ProfilePage from 'src/pages/ProfilePage';
import LoginPage from 'src/pages/LoginPage';
import RegisterPage from 'src/pages/RegisterPage';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        dispatch(setLoading());
        const userData = await getCurrentUser();
        dispatch(setUser(userData));
      } catch (err) {
        // Token is invalid/expired
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.DETECT} element={<DetectPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path={ROUTES.HISTORY}
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STATS}
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
