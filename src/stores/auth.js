import { defineStore } from 'pinia'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    token: authService.getToken()
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.userRole || '',
    userName: (state) => state.user?.fullName || ''
  },

  actions: {
    async login(phoneNumber, password) {
      const response = await authService.login(phoneNumber, password)
      this.user = response.user
      this.token = response.token
      return response
    },

    logout() {
      authService.logout()
      this.user = null
      this.token = null
    },

    updateUserName(newName) {
      if (this.user) {
        this.user = {
          ...this.user,
          fullName: newName
        }
        // Update in localStorage
        const userData = authService.getCurrentUser()
        if (userData) {
          userData.fullName = newName
          localStorage.setItem('user_data', JSON.stringify(userData))
        }
      }
    }
  }
})
