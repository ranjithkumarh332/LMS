import api from './api'

export const userService = {
  async getAll(params = {}) {
    const response = await api.get('/users', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/users', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async activate(id) {
    const response = await api.post(`/users/${id}/activate`)
    return response.data
  },

  async deactivate(id) {
    const response = await api.post(`/users/${id}/deactivate`)
    return response.data
  },

  async suspend(id) {
    const response = await api.post(`/users/${id}/suspend`)
    return response.data
  },

  async resetPassword(id) {
    const response = await api.post(`/users/${id}/reset-password`)
    return response.data
  },

  async getByEmail(email) {
    const response = await api.get('/users/by-email', { params: { email } })
    return response.data
  }
}

export default userService
