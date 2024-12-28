<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>Thông tin của bạn</h2>

      <!-- Loading spinner -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- View mode -->
      <div v-if="!isEditing && !loading" class="profile-content">
        <div class="info-box">
          <label>Họ và tên</label>
          <div class="info-value">{{ userData.fullName }}</div>
        </div>

        <div class="info-box">
          <label>Số điện thoại</label>
          <div class="info-value">{{ userData.phoneNumber }}</div>
        </div>

        <div class="info-box">
          <label>Email</label>
          <div class="info-value">{{ userData.email || 'Chưa cập nhật' }}</div>
        </div>

        <div class="info-box">
          <label>Giới tính</label>
          <div class="info-value">{{ formatGender(userData.gender) }}</div>
        </div>

        <div class="info-box">
          <label>Ngày sinh</label>
          <div class="info-value">{{ formatDate(userData.dateOfBirth) }}</div>
        </div>

        <div class="info-box">
          <label>Địa chỉ</label>
          <div class="info-value">{{ userData.address || 'Chưa cập nhật' }}</div>
        </div>

        <button @click="startEditing" class="edit-button">
          <i class="fas fa-edit"></i> Chỉnh sửa
        </button>
      </div>

      <!-- Edit mode -->
      <form v-if="isEditing && !loading" @submit.prevent="handleSubmit" class="profile-form">
        <div class="info-box">
          <label>Họ và tên</label>
          <input
            type="text"
            v-model="editForm.fullName"
            required
            class="form-input"
          >
        </div>

        <div class="info-box">
          <label>Số điện thoại</label>
          <input
            type="text"
            v-model="editForm.phoneNumber"
            disabled
            class="form-input"
          >
        </div>

        <div class="info-box">
          <label>Email</label>
          <input
            type="email"
            v-model="editForm.email"
            class="form-input"
          >
        </div>

        <div class="info-box">
          <label>Giới tính</label>
          <select v-model="editForm.gender" class="form-input">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div class="info-box">
          <label>Ngày sinh</label>
          <input
            type="date"
            v-model="editForm.dateOfBirth"
            required
            class="form-input"
          >
        </div>

        <div class="info-box">
          <label>Địa chỉ</label>
          <textarea
            v-model="editForm.address"
            class="form-input"
            rows="3"
          ></textarea>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
          <button type="button" @click="cancelEditing" class="cancel-button">
            <i class="fas fa-times"></i> Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const isEditing = ref(false)
const loading = ref(true)
const error = ref(null)
const userData = ref({})
const editForm = reactive({
  fullName: '',
  phoneNumber: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  address: ''
})

const formatDate = (date) => {
  if (!date) return 'Chưa cập nhật'
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatGender = (gender) => {
  const genderMap = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
  }
  return genderMap[gender] || 'Chưa cập nhật'
}

const fetchUserData = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get(`/users/${authStore.user.userId}`)
    userData.value = response
  } catch (err) {
    error.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
    console.error('Error fetching user data:', err)
  } finally {
    loading.value = false
  }
}

const startEditing = () => {
  Object.assign(editForm, userData.value)
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  Object.assign(editForm, userData.value)
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.put(`/users/${authStore.user.userId}`, editForm)
    userData.value = response
    isEditing.value = false
    // Update user name in auth store if it changed
    if (response.fullName !== authStore.userName) {
      authStore.updateUserName(response.fullName)
    }
  } catch (err) {
    error.value = 'Không thể cập nhật thông tin. Vui lòng thử lại sau.'
    console.error('Error updating user data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUserData)
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: 600;
}

.info-box {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.info-value {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  color: #333;
  min-height: 45px;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.edit-button, .save-button, .cancel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background: #667eea;
  color: white;
  width: 100%;
  margin-top: 20px;
}

.edit-button:hover {
  background: #5a6fe4;
}

.save-button {
  background: #28a745;
  color: white;
  flex: 1;
}

.save-button:hover {
  background: #218838;
}

.cancel-button {
  background: #dc3545;
  color: white;
  flex: 1;
}

.cancel-button:hover {
  background: #c82333;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
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

/* Responsive styles */
@media (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .edit-button, .save-button, .cancel-button {
    width: 100%;
  }
}
</style>
