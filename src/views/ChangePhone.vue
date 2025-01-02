// src/views/ChangePhone.vue
<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>Đổi số điện thoại</h2>

      <div v-if="message" :class="['alert', message.type === 'success' ? 'alert-success' : 'alert-danger']">
        {{ message.text }}
      </div>

      <form @submit.prevent="handleSubmit" class="phone-form">
        <div class="form-group">
          <label>Số điện thoại hiện tại</label>
          <input
            type="tel"
            v-model="formData.currentPhone"
            class="form-input"
            disabled
          >
        </div>

        <div class="form-group">
          <label>Mật khẩu xác thực</label>
          <input
            type="password"
            v-model="formData.password"
            class="form-input"
            required
          >
          <span class="error-message" v-if="errors.password">
            {{ errors.password }}
          </span>
        </div>

        <div class="form-group">
          <label>Số điện thoại mới</label>
          <input
            type="tel"
            v-model="formData.newPhone"
            class="form-input"
            placeholder="Nhập số điện thoại mới"
            required
          >
          <span class="error-message" v-if="errors.newPhone">
            {{ errors.newPhone }}
          </span>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button" :disabled="loading">
            <i class="fas fa-save"></i>
            {{ loading ? 'Đang xử lý...' : 'Tiếp tục' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- OTP Modal -->
  <div class="modal" tabindex="-1" v-if="showOtpModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Xác thực OTP</h5>
          <button type="button" class="btn-close" @click="closeOtpModal"></button>
        </div>
        <div class="modal-body">
          <p>Vui lòng nhập mã OTP được gửi đến số điện thoại {{ formData.newPhone }}</p>
          <input
            type="text"
            class="form-control text-center"
            v-model="otpForm.otp"
            placeholder="Nhập mã 6 số"
            maxlength="6"
            :class="{ 'is-invalid': errors.otp }"
          >
          <div class="error-message" v-if="errors.otp">
            {{ errors.otp }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeOtpModal"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleOtpVerification"
            :disabled="verifying"
          >
            {{ verifying ? 'Đang xác thực...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showOtpModal"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const verifying = ref(false)
const showOtpModal = ref(false)
const message = ref(null)

const errors = reactive({
  password: '',
  newPhone: '',
  otp: ''
})

const formData = reactive({
  currentPhone: '',
  password: '',
  newPhone: ''
})

const otpForm = reactive({
  otp: ''
})

onMounted(() => {
  formData.currentPhone = authStore.user?.phoneNumber || ''
})

// Validate phone number format
const isValidPhoneNumber = (phone) => {
  return /^0\d{9}$/.test(phone);
}

const validatePhoneForm = () => {
  let isValid = true;
  errors.password = '';
  errors.newPhone = '';

  // Validate password
  if (!formData.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu';
    isValid = false;
  }

  // Validate new phone number
  if (!formData.newPhone.trim()) {
    errors.newPhone = 'Vui lòng nhập số điện thoại mới';
    isValid = false;
  } else if (!isValidPhoneNumber(formData.newPhone)) {
    errors.newPhone = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số)';
    isValid = false;
  } else if (formData.newPhone === formData.currentPhone) {
    errors.newPhone = 'Số điện thoại mới phải khác số điện thoại hiện tại';
    isValid = false;
  }

  // Kiểm tra các ký tự đặc biệt và khoảng trắng trong số điện thoại
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (specialCharsRegex.test(formData.newPhone)) {
    errors.newPhone = 'Số điện thoại không được chứa ký tự đặc biệt';
    isValid = false;
  }

  if (formData.newPhone.includes(' ')) {
    errors.newPhone = 'Số điện thoại không được chứa khoảng trắng';
    isValid = false;
  }

  return isValid;
}

const validateOtp = () => {
  let isValid = true
  errors.otp = ''

  // Validate OTP format
  if (!otpForm.otp) {
    errors.otp = 'Vui lòng nhập mã OTP'
    isValid = false
  } else if (!/^\d+$/.test(otpForm.otp)) {
    errors.otp = 'Mã OTP chỉ được chứa chữ số'
    isValid = false
  } else if (otpForm.otp.length !== 6) {
    errors.otp = 'Mã OTP phải có đúng 6 chữ số'
    isValid = false
  }

  // Kiểm tra khoảng trắng và ký tự đặc biệt
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
  if (specialCharsRegex.test(otpForm.otp)) {
    errors.otp = 'Mã OTP không được chứa ký tự đặc biệt'
    isValid = false
  }

  if (otpForm.otp.includes(' ')) {
    errors.otp = 'Mã OTP không được chứa khoảng trắng'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  // Clear previous messages
  message.value = null

  // Validate form first
  if (!validatePhoneForm()) {
    // Show error message at form level if needed
    message.value = {
      type: 'error',
      text: 'Vui lòng kiểm tra lại thông tin nhập vào'
    }
    return
  }

  try {
    loading.value = true
    await api.post('/auth/request-phone-change', {
      userId: authStore.user.userId,
      currentPhone: formData.currentPhone,
      newPhone: formData.newPhone,
      password: formData.password
    })

    showOtpModal.value = true
  } catch (err) {
    message.value = {
      type: 'error',
      text: err.response?.data?.message || 'Đã có lỗi xảy ra'
    }

    // Handle specific error cases
    if (err.response?.status === 409) {
      errors.newPhone = 'Số điện thoại này đã được đăng ký bởi người dùng khác'
    } else if (err.response?.status === 401) {
      errors.password = 'Mật khẩu không chính xác'
    }
  } finally {
    loading.value = false
  }
}

const handleOtpVerification = async () => {
  // Clear previous errors
  errors.otp = ''

  if (!validateOtp()) {
    return
  }

  try {
    verifying.value = true
    await api.post('/auth/verify-phone-change', {
      userId: authStore.user.userId,
      phoneNumber: formData.newPhone,
      otp: otpForm.otp
    })

    // Ẩn modal ngay lập tức khi thành công
    showOtpModal.value = false

    message.value = {
      type: 'success',
      text: 'Đổi số điện thoại thành công. Vui lòng đăng nhập lại.'
    }

    // Logout sau 2 giây
    setTimeout(() => {
      authStore.logout()
      router.push('/login')
    }, 2000)
  } catch (err) {
    if (err.response?.status === 400) {
      errors.otp = 'Mã OTP không chính xác'
    } else if (err.response?.status === 408) {
      errors.otp = 'Mã OTP đã hết hạn'
    } else {
      errors.otp = err.response?.data?.message || 'Xác thực OTP thất bại'
    }
  } finally {
    verifying.value = false
  }
}

const closeOtpModal = () => {
  showOtpModal.value = false
  otpForm.otp = ''
  errors.otp = ''
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
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  display: block;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 12px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 1rem;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
}

.btn-primary:disabled {
  background: #6c757d;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
}
</style>
