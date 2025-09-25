import axios from 'axios'

// Crea una instancia de Axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // O la URL de tu API desplegada en Render
  headers: {
    'Content-Type': 'application/json',
  },
})

// Añadimos un "interceptor" que adjuntará el token JWT a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
