<template>
  <div class="ticket-detail-container">
    <div class="ticket-detail-card">
      <div class="card-header no-print">
        <button class="back-button" @click="router.back()">
          <i class="fas fa-arrow-left"></i>
          Quay lại
        </button>
        <h2 class="page-title">Chi tiết vé</h2>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-spinner no-print">
        <div class="spinner"></div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger no-print">
        {{ error }}
      </div>

      <!-- Ticket Detail -->
      <div v-if="ticket" class="ticket-content">
        <!-- Company info for print only -->
        <div class="print-only company-header">
          <h1>XE KHÁCH</h1>
          <p>Vé xe khách chính thức</p>
        </div>

        <div class="ticket-header">
          <div class="route-name">{{ ticket.routeName }}</div>
          <div class="invoice-date">Ngày đặt: {{ formatDate(ticket.invoiceDate) }}</div>
        </div>

        <div class="ticket-body">
          <div class="info-section">
            <h3>Thông tin hành khách</h3>
            <div class="info-grid">
              <div class="info-group">
                <label>Họ tên:</label>
                <span>{{ ticket.fullName }}</span>
              </div>
              <div class="info-group">
                <label>Số điện thoại:</label>
                <span>{{ ticket.phoneNumber }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Thông tin chuyến đi</h3>
            <div class="info-grid">
              <div class="info-group">
                <label>Thời gian khởi hành:</label>
                <span>{{ formatDateTime(ticket.scheduledDeparture) }}</span>
              </div>
              <div class="info-group">
                <label>Thời gian đến (dự kiến):</label>
                <span>{{ formatDateTime(ticket.scheduledArrival) }}</span>
              </div>
              <div class="info-group">
                <label>Số ghế:</label>
                <span class="seat-number">{{ ticket.seatNumber }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Thông tin thanh toán</h3>
            <div class="info-grid">
              <div class="info-group">
                <label>Mã hóa đơn:</label>
                <span class="invoice-id">#{{ ticket.invoiceId }}</span>
              </div>
              <div class="info-group">
                <label>Giá vé:</label>
                <span class="ticket-price">{{ formatCurrency(ticket.ticketPrice) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Print button -->
        <div class="ticket-actions no-print">
          <button class="print-button" @click="printTicket">
            <i class="fas fa-print"></i>
            In vé
          </button>
        </div>

        <div class="print-only ticket-footer">
          <p>Vui lòng đến trước giờ khởi hành 15 phút</p>
          <p>Hotline: 1900 xxxx</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const ticket = ref(route.state?.ticket || null) // Try to get ticket from route state first
const loading = ref(!route.state?.ticket) // Don't show loading if we have ticket from state
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

const fetchTicketDetail = async () => {
  // If we already have the ticket from route state, skip API call
  if (ticket.value) {
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null

    if (!authStore.user?.userId) {
      throw new Error('Người dùng không có quyền truy cập. Vui lòng đăng nhập.')
    }

    // Parse the ticketId to get invoiceId and seatNumber
    const [invoiceId, seatNumber] = route.params.id.split('-')

    const response = await api.get(
      `/invoices/customer/${authStore.user.userId}/tickets`,
      { params: { invoiceId, seatNumber } }
    )

    if (response.length === 0) {
      throw new Error('Không tìm thấy thông tin vé')
    }

    ticket.value = response[0]
  } catch (err) {
    console.error('Lỗi lấy thông tin vé:', err)
    error.value = 'Không thể tải thông tin vé. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const printTicket = () => {
  window.print()
}

onMounted(fetchTicketDetail)
</script>

<style scoped>
.ticket-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.ticket-detail-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.back-button:hover {
  color: #FFA500;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.ticket-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.route-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFA500;
  margin-bottom: 8px;
}

.invoice-date {
  color: #666;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #FFA500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-group label {
  color: #666;
  font-size: 0.9rem;
}

.info-group span {
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
}

.seat-number {
  display: inline-block;
  padding: 4px 12px;
  background: #FFF3E0;
  border-radius: 4px;
  color: #FFA500;
  font-weight: 600;
}

.invoice-id {
  color: #1a73e8;
  font-family: monospace;
  font-size: 1.1rem;
}

.ticket-price {
  color: #FFA500;
  font-weight: 600;
}

.ticket-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.print-button {
  background: #FFA500;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.print-button:hover {
  background: #FF8C00;
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

@media (max-width: 768px) {
  .ticket-detail-container {
    margin: 20px auto;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  /* Hide non-printable elements */
  .no-print,
  header,
  footer,
  nav,
  .card-header,
  .ticket-actions {
    display: none !important;
  }

  /* Show print-only elements */
  .print-only {
    display: block !important;
  }

  /* Reset container styles for printing */
  .ticket-detail-container {
    margin: 0;
    padding: 0;
    max-width: none;
  }

  .ticket-detail-card {
    box-shadow: none;
    padding: 20px;
    border: none;
  }

  /* Company header styles */
  .company-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #000;
  }

  .company-header h1 {
    font-size: 24px;
    margin-bottom: 5px;
    color: #000;
  }

  .company-header p {
    font-size: 16px;
    color: #666;
  }

  /* Adjust ticket content for print */
  .ticket-content {
    font-size: 12pt;
  }

  .ticket-header {
    text-align: left;
    margin-bottom: 20px;
  }

  .route-name {
    color: #000 !important;
    font-size: 18pt;
  }

  .info-section {
    margin-bottom: 20px;
    page-break-inside: avoid;
  }

  .info-section h3 {
    color: #000 !important;
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .info-group {
    margin-bottom: 10px;
  }

  .info-group label {
    color: #666;
  }

  .info-group span {
    color: #000;
  }

  .seat-number {
    background: none !important;
    color: #000 !important;
    padding: 0 !important;
  }

  /* Print-only footer */
  .ticket-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #000;
    text-align: center;
    font-size: 10pt;
    color: #666;
  }
}

.print-only {
  display: none;
}
</style>
