import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TrackTrip from '@/views/TrackTrip.vue'
import Account from '@/views/Account.vue'
import Invoice from '@/views/Invoice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/track', name: 'TrackTrip', component: TrackTrip },
    { path: '/account', name: 'Account', component: Account },
    { path: '/invoice', name: 'Invoice', component: Invoice },
  ],
})

export default router
