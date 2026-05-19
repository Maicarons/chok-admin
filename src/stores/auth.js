import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { loginWithGithub, getMe } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || '')
  const isAdmin = computed(() => userRole.value === 'admin')
  const isReviewer = computed(() => userRole.value === 'admin' || userRole.value === 'reviewer')

  async function login(code) {
    const res = await loginWithGithub(code)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', token.value)
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    return res.data
  }

  async function fetchMe() {
    if (!token.value) return
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    try {
      const res = await getMe()
      user.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  // Initialize auth header on app load
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    user, token, isAuthenticated, userRole, isAdmin, isReviewer,
    login, fetchMe, logout,
  }
})
