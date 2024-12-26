<template>
  <div class="home-container">
    <div class="search-section">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="search-box">
              <h2>Tìm chuyến xe</h2>
              <!-- Search Form -->
              <div class="search-form">
                <div class="form-group">
                  <label>Tuyến đường</label>
                  <select
                    v-model="searchForm.routeId"
                    class="form-select"
                    :class="{ 'is-invalid': errors.routeId }"
                  >
                    <option value="">Chọn tuyến đường</option>
                    <option
                      v-for="route in routes"
                      :key="route.routeId"
                      :value="route.routeId"
                    >
                      {{ route.routeName }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.routeId">
                    {{ errors.routeId }}
                  </div>
                </div>

                <div class="form-group">
                  <label>Ngày khởi hành</label>
                  <input
                    type="date"
                    v-model="searchForm.departureDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.departureDate }"
                    :min="minDate"
                  >
                  <div class="invalid-feedback" v-if="errors.departureDate">
                    {{ errors.departureDate }}
                  </div>
                </div>

                <button
                  class="search-btn"
                  @click="searchTrips"
                  :disabled="loading"
                >
                  <i class="fas fa-search"></i>
                  {{ loading ? 'Đang tìm...' : 'Tìm chuyến xe' }}
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="image-container">
              <img src="/images/homepage/Traveller 1.svg" alt="Traveller" class="traveller-img">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="results-section" v-if="searchPerformed">
      <div class="container">
        <div class="results-header">
          <h3>
            {{ searchResults.length > 0 ? 'Chuyến xe phù hợp' : 'Không tìm thấy chuyến xe nào' }}
          </h3>
          <p v-if="selectedRoute">
            Tuyến: {{ selectedRoute.routeName }} -
            Ngày: {{ formatDate(searchForm.departureDate) }}
          </p>
        </div>

        <div class="results-list">
          <TripCard
            v-for="trip in searchResults"
            :key="trip.tripId"
            :trip="trip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TripCard from '@/components/TripCard.vue'
import api from '@/services/api'

// State
const routes = ref([])
const searchResults = ref([])
const loading = ref(false)
const searchPerformed = ref(false)
const errors = ref({})

const searchForm = ref({
  routeId: '',
  departureDate: ''
})

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const selectedRoute = computed(() => {
  if (!searchForm.value.routeId) return null
  return routes.value.find(r => r.routeId === searchForm.value.routeId)
})

// Methods
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!searchForm.value.routeId) {
    errors.value.routeId = 'Vui lòng chọn tuyến đường'
    isValid = false
  }

  if (!searchForm.value.departureDate) {
    errors.value.departureDate = 'Vui lòng chọn ngày khởi hành'
    isValid = false
  }

  return isValid
}

const searchTrips = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    const response = await api.get('/trips/search', {
      params: {
        routeId: searchForm.value.routeId,
        departureDate: searchForm.value.departureDate
      }
    })
    searchResults.value = response
    searchPerformed.value = true
  } catch (error) {
    console.error('Error searching trips:', error)
    alert('Có lỗi xảy ra khi tìm kiếm chuyến xe')
  } finally {
    loading.value = false
  }
}

const fetchRoutes = async () => {
  try {
    const response = await api.get('/routes/all')
    routes.value = response.filter(route => route.routeStatus === 'active')
  } catch (error) {
    console.error('Error fetching routes:', error)
    alert('Có lỗi xảy ra khi tải danh sách tuyến đường')
  }
}

// Lifecycle
onMounted(() => {
  fetchRoutes()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #FFF8EF;
}

.search-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #fff8ef 0%, #fff 100%);
}

.search-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-box h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.form-select,
.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-btn {
  width: 100%;
  padding: 14px;
  background: #FFA500;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.traveller-img {
  max-width: 100%;
  height: auto;
  animation: moveImage 1s ease-out forwards;
}

.results-section {
  padding: 40px 0;
}

.results-header {
  margin-bottom: 30px;
  text-align: center;
}

.results-header h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.results-header p {
  color: #666;
  font-size: 1.1rem;
}

.results-list {
  max-width: 900px;
  margin: 0 auto;
}

@keyframes moveImage {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .search-section {
    padding: 30px 0;
  }

  .image-container {
    margin-top: 30px;
  }

  .search-box {
    padding: 20px;
  }
}
</style>
