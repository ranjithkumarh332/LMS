import api from './api'

export const quizService = {
  async getAll(params = {}) {
    const response = await api.get('/quizzes', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/quizzes', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/quizzes/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/quizzes/${id}`)
    return response.data
  },

  async startQuiz(quizId) {
    const response = await api.post(`/quizzes/${quizId}/start`)
    return response.data
  },

  async submitQuiz(quizId, attemptId, answers) {
    const response = await api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, { answers })
    return response.data
  },

  async getResults(quizId, attemptId) {
    const response = await api.get(`/quizzes/${quizId}/attempts/${attemptId}/results`)
    return response.data
  },

  async getMyAttempts(quizId) {
    const response = await api.get(`/quizzes/${quizId}/my-attempts`)
    return response.data
  }
}

export default quizService
