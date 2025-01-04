<template>
  <div class="payment-container">
    <div class="container">
      <div v-if="!paymentSuccess" class="payment-card">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">Xác nhận thanh toán</h3>

            <!-- Booking Details -->
            <div class="booking-details mb-4">
              <h5 class="mb-3">Chi tiết đặt vé</h5>
              <div class="info-table">
                <div class="info-row">
                  <div class="info-label">Tuyến đường:</div>
                  <div class="info-value">{{ bookingInfo?.routeName }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Thời gian:</div>
                  <div class="info-value">{{ formatDateTime(bookingInfo?.departureTime) }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Số ghế:</div>
                  <div class="info-value">{{ selectedSeatsDisplay }}</div>
                </div>
                <div class="info-row total">
                  <div class="info-label">Tổng tiền:</div>
                  <div class="info-value price">{{ formatCurrency(bookingInfo?.totalPrice) }}</div>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="payment-methods mb-4">
              <h5 class="mb-3">Phương thức thanh toán</h5>
              <div class="d-flex gap-3">
                <div
                  class="payment-method-option"
                  :class="{ 'active': selectedMethod === 'cash' }"
                  @click="selectedMethod = 'cash'"
                >
                  <i class="fas fa-money-bill-wave mb-2"></i>
                  <span>Tiền mặt</span>
                </div>
                <div
                  class="payment-method-option"
                  :class="{ 'active': selectedMethod === 'card' }"
                  @click="selectedMethod = 'card'"
                >
                  <i class="fas fa-credit-card mb-2"></i>
                  <span>Thẻ ngân hàng</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-3">
              <button
                class="btn btn-outline-secondary flex-grow-1"
                @click="goBack"
                :disabled="processing"
              >
                Quay lại
              </button>
              <button
                class="btn btn-primary flex-grow-1"
                @click="confirmPayment"
                :disabled="processing"
              >
                {{ processing ? 'Đang xử lý...' : 'Xác nhận thanh toán' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Card -->
      <div v-else class="success-card">
        <div class="card shadow text-center">
          <div class="card-body">
            <div class="success-icon mb-4">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="mb-3">Thanh toán thành công!</h3>
            <p class="mb-4">Cảm ơn bạn đã đặt vé. Mã hóa đơn của bạn là: #{{ invoiceId }}</p>
            <div class="d-flex gap-3 justify-content-center">
              <button class="btn btn-primary" @click="viewTickets">
                <i class="fas fa-ticket-alt me-2"></i>
                Xem vé
              </button>
              <button class="btn btn-primary" @click="viewInvoice">
                Xem hóa đơn
              </button>
              <button class="btn btn-outline-primary" @click="goHome">
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const bookingInfo = ref(null);
const selectedMethod = ref('cash');
const paymentSuccess = ref(false);
const processing = ref(false);
const invoiceId = ref(null);

onMounted(() => {
  const storedBooking = localStorage.getItem('bookingInfo');
  if (!storedBooking) {
    router.push('/');
    return;
  }
  bookingInfo.value = JSON.parse(storedBooking);
});

const selectedSeatsDisplay = computed(() => {
  return bookingInfo.value?.selectedSeats?.join(', ') || 'Chưa chọn ghế';
});

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return new Date(datetime).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatCurrency = (amount) => {
  if (!amount) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const confirmPayment = async () => {
  if (!bookingInfo.value) return;

  try {
    processing.value = true;
    const user = authStore.user;

    if (!user?.userId) {
      throw new Error('Vui lòng đăng nhập để tiếp tục');
    }

    // Tạo invoice
    const response = await api.post('/invoices/customer/' + user.userId, {
      tripId: bookingInfo.value.tripId,
      selectedSeats: bookingInfo.value.selectedSeats.map(Number),
      paymentStatus: 'paid',
      paymentMethod: selectedMethod.value
    });

    invoiceId.value = response.invoiceId;
    paymentSuccess.value = true;

    // Clear booking info
    localStorage.removeItem('bookingInfo');

  } catch (error) {
    console.error('Payment failed:', error);
    alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
  } finally {
    processing.value = false;
  }
};

const goBack = () => {
  router.back();
};

const viewTickets = () => {
  router.push('/tickets');
};

const viewInvoice = () => {
  router.push('/invoice');
};

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.payment-container {
  background-color: #ffffff;
  padding: 2rem 0;
}

.payment-card .card,
.success-card .card {
  border: none;
  border-radius: 15px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
}

.info-table {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #6c757d;
}

.info-value {
  font-weight: 500;
  color: #212529;
}

.total {
  border-top: 1px solid #dee2e6;
  margin-top: 1rem;
  padding-top: 1rem;
}

.price {
  color: #0d6efd;
  font-size: 1.2rem;
  font-weight: 600;
}

.payment-method-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-option:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.payment-method-option.active {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.payment-method-option i {
  font-size: 2rem;
  color: #0d6efd;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.success-icon {
  font-size: 5rem;
  color: #198754;
}

.success-card .card {
  padding: 2rem;
}

@media (max-width: 768px) {
  .payment-container {
    padding: 1rem;
  }

  .payment-method-option {
    padding: 1rem;
  }
}
</style>
