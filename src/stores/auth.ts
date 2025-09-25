// En src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // Guardamos el token. Lo inicializamos con el valor que haya en localStorage.
  const token = ref(localStorage.getItem('token'))
  const router = useRouter()

  // --- GETTERS ---
  // Un getter para saber si el usuario está autenticado.
  const isAuthenticated = computed(() => !!token.value)

  // --- ACTIONS ---
  /**
   * Maneja el login del usuario.
   * @param {string} email - El email del usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {Promise<void>}
   */
  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    const newToken = response.data.token

    // Guarda el token en localStorage
    localStorage.setItem('token', newToken)
    // Actualiza el estado del token
    token.value = newToken

    // Redirige a las tareas
    router.push('/tareas')
  }

  /**
   * Maneja el logout del usuario.
   */
  const logout = () => {
    // Limpia el token de localStorage y del estado
    localStorage.removeItem('token')
    token.value = null
    // Redirige al login
    router.push('/login')
  }

  return { token, isAuthenticated, login, logout }
})
