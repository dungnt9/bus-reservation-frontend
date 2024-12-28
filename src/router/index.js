import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TrackTrip from '@/views/TrackTrip.vue'
import Invoice from '@/views/Invoice.vue'
import Login from '@/views/Login.vue'
import UserProfile from '@/views/UserProfile.vue'
import Payment from '@/views/Payment.vue'
import authService from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { public: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { public: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: UserProfile,
      meta: {
        requiresAuth: true,
        roles: ['customer', 'driver', 'assistant']
      }
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('../views/ChangePassword.vue'),
      meta: {
        requiresAuth: true,
        roles: ['customer', 'driver', 'assistant']
      }
    },
    {
      path: '/track',
      name: 'TrackTrip',
      component: TrackTrip,
      meta: {
        requiresAuth: true,
        roles: ['driver', 'assistant']
      }
    },
    {
      path: '/invoice',
      name: 'Invoice',
      component: Invoice,
      meta: {
        requiresAuth: true,
        roles: ['customer']
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { public: true }
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      meta: {
        requiresAuth: true,
        roles: ['customer']
      }
    },
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const currentUser = authService.getCurrentUser()
  const userRole = currentUser?.userRole

  // Public routes are always accessible
  if (to.meta.public) {
    next()
    return
  }

  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check role-based access
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/')
    return
  }

  next()
})

export default router
