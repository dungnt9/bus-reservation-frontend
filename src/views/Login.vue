<template>
  <div :class="['login-container', { 'popup-mode': popupMode }]">
    <div class="login-box">
      <!-- Normal Login Form -->
      <div v-if="!showForgotPassword" class="login-content">
        <div class="login-header">
          <img src="/bus_logo.svg" alt="Bus Logo" class="logo" />
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>
              <i class="fas fa-phone"></i>
              Phone Number
            </label>
            <input
              type="text"
              v-model="phoneNumber"
              placeholder="Enter your phone number"
              :class="{ 'error': errors.phoneNumber }"
              maxlength="10"
            />
            <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-lock"></i>
              Password
            </label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
                :class="{ 'error': errors.password }"
              />
              <button
                type="button"
                class="toggle-password"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
            <div class="forgot-password">
              <a href="#" @click.prevent="toggleForgotPassword">Forgot Password?</a>
            </div>
          </div>

          <div class="alert-error" v-if="errorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <div v-else class="spinner"></div>
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
        </div>
      </div>

      <!-- Forgot Password Form -->
      <div v-else class="login-content">
        <div class="login-header">
          <div class="logo-container">
            <img src="/bus_logo.svg" alt="Bus Logo" class="logo" />
          </div>
          <h1>Reset Password</h1>
          <p v-if="!otpSent">Enter your phone number to receive OTP</p>
          <p v-else>Enter OTP and new password</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="login-form">
          <div v-if="!otpSent" class="form-group">
            <label>
              <i class="fas fa-phone"></i>
              Phone Number
            </label>
            <input
              type="text"
              v-model="resetPhone"
              placeholder="Enter your phone number"
              :class="{ 'error': errors.resetPhone }"
              maxlength="10"
            />
            <span class="error-message" v-if="errors.resetPhone">{{ errors.resetPhone }}</span>
          </div>

          <template v-else>
            <div class="form-group">
              <label>
                <i class="fas fa-key"></i>
                OTP Code
              </label>
              <input
                type="text"
                v-model="otp"
                placeholder="Enter OTP code"
                :class="{ 'error': errors.otp }"
                maxlength="6"
              />
              <span class="error-message" v-if="errors.otp">{{ errors.otp }}</span>
            </div>

            <div class="form-group">
              <label>
                <i class="fas fa-lock"></i>
                New Password
              </label>
              <div class="password-input">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  v-model="newPassword"
                  placeholder="Enter new password"
                  :class="{ 'error': errors.newPassword }"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="toggleNewPassword"
                >
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span class="error-message" v-if="errors.newPassword">{{ errors.newPassword }}</span>
            </div>
          </template>

          <div class="alert-error" v-if="resetErrorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ resetErrorMessage }}
          </div>

          <button type="submit" class="login-button" :disabled="resetLoading">
            <span v-if="!resetLoading">{{ !otpSent ? 'Send OTP' : 'Reset Password' }}</span>
            <div v-else class="spinner"></div>
          </button>

          <button @click.prevent="toggleForgotPassword" class="back-button">
            <i class="fas fa-arrow-left"></i> Back to Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/authService'

const props = defineProps({
  popupMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['login-success']);

const router = useRouter()
const authStore = useAuthStore()

// Login form data
const phoneNumber = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Reset password form data
const showForgotPassword = ref(false)
const resetPhone = ref('')
const otp = ref('')
const newPassword = ref('')
const showNewPassword = ref(false)
const resetLoading = ref(false)
const resetErrorMessage = ref('')
const otpSent = ref(false)

const errors = reactive({
  phoneNumber: '',
  password: '',
  resetPhone: '',
  otp: '',
  newPassword: ''
})

// Toggle functions
const togglePassword = () => showPassword.value = !showPassword.value
const toggleNewPassword = () => showNewPassword.value = !showNewPassword.value
const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value
  resetForm()
}

