import api from './api'

export const workshopService = {
  async getAll(params = {}) {
    const response = await api.get('/workshops', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/workshops/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/workshops', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/workshops/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/workshops/${id}`)
    return response.data
  },

  async enroll(workshopId, studentId) {
    const response = await api.post(`/workshops/${workshopId}/enroll`, { studentId })
    return response.data
  },

  async unenroll(workshopId, studentId) {
    const response = await api.post(`/workshops/${workshopId}/unenroll`, { studentId })
    return response.data
  },

  async getAttendees(workshopId) {
    const response = await api.get(`/workshops/${workshopId}/attendees`)
    return response.data
  }
}

export default workshopService
