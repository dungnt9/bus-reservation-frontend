<template>
  <div class="trip-card">
    <!-- Thông tin chuyến xe -->
    <div class="trip-info">
      <div class="route-info">
        <h3>{{ trip.routeName }}</h3>
        <div class="schedule">
          <i class="fas fa-clock"></i>
          <span>{{ formatDateTime(trip.scheduledDeparture) }}</span>
        </div>
        <div class="vehicle-info">
          <i class="fas fa-bus"></i>
          <span>{{ trip.vehiclePlateNumber }}</span>
        </div>
      </div>
      <div class="price-info">
        <div class="price">{{ formatCurrency(trip.ticketPrice) }}</div>
        <div class="seats">
          <i class="fas fa-chair"></i>
          <span>{{ trip.availableSeats }} ghế trống</span>
        </div>
        <button
          class="select-btn"
          @click="handleSelectClick"
          :disabled="trip.availableSeats === 0"
        >
          {{ trip.availableSeats === 0 ? 'Hết ghế' : 'Chọn chỗ' }}
        </button>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal
      v-if="showLoginModal"
      :show="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />

    <!-- Phần chọn ghế -->
    <div v-if="showSeatSelection" class="seat-selection">
      <div class="seat-selection-header">
        <h4>Chọn ghế</h4>
        <button class="close-btn" @click="closeSeatSelection">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <Seat
        v-model="selectedSeats"
        :booked-seats="bookedSeats"
        @seatSelected="handleSeatSelection"
      />

      <!-- Thông tin đặt chỗ -->
      <div class="booking-info">
        <div class="selected-seats-info">
          <p>Ghế đã chọn: <span>{{ selectedSeatsDisplay }}</span></p>
          <p>Tổng tiền: <strong>{{ formatCurrency(totalPrice) }}</strong></p>
        </div>
        <div class="booking-actions">
          <button class="cancel-btn" @click="closeSeatSelection">Hủy</button>
          <button
            class="continue-btn"
            @click="proceedToPayment"
            :disabled="selectedSeats.length === 0"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth';
import Seat from './Seat.vue';
import LoginModal from './LoginModal.vue';
import api from '@/services/api';
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();
const showLoginModal = ref(false);
const showSeatSelection = ref(false);
const selectedSeats = ref([]);
const bookedSeats = ref([]);

// Computed properties
const selectedSeatsDisplay = computed(() => {
  return selectedSeats.value.length > 0
    ? [...selectedSeats.value].sort((a, b) => a - b).join(', ')
    : 'Chưa chọn ghế';
});

const totalPrice = computed(() => {
  return selectedSeats.value.length * props.trip.ticketPrice;
});

// Methods
const handleSelectClick = async () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true;
    return;
  }

  await loadSeats();
};

const loadSeats = async () => {
  try {
    const response = await api.get(`/trips/${props.trip.tripId}/seats`);
    bookedSeats.value = response.seats
      .filter(seat => seat.status === 'booked')
      .map(seat => parseInt(seat.seatNumber));
    showSeatSelection.value = true;
  } catch (error) {
    console.error('Error fetching seats:', error);
    alert('Có lỗi xảy ra khi tải thông tin ghế');
  }
};

const handleLoginSuccess = async () => {
  await loadSeats();
};

const handleSeatSelection = (seats) => {
  selectedSeats.value = seats;
};

const closeSeatSelection = () => {
  showSeatSelection.value = false;
  selectedSeats.value = [];
};

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const proceedToPayment = () => {
  if (selectedSeats.value.length === 0) {
    alert('Vui lòng chọn ít nhất một ghế');
    return;
  }

  // Lưu thông tin đặt vé vào localStorage
  const bookingInfo = {
    tripId: props.trip.tripId,
    selectedSeats: selectedSeats.value,
    totalPrice: totalPrice.value,
    routeName: props.trip.routeName,
    departureTime: props.trip.scheduledDeparture
  };
  localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));

  // Chuyển đến trang thanh toán
  router.push('/payment');
};
</script>

<style scoped>
.trip-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trip-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.route-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.schedule, .vehicle-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
}

.schedule i, .vehicle-info i {
  color: #1a73e8;
}

.price-info {
  text-align: right;
}

.price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 8px;
}

.seats {
  color: #666;
  margin-bottom: 12px;
}

.select-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.select-btn:hover:not(:disabled) {
  background: #1557b0;
}

.select-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Seat Selection Styles */
.seat-selection {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.seat-selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.seat-selection-header h4 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.booking-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.selected-seats-info {
  margin-bottom: 15px;
}

.selected-seats-info p {
  margin: 5px 0;
  color: #666;
}

.selected-seats-info strong {
  color: #1a73e8;
  font-size: 1.2rem;
}

.booking-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .continue-btn {
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.continue-btn {
  background: #28a745;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.continue-btn:hover:not(:disabled) {
  background: #218838;
}

.continue-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
