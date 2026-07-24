import api from './api'

export const trainerService = {
  async getAll(params = {}) {
    const response = await api.get('/trainers', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/trainers/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/trainers', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/trainers/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/trainers/${id}`)
    return response.data
  },

  async getStudents(trainerId) {
    const response = await api.get(`/trainers/${trainerId}/students`)
    return response.data
  },

  async getWorkshops(trainerId) {
    const response = await api.get(`/trainers/${trainerId}/workshops`)
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/trainers/profile', data)
    return response.data
  }
}

export default trainerService
