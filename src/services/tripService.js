import api from './api'
import authService from './authService'

const tripService = {
    async getMyTrips() {
        try {
            const user = authService.getCurrentUser()
            if (!user) throw new Error('User not authenticated')

            const response = await api.get(`/trips/my-trips/${user.userId}`)
            return response
        } catch (error) {
            console.error('Lỗi khi lấy my trips:', error)
            throw error
        }
    },

    async updateTripStatus(tripId, updateData) {
        try {
            const response = await api.put(`/trips/${tripId}/status`, updateData)
            return response
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái chuyến xe:', error)
            throw error
        }
    }
}

export default tripService
