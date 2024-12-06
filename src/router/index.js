import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchTrip from '@/views/SearchTrip.vue'
import TripDetail from '@/views/TripDetail.vue'
import BookTicket from '@/views/BookTicket.vue'
import TrackTrip from '@/views/TrackTrip.vue'
import Account from '@/views/Account.vue'
import Invoice from '@/views/Invoice.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/search', name: 'SearchTrip', component: SearchTrip },
    { path: '/trip/:id', name: 'TripDetail', component: TripDetail },
    { path: '/book', name: 'BookTicket', component: BookTicket },
    { path: '/track', name: 'TrackTrip', component: TrackTrip },
    { path: '/account', name: 'Account', component: Account },
    { path: '/invoice', name: 'Invoice', component: Invoice },
    { path: '/about', name: 'About', component: AboutView },
  ],
})

export default router
