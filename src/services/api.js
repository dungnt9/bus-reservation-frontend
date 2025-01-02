// src/services/api.js
import axios from 'axios'
import authService from './authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Danh sách các endpoints không cần xử lý logout khi có lỗi 401
const IGNORE_UNAUTHORIZED_ENDPOINTS = [
  '/auth/request-phone-change',
  '/auth/verify-phone-change'
]

// Request interceptor thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor xử lý lỗi token
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Kiểm tra xem có phải là endpoint cần bỏ qua xử lý logout không
    const requestUrl = error.config?.url
    const shouldIgnoreUnauthorized = IGNORE_UNAUTHORIZED_ENDPOINTS.some(endpoint =>
      requestUrl?.includes(endpoint)
    )

    if (error.response?.status === 401 && !shouldIgnoreUnauthorized) {
      // Token hết hạn hoặc không hợp lệ
      authService.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
