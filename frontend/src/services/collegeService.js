import api from './api'

export const collegeService = {
  async getAll(params = {}) {
    const response = await api.get('/colleges', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/colleges/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/colleges', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/colleges/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/colleges/${id}`)
    return response.data
  },

  async activate(id) {
    const response = await api.post(`/colleges/${id}/activate`)
    return response.data
  },

  async deactivate(id) {
    const response = await api.post(`/colleges/${id}/deactivate`)
    return response.data
  },

  async getDepartments(collegeId) {
    const response = await api.get(`/colleges/${collegeId}/departments`)
    return response.data
  },

  async getStats(collegeId) {
    const response = await api.get(`/colleges/${collegeId}/stats`)
    return response.data
  }
}

export default collegeService
