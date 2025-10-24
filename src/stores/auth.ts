// En src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import router from '@/router'
import { connectSocket, disconnectSocket } from '@/services/socketService'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // Guardamos el token. Lo inicializamos con el valor que haya en localStorage.
  const token = ref(localStorage.getItem('token'))

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
  // --- ACTIONS ---
  const login = async (email: string, password: string) => {
    try {
      // Es buena práctica envolver el await en try...catch
      const response = await apiClient.post('/auth/login', { email, password })
      const newToken = response.data.token

      localStorage.setItem('token', newToken)
      token.value = newToken
      connectSocket()
      // 3. Usa la instancia importada
      await router.push('/app/tareas') // Añadir await por si hay lógica asíncrona en guardias
    } catch (error) {
      console.error('Error en login:', error)
      // Lanza el error para que el componente que llamó a login sepa que falló
      throw error
    }
  }

  /**
   * Maneja el logout del usuario.
   */
  const logout = () => {
    // Limpia el token de localStorage y del estado
    localStorage.removeItem('token')
    token.value = null
    // Redirige al login
    disconnectSocket()
    router.push('/auth')
  }
  const checkAuthAndConnect = () => {
    if (token.value) {
      connectSocket()
    }
  }
  return { token, isAuthenticated, login, logout, checkAuthAndConnect }
})
