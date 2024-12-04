import axios from 'axios'

const APP_URL = import.meta.env.VITE_APP_API_URL

const api = axios.create({
  baseURL: APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

export default {}
