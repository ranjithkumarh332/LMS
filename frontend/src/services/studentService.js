import api from './api'

export const studentService = {
  async getAll(params = {}) {
    const response = await api.get('/students', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/students/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/students', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/students/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/students/${id}`)
    return response.data
  },

  async bulkImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/students/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async getCohorts(studentId) {
    const response = await api.get(`/students/${studentId}/cohorts`)
    return response.data
  },

  async getAssessments(studentId) {
    const response = await api.get(`/students/${studentId}/assessments`)
    return response.data
  },

  async uploadResume(studentId, file) {
    const formData = new FormData()
    formData.append('resume', file)
    const response = await api.post(`/students/${studentId}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async deleteResume(studentId) {
    const response = await api.delete(`/students/${studentId}/resume`)
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/students/profile', data)
    return response.data
  }
}

export default studentService