// Reset form function
const resetForm = () => {
  resetPhone.value = ''
  otp.value = ''
  newPassword.value = ''
  resetErrorMessage.value = ''
  otpSent.value = false
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Validation functions
const validateLoginForm = () => {
  let isValid = true
  errors.phoneNumber = ''
  errors.password = ''

  if (!phoneNumber.value) {
    errors.phoneNumber = 'Phone number is required'
    isValid = false
  } else if (!/^\d{10}$/.test(phoneNumber.value)) {
    errors.phoneNumber = 'Please enter a valid 10-digit phone number'
    isValid = false
  }

  if (!password.value) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const validateResetForm = () => {
  let isValid = true

  if (!otpSent.value) {
    if (!resetPhone.value) {
      errors.resetPhone = 'Phone number is required'
      isValid = false
    } else if (!/^\d{10}$/.test(resetPhone.value)) {
      errors.resetPhone = 'Please enter a valid 10-digit phone number'
      isValid = false
    }
  } else {
    if (!otp.value) {
      errors.otp = 'OTP is required'
      isValid = false
    } else if (!/^\d{6}$/.test(otp.value)) {
      errors.otp = 'OTP must be 6 digits'
      isValid = false
    }
    if (!newPassword.value) {
      errors.newPassword = 'New password is required'
      isValid = false
    } else if (newPassword.value.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters'
      isValid = false
    }
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLoginForm()) return

  try {
    loading.value = true
    errorMessage.value = ''

    const response = await authStore.login(phoneNumber.value, password.value)

    if (props.popupMode) {
      emit('login-success');
    } else {
      const userRole = response.user.userRole
      if (userRole === 'customer') {
        router.push('/')
      } else if (userRole === 'driver' || userRole === 'assistant') {
        router.push('/track')
      }
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!validateResetForm()) return

  try {
    resetLoading.value = true
    resetErrorMessage.value = ''

    if (!otpSent.value) {
      // Send OTP
      await authService.forgotPassword(resetPhone.value)
      otpSent.value = true
    } else {
      // Reset password
      await authService.resetPassword(resetPhone.value, otp.value, newPassword.value)
      alert('Password reset successful. Please login with your new password.')
      toggleForgotPassword()
    }
  } catch (error) {
    resetErrorMessage.value = error.response?.data?.message || 'An error occurred'
  } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
}

.popup-mode {
  min-height: auto;
  padding: 0;
  background: none;
}

.popup-mode .login-box {
  box-shadow: none;
  padding: 20px;
  margin: 0;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
  padding: 40px;
  transition: transform 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  object-fit: contain;
}

.login-header h1 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-header p {
  color: #718096;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.form-group label i {
  color: #667eea;
  width: 16px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8faff;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0;
}

.toggle-password:hover {
  color: #667eea;
}

.forgot-password {
  text-align: right;
  margin-top: 8px;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: #5a6fe4;
  text-decoration: underline;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

input.error {
  border-color: #e53e3e;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 10px;
  color: #e53e3e;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #ffac3f, #ffba65);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-button {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: none;
  border: 2px solid #667eea;
  border-radius: 10px;
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.back-button:hover {
  background: #f0f4ff;
}

.back-button i {
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
  color: #718096;
}

.login-footer p {
  font-size: 14px;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.login-footer a:hover {
  color: #5a6fe4;
  text-decoration: underline;
}

.login-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }

  .logo-container {
    width: 80px;
    height: 80px;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .form-group input {
    padding: 10px 14px;
  }

  .login-button {
    padding: 12px;
    font-size: 14px;
  }

  .back-button {
    padding: 10px;
    font-size: 13px;
  }

  .forgot-password {
    font-size: 13px;
  }

  .login-footer {
    margin-top: 25px;
    padding-top: 15px;
  }

  .login-footer p {
    font-size: 13px;
  }
}

@media (prefers-color-scheme: dark) {
  .login-box {
    background: rgba(255, 255, 255, 0.98);
  }

  .form-group input {
    background: #ffffff;
  }

  .logo-container {
    background: #ffffff;
  }
}
</style>
