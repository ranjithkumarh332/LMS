import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(data) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },

  async refreshToken() {
    const token = localStorage.getItem('token')
    const response = await api.post('/auth/refresh-token', { token })
    return response.data
  },

  async verifyOtp(email, otp) {
    const response = await api.post('/auth/verify-otp', { email, otp })
    return response.data
  },

  async sendOtp(email) {
    const response = await api.post('/auth/send-otp', { email })
    return response.data
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  }
}

export default authService
