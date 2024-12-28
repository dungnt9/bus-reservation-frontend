<template>
  <div class="bg-white p-4 rounded-lg border">
    <h2 class="text-primary fw-bold mb-4">Theo dõi chuyến xe của bạn</h2>

    <table class="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th class="title-table text-center">Tuyến xe</th>
          <th class="title-table text-center">Giờ khởi hành (dự kiến)</th>
          <th class="title-table text-center">Giờ đến (dự kiến)</th>
          <th class="title-table text-center">Giờ khởi hành thực tế</th>
          <th class="title-table text-center">Giờ đến thực tế</th>
          <th class="title-table text-center">Trạng thái</th>
          <th class="title-table text-center action">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.tripId">
          <td class="text-center">{{ trip.routeName }}</td>
          <td class="text-center">{{ formatDateTime(trip.scheduledDeparture) }}</td>
          <td class="text-center">{{ formatDateTime(trip.scheduledArrival) }}</td>
          <td class="text-center">{{ formatDateTime(trip.actualDeparture) }}</td>
          <td class="text-center">{{ formatDateTime(trip.actualArrival) }}</td>
          <td class="text-center">
            <span :class="getTripStatusClass(trip.tripStatus)">
              {{ getTripStatusText(trip.tripStatus) }}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm" @click="openModal(trip)">
              <i class="fas fa-edit"></i> Cập nhật
            </button>
          </td>
        </tr>
        <tr v-if="trips.length === 0">
          <td colspan="7" class="text-center">Không có chuyến xe nào</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="updateModal" tabindex="-1" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật chuyến xe</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tuyến xe</label>
                <input
                  type="text"
                  class="form-control"
                  :value="currentTrip?.routeName"
                  disabled
                />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Giờ khởi hành (dự kiến)</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="formatDateTime(currentTrip?.scheduledDeparture)"
                    disabled
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Giờ đến (dự kiến)</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="formatDateTime(currentTrip?.scheduledArrival)"
                    disabled
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Thời gian khởi hành thực tế</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.actualDeparture }"
                  v-model="form.actualDeparture"
                />
                <div class="invalid-feedback" v-if="validationErrors.actualDeparture">
                  {{ validationErrors.actualDeparture }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Thời gian đến thực tế</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.actualArrival }"
                  v-model="form.actualArrival"
                />
                <div class="invalid-feedback" v-if="validationErrors.actualArrival">
                  {{ validationErrors.actualArrival }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Trạng thái chuyến xe</label>
                <select
                  class="form-select"
                  v-model="form.tripStatus"
                >
                  <option value="in_progress">Đang chạy</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const trips = ref([])
const currentTrip = ref(null)
const modal = ref(null)
const modalInstance = ref(null)
const validationErrors = ref({})

const form = ref({
  actualDeparture: '',
  actualArrival: '',
  tripStatus: ''
})

const fetchTrips = async () => {
  try {
    const userId = authStore.user?.userId
    const response = await api.get(`/trips/my-trips/${userId}`)
    trips.value = response
  } catch (error) {
    console.error('Error fetching trips:', error)
    alert('Có lỗi xảy ra khi tải danh sách chuyến xe')
  }
}

const formatDateTime = (datetime) => {
  if (!datetime) return '-'
  // Chuyển đổi thành múi giờ địa phương khi hiển thị
  return new Date(datetime).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getTripStatusText = (status) => {
  const statusMap = {
    'in_progress': 'Đang chạy',
    'completed': 'Đã hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || status
}

const getTripStatusClass = (status) => {
  const classMap = {
    'in_progress': 'badge bg-primary',
    'completed': 'badge bg-success',
    'cancelled': 'badge bg-danger'
  }
  return classMap[status] || 'badge bg-secondary'
}

const validateForm = () => {
  validationErrors.value = {}
  let isValid = true

  if (form.value.actualDeparture && form.value.actualArrival) {
    const departureTime = new Date(form.value.actualDeparture)
    const arrivalTime = new Date(form.value.actualArrival)
    if (arrivalTime <= departureTime) {
      validationErrors.value.actualArrival = 'Thời gian đến phải sau thời gian khởi hành'
      isValid = false
    }
  }

  return isValid
}

const openModal = (trip) => {
  currentTrip.value = trip
  form.value = {
    actualDeparture: trip.actualDeparture ?
      trip.actualDeparture.slice(0, 16) : '', // Lấy trực tiếp từ response không chuyển đổi
    actualArrival: trip.actualArrival ?
      trip.actualArrival.slice(0, 16) : '',
    tripStatus: trip.tripStatus
  }
  validationErrors.value = {}
  modalInstance.value.show()
}

const closeModal = () => {
  modalInstance.value.hide()
  currentTrip.value = null
  validationErrors.value = {}
  form.value = {
    actualDeparture: '',
    actualArrival: '',
    tripStatus: ''
  }
}

const handleSubmit = async () => {
  try {
    if (!validateForm()) return

    const updateData = {
      actualDeparture: form.value.actualDeparture ?
        form.value.actualDeparture : null,
      actualArrival: form.value.actualArrival ?
        form.value.actualArrival : null,
      tripStatus: form.value.tripStatus
    }

    await api.put(`/trips/${currentTrip.value.tripId}`, updateData)
    await fetchTrips()
    closeModal()
    alert('Cập nhật thành công!')
  } catch (error) {
    console.error('Error updating trip:', error)
    alert('Có lỗi xảy ra khi cập nhật chuyến xe')
  }
}

onMounted(() => {
  modal.value = document.getElementById('updateModal')
  modalInstance.value = new Modal(modal.value)
  fetchTrips()
})
</script>

<style scoped>
.border {
  border-radius: 10px;
  margin: 30px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
}

.title-table {
  background-color: #83c3ff;
  color: white;
}

.action {
  width: 90px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}

.badge {
  font-size: 0.875em;
  padding: 0.5em 0.75em;
}
</style>
