import api from './api'

export const notificationService = {
  async getAll(params = {}) {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  async markAsRead(id) {
    const response = await api.post(`/notifications/${id}/read`)
    return response.data
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/read-all')
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }
}

export default notificationService
