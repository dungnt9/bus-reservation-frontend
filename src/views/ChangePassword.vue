<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>Đổi mật khẩu</h2>

      <div v-if="message" :class="['alert', message.type === 'success' ? 'alert-success' : 'alert-danger']">
        {{ message.text }}
      </div>

      <form @submit.prevent="handleSubmit" class="password-form">
        <div class="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            v-model="formData.currentPassword"
            class="form-input"
            required
          >
          <span class="error-message" v-if="errors.currentPassword">
            {{ errors.currentPassword }}
          </span>
        </div>

        <div class="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            v-model="formData.newPassword"
            class="form-input"
            required
          >
          <span class="error-message" v-if="errors.newPassword">
            {{ errors.newPassword }}
          </span>
        </div>

        <div class="form-group">
          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            v-model="formData.confirmPassword"
            class="form-input"
            required
          >
          <span class="error-message" v-if="errors.confirmPassword">
            {{ errors.confirmPassword }}
          </span>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button" :disabled="loading">
            <i class="fas fa-save"></i>
            {{ loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
          </button>
          <router-link to="/profile" class="cancel-button">
            <i class="fas fa-times"></i> Hủy
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const message = ref(null)
const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''

  if (!formData.currentPassword) {
    errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    isValid = false
  }

  if (!formData.newPassword) {
    errors.newPassword = 'Vui lòng nhập mật khẩu mới'
    isValid = false
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    isValid = false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới'
    isValid = false
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    await api.post(`/users/${authStore.user.userId}/change-password`, {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })

    message.value = {
      type: 'success',
      text: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
    }

    // Logout sau 2 giây
    setTimeout(() => {
      authStore.logout()
      router.push('/login')
    }, 2000)
  } catch (err) {
    message.value = {
      type: 'error',
      text: err.response?.data?.message || 'Đã có lỗi xảy ra'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
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

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.save-button, .cancel-button {
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
  flex: 1;
  text-decoration: none;
}

.save-button {
  background: #28a745;
  color: white;
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.cancel-button {
  background: #dc3545;
  color: white;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}
</style>
