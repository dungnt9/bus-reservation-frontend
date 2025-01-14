<template>
  <div class="register-container">
    <div class="register-box">
      <!-- Step 1: Phone Verification -->
      <div v-if="currentStep === 1">
        <h2>Xác minh số điện thoại</h2>
        <form @submit.prevent="sendOTP">
          <div class="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              v-model="phoneNumber"
              placeholder="Nhập số điện thoại"
              :class="{ 'error': errors.phoneNumber }"
            />
            <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
          </div>
          <button type="submit" :disabled="loading">
            {{ otpSent ? 'Gửi lại OTP' : 'Gửi OTP' }}
          </button>
        </form>

        <div v-if="otpSent" class="otp-section">
          <div class="form-group">
            <label>Gửi OTP</label>
            <input
              type="text"
              v-model="otp"
              placeholder="Nhập OTP"
              maxlength="6"
            />
            <span class="error-message" v-if="errors.otp">{{ errors.otp }}</span>
          </div>
          <button @click="verifyOTP" :disabled="loading">Xác minh OTP</button>
        </div>
      </div>

      <!-- Step 2: Registration Form -->
      <div v-if="currentStep === 2">
        <h2>Nhập thông tin đăng ký</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              v-model="userData.fullName"
              :class="{ 'error': errors.fullName }"
            />
            <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model="userData.email"
              placeholder="Nhập email"
            />
          </div>

          <div class="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              v-model="userData.password_hash"
              placeholder="Nhập mật khẩu"
              :class="{ 'error': errors.password_hash }"
            />
            <span class="error-message" v-if="errors.password_hash">{{ errors.password_hash }}</span>
          </div>

          <div class="form-group">
            <label>Giới tính</label>
            <select v-model="userData.gender">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              v-model="userData.dateOfBirth"
              :class="{ 'error': errors.dateOfBirth }"
            />
            <span class="error-message" v-if="errors.dateOfBirth">{{ errors.dateOfBirth }}</span>
          </div>

          <div class="form-group">
            <label>Địa chỉ</label>
            <textarea
              v-model="userData.address"
            ></textarea>
          </div>

          <button type="submit" :disabled="loading">Đăng ký</button>
        </form>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();
const currentStep = ref(1);
const loading = ref(false);
const errorMessage = ref('');
const phoneNumber = ref('');
const otp = ref('');
const otpSent = ref(false);

const userData = reactive({
  fullName: '',
  phoneNumber: '',
  email: '',
  password_hash: '',
  gender: 'male',
  dateOfBirth: '',
  address: ''
});

const errors = reactive({
  phoneNumber: '',
  otp: '',
  fullName: '',
  password_hash: '',
  dateOfBirth: ''
});

const validatePhoneNumber = () => {
  errors.phoneNumber = '';
  if (!phoneNumber.value) {
    errors.phoneNumber = 'Số điện thoại là bắt buộc';
    return false;
  }
  if (!/^0\d{9}$/.test(phoneNumber.value)) {
    errors.phoneNumber = 'Số điện thoại không hợp lệ (10 số)';
    return false;
  }
  return true;
};

const sendOTP = async () => {
  if (!validatePhoneNumber()) return;

  try {
    loading.value = true;
    errorMessage.value = '';
    await authService.sendOTP(phoneNumber.value);
    otpSent.value = true;
    errorMessage.value = 'Gửi OTP thành công';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

const verifyOTP = async () => {
  if (!otp.value) {
    errors.otp = 'Vui lòng nhập OTP';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    await authService.verifyOTP(phoneNumber.value, otp.value);
    userData.phoneNumber = phoneNumber.value;
    currentStep.value = 2;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

const validateRegistrationForm = () => {
  let isValid = true;
  errors.fullName = '';
  errors.password_hash = '';
  errors.dateOfBirth = '';

  if (!userData.fullName) {
    errors.fullName = 'Tên là bắt buộc';
    isValid = false;
  }

  if (!userData.password_hash || userData.password_hash.length < 6) {
    errors.password_hash = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateRegistrationForm()) return;

  try {
    loading.value = true;
    errorMessage.value = '';
    await authService.register(userData);
    alert('Đăng ký thành công. Vui lòng đăng nhập');
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
}

.register-box {
  margin-top: 30rem;
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1),
              0px -2px 8px rgba(0, 0, 0, 0.05),
              -2px 0px 8px rgba(0, 0, 0, 0.05),
              2px 0px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input, select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

textarea {
  height: 100px;
  resize: vertical;
}

.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #ffac3f, #ffba65);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background: #a5aee9;
  cursor: not-allowed;
}

.otp-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.alert {
  padding: 12px;
  margin: 20px 0;
  border-radius: 8px;
}

.alert-danger {
  background: #ffe6e6;
  color: #ff4444;
  border: 1px solid #ff4444;
}
</style>
