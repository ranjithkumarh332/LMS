import api from './api'

export const exportService = {
  async exportStudents(format = 'excel', filters = {}) {
    const response = await api.get('/exports/students', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  },

  async exportTrainers(format = 'excel', filters = {}) {
    const response = await api.get('/exports/trainers', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  },

  async exportResults(format = 'excel', filters = {}) {
    const response = await api.get('/exports/results', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  },

  async generateReport(type, filters = {}) {
    const response = await api.get(`/reports/${type}`, {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  },

  async getAuditLogs(params = {}) {
    const response = await api.get('/audit-logs', { params })
    return response.data
  },

  async downloadTemplate(type) {
    const response = await api.get(`/templates/${type}`, {
      responseType: 'blob'
    })
    return response.data
  }
}

export function downloadBlob(data, filename, mimeType) {
  const blob = new Blob([data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export default exportService
