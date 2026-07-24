import api from './api'

export const assessmentService = {
  async getAll(params = {}) {
    const response = await api.get('/assessments', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/assessments/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/assessments', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/assessments/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/assessments/${id}`)
    return response.data
  },

  async duplicate(id) {
    const response = await api.post(`/assessments/${id}/duplicate`)
    return response.data
  },

  async publish(id) {
    const response = await api.post(`/assessments/${id}/publish`)
    return response.data
  },

  async archive(id) {
    const response = await api.post(`/assessments/${id}/archive`)
    return response.data
  },

  // Question Bank operations
  async getQuestions(bankId, params = {}) {
    const response = await api.get(`/assessments/${bankId}/questions`, { params })
    return response.data
  },

  async addQuestion(bankId, data) {
    const response = await api.post(`/assessments/${bankId}/questions`, data)
    return response.data
  },

  async updateQuestion(bankId, questionId, data) {
    const response = await api.put(`/assessments/${bankId}/questions/${questionId}`, data)
    return response.data
  },

  async deleteQuestion(bankId, questionId) {
    const response = await api.delete(`/assessments/${bankId}/questions/${questionId}`)
    return response.data
  },

  async bulkAddQuestions(bankId, questions) {
    const response = await api.post(`/assessments/${bankId}/questions/bulk`, { questions })
    return response.data
  }
}

export default assessmentService
