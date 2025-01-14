import api from './api'
import authService from './authService'
const customerService = {
  // Search trips with filters
  async searchTrips(filters) {
    try {
      const response = await api.get('/trips/search', { params: filters })
      return response
    } catch (error) {
      throw new Error('Lỗi tìm chuyến xe: ' + error.message)
    }
  },

  // Get available seats for a trip
  async getTripSeats(tripId) {
    try {
      const response = await api.get(`/trip-seats/trip/${tripId}`)
      return response
    } catch (error) {
      throw new Error('Lỗi lấy ghế chuyến xe: ' + error.message)
    }
  },

  // Book tickets
  async bookTickets(bookingData) {
    try {
      const response = await api.post('/invoices', bookingData)
      return response
    } catch (error) {
      throw new Error('Lỗi đặt vé: ' + error.message)
    }
  },

  // Get customer's invoices
  async getCustomerInvoices() {
    try {
      const response = await api.get('/invoices/customer')
      return response
    } catch (error) {
      throw new Error('Lỗi lấy hóa đơn: ' + error.message)
    }
  },

  // Get customer profile
  async getProfile() {
    try {
      const user = authService.getCurrentUser()
      if (!user) throw new Error('Không tìm thấy người dùng')

      const response = await api.get(`/customers/${user.customerId}`)
      return response
    } catch (error) {
      throw new Error('Lỗi lấy thông tin: ' + error.message)
    }
  },

  // Update customer profile
  async updateProfile(profileData) {
    try {
      const user = authService.getCurrentUser()
      if (!user) throw new Error('Không tìm thấy người dùng')

      const response = await api.put(`/customers/${user.customerId}`, profileData)
      return response
    } catch (error) {
      throw new Error('Lỗi cập nhật profile: ' + error.message)
    }
  }
}

export default customerService
