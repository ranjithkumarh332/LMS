import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const userData = await authService.getProfile()
          setUser(userData)
          setToken(storedToken)
        } catch (error) {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    localStorage.setItem('token', response.token)
    setToken(response.token)
    setUser(response.user)
    return response
  }

  const register = async (data) => {
    const response = await authService.register(data)
    localStorage.setItem('token', response.token)
    setToken(response.token)
    setUser(response.user)
    return response
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email)
  }

  const resetPassword = async (token, password) => {
    return await authService.resetPassword(token, password)
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      localStorage.setItem('token', response.token)
      setToken(response.token)
      return response.token
    } catch (error) {
      logout()
      throw error
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTrainer: user?.role === 'trainer',
    isCollegeAdmin: user?.role === 'college_admin',
    isSuperAdmin: user?.role === 'superadmin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
