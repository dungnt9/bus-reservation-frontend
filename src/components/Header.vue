<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <a class="navbar-brand" href="/">Xe khách Hải Phòng</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>

          <!-- Show based on user role -->
          <template v-if="authStore.isAuthenticated">
            <!-- For Customers -->
            <template v-if="authStore.userRole === 'customer'">
              <li class="nav-item">
                <router-link class="nav-link" to="/tickets">
                  <i class="fas fa-ticket-alt"></i>
                  Vé của tôi
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/invoice">
                  <i class="fas fa-file-invoice"></i>
                  Hóa đơn của tôi
                </router-link>
              </li>
            </template>

            <!-- For Drivers and Assistants -->
            <template v-if="['driver', 'assistant'].includes(authStore.userRole)">
              <li class="nav-item">
                <router-link class="nav-link" to="/track">Theo dõi chuyến xe</router-link>
              </li>
            </template>

            <!-- User info and logout -->
            <li class="nav-item dropdown" ref="dropdownRef">
              <div class="user-profile" @click.stop="toggleDropdown">
                <span class="nav-link user-name">{{ authStore.userName }}</span>
                <i class="fas fa-chevron-down" :class="{ 'rotate': showDropdown }"></i>
              </div>
              <div class="dropdown-menu" :class="{ 'show': showDropdown }">
                <router-link to="/profile" class="dropdown-item" @click="showDropdown = false">
                  <i class="fas fa-user"></i> Thông tin của bạn
                </router-link>
                <router-link to="/change-password" class="dropdown-item" @click="showDropdown = false">
                  <i class="fas fa-key"></i> Đổi mật khẩu
                </router-link>
                <router-link to="/change-phone" class="dropdown-item" @click="showDropdown = false">
                  <i class="fas fa-phone"></i> Đổi số điện thoại
                </router-link>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" @click.prevent="showLogoutConfirmation">
                  <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
              </div>
            </li>
          </template>

          <!-- Show when not authenticated -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Đăng nhập</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link">Đăng ký</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
  <Modal v-model="showLogoutModal" title="Xác nhận đăng xuất">
      <div class="logout-confirmation">
        <p>Bạn có chắc chắn muốn đăng xuất không?</p>
      </div>
      <template #footer>
        <div class="modal-footer-buttons">
          <button @click="cancelLogout" class="cancel-btn">Hủy</button>
          <button @click="confirmLogout" class="confirm-btn">Đăng xuất</button>
        </div>
      </template>
    </Modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'
const showLogoutModal = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

const showLogoutConfirmation = () => {
  showDropdown.value = false
  showLogoutModal.value = true
}

const cancelLogout = () => {
  showLogoutModal.value = false
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.container {
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1),
              0px -2px 4px rgba(0, 0, 0, 0.05),
              -2px 0px 4px rgba(0, 0, 0, 0.05),
              2px 0px 4px rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  background: #FFF8EF;
}

.container:hover {
  transform: scale(1.001);
  box-shadow: 0px 4px 10px rgba(255, 165, 0, 0.3),
              0px -4px 10px rgba(255, 165, 0, 0.15),
              -4px 0px 10px rgba(255, 165, 0, 0.15),
              4px 0px 10px rgba(255, 165, 0, 0.15);
}

.user-name {
  font-weight: bold;
  color: #ffa500;
  cursor: pointer;
}

.navbar {
  background: #ffffff; /* Gradient màu cam */
  padding: 1rem 2rem;
  color: #fff;
}

.navbar-brand {
  padding-left: 20px;
  color: #ffa500;
  font-weight: 500;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  transition: color 0.3s;
  font-weight: 500;
}

.nav-link:hover,
.router-link-active {
  color: #ffa500;
}

/* Dropdown styles */
.dropdown {
  position: relative;
}

.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%; /* Đảm bảo dropdown nằm ngay dưới phần "Tên" */
  left: 0;
  z-index: 1050; /* Đảm bảo dropdown luôn nằm trên cùng */
  min-width: 200px; /* Đảm bảo độ rộng tối thiểu */
  background-color: #ffffff; /* Màu nền trắng */
  border: 1px solid #e9ecef; /* Đường viền nhẹ */
  border-radius: 0.25rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.dropdown-menu.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
  z-index: 1050; /* Luôn giữ trên cùng */
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #ffa500;
  color: #fff;
}

.dropdown-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 0.5rem 0;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
}

.dropdown.show .fa-chevron-down {
  transform: rotate(180deg);
}

.fa-chevron-down.rotate {
  transform: rotate(180deg);
}

li {
  margin-right: 2rem;
}

.logout-confirmation {
  text-align: center;
  padding: 20px 0;
  font-size: 1.5rem;
}

.modal-footer-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background-color: #d0d0d0;
}

.confirm-btn:hover {
  background-color: #c82333;
}
</style>
