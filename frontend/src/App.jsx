import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import CollegeAdminDashboard from './pages/CollegeAdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/student/*" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/trainer/*" element={
                <ProtectedRoute allowedRoles={['trainer', 'college_admin', 'superadmin']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/college-admin/*" element={
                <ProtectedRoute allowedRoles={['college_admin', 'superadmin']}>
                  <CollegeAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/super-admin/*" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
