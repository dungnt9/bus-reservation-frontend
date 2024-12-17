<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <a class="navbar-brand" href="#">Jadoo</a>
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
                <router-link class="nav-link" to="/book">Đặt vé</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/invoice">Hóa đơn</router-link>
              </li>
            </template>

            <!-- For Drivers and Assistants -->
            <template v-if="['driver', 'assistant'].includes(authStore.userRole)">
              <li class="nav-item">
                <router-link class="nav-link" to="/track">Theo dõi chuyến xe</router-link>
              </li>
            </template>

            <!-- User info and logout -->
            <li class="nav-item">
              <span class="nav-link user-name">{{ authStore.userName }}</span>
            </li>
            <li class="nav-item">
              <button @click="handleLogout" class="sign-up-button">Đăng xuất</button>
            </li>
          </template>

          <!-- Show when not authenticated -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <button class="sign-up-button">Sign up</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-name {
  font-weight: 500;
  color: #ffa500;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff8ef;
  font-family: Arial, sans-serif;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: orange;
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
}

.nav-link:hover {
  color: #ffa500; /* Orange hover effect */
}

.sign-up-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid #333;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.sign-up-button:hover {
  background-color: #ffa500;
  color: white;
}

.language-selector {
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
}

.dropdown-icon {
  margin-left: 0.3rem;
  font-size: 0.8rem;
}

li {
  margin-right: 2rem;
}
</style>
