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
  const userId = ref<number | null>(null)
  // --- GETTERS ---
  // Un getter para saber si el usuario está autenticado.
  const isAuthenticated = computed(() => !!token.value)

  // --- ACTIONS ---
  const fetchUserProfile = async () => {
    if (!token.value) return // Salir si no hay token
    try {
      const response = await apiClient.get('/users/me')
      userId.value = response.data.id // 👈 Guarda el ID
      // userProfile.value = response.data; // O guarda el perfil completo
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Podrías desloguear si el token es inválido (error 401)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.status === 401) {
        logout()
      }
    }
  }
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
      await fetchUserProfile()
      connectSocket()
      // 3. Usa la instancia importada
      await router.push({ name: 'PersonalTasks' })
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
    userId.value = null
    // Redirige al login
    disconnectSocket()
    router.push('/auth')
  }
  const checkAuthAndConnect = async () => {
    if (token.value) {
      await fetchUserProfile() // Obtiene el ID si hay token
      if (userId.value) {
        // Solo conecta si obtuvimos un ID válido
        connectSocket()
      }
    }
  }
  const currentUserId = computed(() => userId.value)
  return {
    token,
    isAuthenticated,
    currentUserId,
    login,
    logout,
    checkAuthAndConnect,
    userId,
    fetchUserProfile,
  }
})
