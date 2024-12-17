// src/services/authService.js
import api from './api'

const TOKEN_KEY = 'user_token'
const USER_KEY = 'user_data'

const authService = {
  // Các phương thức hiện có
  async login(phoneNumber, password) {
    try {
      const response = await api.post('/auth/user-login', {
        phoneNumber,
        password
      })

      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token)
        localStorage.setItem(USER_KEY, JSON.stringify(response.user))
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
      }

      return response
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid phone number or password')
          case 403:
            throw new Error('Access denied')
          default:
            throw new Error('Login failed. Please try again')
        }
      }
      throw new Error('Connection error. Please check your network')
    }
  },

  // Thêm các phương thức mới cho đăng ký
  async sendOTP(phoneNumber) {
    try {
      const response = await api.post('/auth/verify-phone', { phoneNumber })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP')
    }
  },

  async verifyOTP(phoneNumber, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { phoneNumber, otp })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Các phương thức hiện có khác
  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    delete api.defaults.headers.common['Authorization']
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp < Date.now() / 1000) {
        this.logout()
        return false
      }
      return true
    } catch (error) {
      this.logout()
      return false
    }
  }
}

export default authService
