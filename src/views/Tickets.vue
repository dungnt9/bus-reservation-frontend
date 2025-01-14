<template>
  <div class="tickets-container">
    <div class="tickets-card">
      <h2 class="page-title">Vé của tôi</h2>

      <!-- Loading state -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- No tickets message -->
      <div v-if="!loading && tickets.length === 0" class="no-tickets">
        <i class="fas fa-ticket-alt"></i>
        <p>Bạn chưa có vé nào</p>
      </div>

      <!-- Tickets list -->
      <div v-if="tickets.length > 0" class="tickets-list">
        <div
        v-for="ticket in tickets"
        :key="ticket.ticketId"
        class="ticket-item"
        @click="viewTicketDetail(ticket)"
        role="button"
        tabindex="0">
          <div class="ticket-header">
            <div class="ticket-route">{{ ticket.routeName }}</div>
            <div class="ticket-date">{{ formatDate(ticket.invoiceDate) }}</div>
          </div>

          <div class="ticket-details">
            <div class="main-info">
              <div class="info-group">
                <label>Họ tên:</label>
                <span>{{ ticket.fullName }}</span>
              </div>
              <div class="info-group">
                <label>Số điện thoại:</label>
                <span>{{ ticket.phoneNumber }}</span>
              </div>
              <div class="info-group">
                <label>Số ghế:</label>
                <span class="seat-number">{{ ticket.seatNumber }}</span>
              </div>
            </div>

            <div class="time-info">
              <div class="info-group">
                <label>Khởi hành:</label>
                <span>{{ formatDateTime(ticket.scheduledDeparture) }}</span>
              </div>
              <div class="info-group">
                <label>Đến:</label>
                <span>{{ formatDateTime(ticket.scheduledArrival) }}</span>
              </div>
            </div>

            <div class="payment-info">
              <div class="price">{{ formatCurrency(ticket.ticketPrice) }}</div>
              <div class="invoice-number">Mã HĐ: #{{ ticket.invoiceId }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const tickets = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const fetchTickets = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get(`/invoices/customer/${authStore.user.userId}/tickets`)
    tickets.value = response.map(ticket => ({
      ...ticket,
      ticketId: `${ticket.invoiceId}-${ticket.seatNumber}` // Create a unique ticket ID
    }))
  } catch (err) {
    error.value = 'Không thể tải danh sách vé. Vui lòng thử lại sau.'
    console.error('Lỗi khi tải danh sách vé:', err)
  } finally {
    loading.value = false
  }
}

const viewTicketDetail = (ticket) => {
  router.push({
    name: 'TicketDetail',
    params: { id: ticket.ticketId },
    state: { ticket } // Pass the full ticket data as state
  })
}

onMounted(fetchTickets)
</script>

<style scoped>
.tickets-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.tickets-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-title {
  color: #333;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FFA500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-tickets {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-tickets i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ddd;
}

.ticket-item {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.ticket-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ticket-item:hover::after {
  content: 'Xem chi tiết';
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: #FFA500;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.ticket-item:focus {
  outline: none;
  box-shadow: 0 0 0 2px #FFA500;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.ticket-route {
  font-size: 1.2rem;
  font-weight: 600;
  color: #FFA500;
}

.ticket-date {
  color: #666;
  font-size: 0.9rem;
}

.ticket-details {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 20px;
}

.main-info, .time-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-group label {
  color: #666;
  font-size: 0.9rem;
}

.info-group span {
  color: #333;
  font-weight: 500;
}

.seat-number {
  display: inline-block;
  padding: 4px 12px;
  background: #f0f8ff;
  border-radius: 4px;
  color: #1a73e8;
  font-weight: 600;
}

.payment-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #FFA500;
}

.invoice-number {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .ticket-details {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .payment-info {
    text-align: left;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
}
</style>
