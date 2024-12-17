<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <!-- <img src="/bus_logo.svg" alt="Bus Logo" class="logo" /> -->
        <h1>Welcome Back</h1>
        <p>Please sign in to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            v-model="phoneNumber"
            placeholder="Enter your phone number"
            :class="{ 'error': errors.phoneNumber }"
          />
          <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
        </div>

        <div class="form-group">
          <label>Password</label>
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
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const phoneNumber = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = reactive({
  phoneNumber: '',
  password: ''
})

const validateForm = () => {
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

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    errorMessage.value = ''

    const response = await authStore.login(phoneNumber.value, password.value)

    const userRole = response.user.userRole
    if (userRole === 'customer') {
      router.push('/')
    } else if (userRole === 'driver' || userRole === 'assistant') {
      router.push('/track')
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 5px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background: #5a6fe4;
}

.login-button:disabled {
  background: #a5aee9;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
