import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div id="loader">
        <div className="loader-mark"></div>
        <div className="loader-text">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      student: '/student',
      trainer: '/trainer',
      college_admin: '/college-admin',
      superadmin: '/super-admin'
    }
    const redirectPath = roleRoutes[user.role] || '/'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default ProtectedRoute
