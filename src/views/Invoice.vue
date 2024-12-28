<template>
  <div class="invoice-container">
    <div class="invoice-card">
      <h2 class="page-title">Hóa đơn của tôi</h2>

      <!-- Loading state -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- No invoices message -->
      <div v-if="!loading && invoices.length === 0" class="no-invoices">
        <i class="fas fa-receipt"></i>
        <p>Bạn chưa có hóa đơn nào</p>
      </div>

      <!-- Invoices list -->
      <div v-if="invoices.length > 0" class="invoices-list">
        <div v-for="invoice in sortedInvoices" :key="invoice.invoiceId" class="invoice-item">
          <div class="invoice-header">
            <div class="invoice-info">
              <span class="invoice-id">Mã HĐ: #{{ invoice.invoiceId }}</span>
              <span class="invoice-date">{{ formatDate(invoice.invoiceDate) }}</span>
            </div>
            <div :class="['payment-status', invoice.paymentStatus === 'paid' ? 'paid' : 'pending']">
              {{ invoice.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán' }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="trip-info">
              <h4>{{ invoice.routeName }}</h4>
              <p class="trip-id">Mã chuyến: #{{ invoice.tripId }}</p>
              <p class="vehicle">
                <i class="fas fa-bus"></i>
                {{ invoice.plateNumber }}
              </p>
            </div>

            <div class="seats-info">
              <div class="label">Ghế đã đặt:</div>
              <div class="seats">
                <span v-for="seat in invoice.selectedSeats" :key="seat" class="seat-number">
                  {{ seat }}
                </span>
              </div>
            </div>

            <div class="payment-info">
              <div class="total-price">
                {{ formatCurrency(invoice.totalPrice) }}
              </div>
              <div class="payment-method">
                <i :class="['fas', invoice.paymentMethod === 'cash' ? 'fa-money-bill' : 'fa-credit-card']"></i>
                {{ invoice.paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const invoices = ref([])
const loading = ref(true)
const error = ref(null)

// Sort invoices by date, newest first
const sortedInvoices = computed(() => {
  return [...invoices.value].sort((a, b) => {
    return new Date(b.invoiceDate) - new Date(a.invoiceDate)
  })
})

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Fetch invoices
const fetchInvoices = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get(`/invoices/customer/${authStore.user.userId}`)
    invoices.value = response
  } catch (err) {
    error.value = 'Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.'
    console.error('Error fetching invoices:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchInvoices)
</script>

<style scoped>
.invoice-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.invoice-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
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
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-invoices {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-invoices i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ddd;
}

.invoice-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.invoice-info {
  display: flex;
  gap: 20px;
}

.invoice-id {
  font-weight: 500;
  color: #1a73e8;
}

.invoice-date {
  color: #666;
}

.payment-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.payment-status.paid {
  background: #d4edda;
  color: #155724;
}

.payment-status.pending {
  background: #fff3cd;
  color: #856404;
}

.invoice-details {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 20px;
}

.trip-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.trip-id, .vehicle {
  color: #666;
  margin: 5px 0;
}

.vehicle i {
  margin-right: 8px;
  color: #1a73e8;
}

.seats-info {
  padding: 0 20px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.seats-info .label {
  color: #666;
  margin-bottom: 8px;
}

.seats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seat-number {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.payment-info {
  text-align: right;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 8px;
}

.payment-method {
  color: #666;
}

.payment-method i {
  margin-right: 8px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

@media (max-width: 768px) {
  .invoice-details {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .seats-info {
    padding: 15px 0;
    border-left: none;
    border-right: none;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .payment-info {
    text-align: left;
  }

  .invoice-info {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
