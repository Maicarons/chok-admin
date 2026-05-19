import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Request interceptor - attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (resp) => {
    if (resp.data.code !== 0 && resp.data.code !== undefined) {
      console.error('API Error:', resp.data.message)
    }
    return resp.data
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    const msg = err.response?.data?.message || err.message
    ElMessage.error(msg)
    return Promise.reject(err)
  },
)

export default api

// --- Auth ---
export function loginWithGithub(code) {
  return api.post('/auth/github', { code })
}
export function getMe() {
  return api.get('/auth/me')
}

// --- Stats ---
export function getStats() {
  return api.get('/stats')
}

// --- Apps ---
export function getHotApps(limit = 20) {
  return api.get('/apps/hot', { params: { limit } })
}
export function getLatestApps(limit = 20) {
  return api.get('/apps/latest', { params: { limit } })
}
export function getRanking(type = 'all_time', page = 1, size = 20) {
  return api.get('/apps/ranking', { params: { type, page, size } })
}
export function getAppDetail(uid) {
  return api.get(`/apps/${uid}`)
}
export function searchApps(q) {
  return api.get('/apps/search', { params: { q } })
}

// --- Issues ---
export function getIssues(params = {}) {
  return api.get('/issues', { params })
}
export function updateIssueStatus(id, status) {
  return api.post(`/issues/manage/${id}`, { status })
}

// --- Collections ---
export function getCollections() {
  return api.get('/collections')
}
export function createCollection(data) {
  return api.post('/collections', data)
}

// --- Sync ---
export function syncData() {
  return api.post('/sync')
}

// --- Submissions ---
export function createSubmission(data) {
  return api.post('/submissions', data)
}
export function getSubmissions(params = {}) {
  return api.get('/submissions', { params })
}
export function getSubmissionDetail(id) {
  return api.get(`/submissions/${id}`)
}
export function approveSubmission(id, reviewNote = '') {
  return api.post(`/submissions/${id}/approve`, { review_note: reviewNote })
}
export function rejectSubmission(id, reviewNote = '') {
  return api.post(`/submissions/${id}/reject`, { review_note: reviewNote })
}

// --- Users ---
export function getUsers() {
  return api.get('/users')
}
export function updateUserRole(id, role) {
  return api.put(`/users/${id}`, { role })
}
