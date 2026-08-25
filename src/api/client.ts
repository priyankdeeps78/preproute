import axios from 'axios'

import { useAuthStore } from '@/store/authStore'

// The staging API doesn't send Access-Control-Allow-Origin, so a direct
// cross-origin call from the browser gets blocked by CORS. In dev, we go
// through Vite's same-origin /api proxy instead (see vite.config.ts), which
// forwards the request server-side where CORS doesn't apply. A production
// deployment needs either a fixed backend or its own proxy in front of it.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? '/api'
    : 'https://admin-moderator-backend-staging.up.railway.app/api')

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)
