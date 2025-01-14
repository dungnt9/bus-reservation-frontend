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
            throw new Error('Sai số điện thoại hoặc mật khẩu')
          case 403:
            throw new Error('Truy cập bị từ chối')
          default:
            throw new Error('Đăng nhập thất bại')
        }
      }
      throw new Error('Lỗi kết nối. Vui lòng kiểm tra mạng')
    }
  },

  // Thêm các phương thức mới cho đăng ký
  async sendOTP(phoneNumber) {
    try {
      const response = await api.post('/auth/verify-phone', { phoneNumber })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gửi mã OTP thất bại')
    }
  },

  async verifyOTP(phoneNumber, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { phoneNumber, otp })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xác thực mã OTP thất bại')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại')
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
  },

  async forgotPassword(phoneNumber) {
    try {
        const response = await api.post('/auth/forgot-password', { phoneNumber })
        return response
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Gửi mã OTP thất bại')
    }
  },

  async resetPassword(phoneNumber, otp, newPassword) {
      try {
          const response = await api.post('/auth/reset-password', {
              phoneNumber,
              otp,
              newPassword
          })
          return response
      } catch (error) {
          throw new Error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại')
      }
  },
}

export default authService
