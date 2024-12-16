// src/services/api.js
import axios from 'axios'
import authService from './authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      authService.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
