/* eslint-disable @typescript-eslint/no-unused-vars */
// ... tus imports
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ... otras rutas como la de login
  {
    path: '/tareas',
    name: 'Tareas',
    component: () => import('../views/ShowTareas.vue'),
    meta: { requiresAuth: true }, // 👈 Marca esta ruta como protegida
  },
  {
    path: '/auth', // Una sola ruta para la autenticación
    name: 'Auth',
    component: () => import('../views/AuthView.vue'),
    meta: { guest: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  const isAuth = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const isGuestRoute = to.meta.guest

  // Caso 1: La ruta requiere autenticación y el usuario no está logueado
  if (requiresAuth && !isAuth) {
    // Redirigir a la página de autenticación
    return { name: 'Auth' }
  }

  // Caso 2: La ruta es para "invitados" y el usuario YA está logueado
  if (isGuestRoute && isAuth) {
    // Redirigir a la página principal de tareas
    return { name: 'Tareas' }
  }

  // Si no se cumple ninguna de las condiciones anteriores, permite la navegación
  return true
})

export default router
